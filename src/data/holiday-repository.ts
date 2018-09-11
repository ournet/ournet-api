
const debug = require('debug')('ournet-api');
import { getHolidays } from 'public-holidays';
const ms = require('ms');
import * as LRU from 'lru-cache';

const CACHE = new LRU<string, PublicHoliday[]>({
    max: 10,
    maxAge: ms('3h'),
});

export type HolidaysGetParams = {
    country: string
    lang: string
    start?: number
    end?: number
}

export interface HolidayRepository {
    get(params: HolidaysGetParams): Promise<PublicHoliday[]>
}

export class CacheHolidayRepository implements HolidayRepository {
    async get(params: HolidaysGetParams) {
        const key = `holidays:${params.country}_${params.lang}_${params.start || 0}_${params.end || 0}`;

        const cacheResult = CACHE.get(key);

        if (cacheResult) {
            debug(`holidays got from cache: ${key}`);
            return cacheResult;
        }

        const data = await getHolidays({
            country: params.country,
            lang: params.lang,
            start: params.start && new Date(params.start * 1000) || undefined,
            end: params.end && new Date(params.end * 1000) || undefined,
            timeout: 2 * 1000,
        });

        const holidays = (data || []).map(item => ({ name: item.name, date: Math.floor(item.date.getTime() / 1000) }))
        CACHE.set(key, holidays);
        return holidays;
    }
}

export type PublicHoliday = {
    date: number
    name: string
}
