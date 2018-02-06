
const debug = require('debug')('ournet-api');
const holidays = require('public-holidays');
const ms = require('ms');
import * as LRU from 'lru-cache';

const CACHE = new LRU<string, any>({
    max: 10,
    maxAge: ms('3h'),
});

export default function (params: { country: string, lang: string, start?: number, end?: number }) {
    const key = `holidays:${params.country}_${params.lang}_${params.start || 0}_${params.end || 0}`;

    const cacheResult = CACHE.get(key);

    if (cacheResult) {
        debug(`holidays got from cache: ${key}`);
        return Promise.resolve(cacheResult);
    }

    return new Promise((resolve, reject) => {
        holidays(params, (error: any, result: any) => {
            if (error) {
                return reject(error);
            }

            const data: { [key: string]: any } = {};
            if (result) {
                result.forEach((item: any) => {
                    const key = item.start.toISOString().substr(0, 10);
                    data[key] = data[key] || [];
                    data[key].push(item);
                });
            }

            debug(`holidays set to cache: ${key}`);

            CACHE.set(key, data);

            resolve(data);
        })
    });
}
