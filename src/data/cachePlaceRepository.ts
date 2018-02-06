
const debug = require('debug')('ournet-api');
import { PlaceRepository } from "@ournet/places-data";
import * as LRU from 'lru-cache';
import { RepAccessOptions } from "@ournet/domain";
import { IPlace, IOldPlaceId } from "@ournet/places-domain";
const ms = require('ms');
const objectHash = require('object-hash');

const OLD_IDS_CACHE = new LRU<string, IOldPlaceId>({
    max: 100,
    maxAge: ms('1d'),
});

const PLACES_CACHE = new LRU<string, IPlace[]>({
    max: 100,
    maxAge: ms('1h'),
});

const ADMIN1S_CACHE = new LRU<string, IPlace[]>({
    max: 100,
    maxAge: ms('2h'),
});

const PLACE_CACHE = new LRU<string, IPlace>({
    max: 100,
    maxAge: ms('1h'),
});

const ADMIN1_CACHE = new LRU<string, IPlace>({
    max: 100,
    maxAge: ms('2h'),
});


export class CachePlaceRepository extends PlaceRepository {

    private cacheGetData<D, R>(repName: string, cache: LRU.Cache<string, R>, data: D, options?: any): Promise<R> {
        const key = repName + ':' + (['number', 'string'].indexOf(typeof data) > -1 ? data.toString() : objectHash(data));
        const cacheResult = cache.get(key);
        if (cacheResult !== undefined) {
            debug(`got data from cache: ${key}`);
            return Promise.resolve(cacheResult);
        }

        return super[repName](data, options)
            .then((repResult: R) => {
                debug(`set data from cache: ${key}`);
                cache.set(key, repResult);
                return repResult;
            })
    }

    getAdmin1s(data: { country: string; limit: number; }, options?: RepAccessOptions<IPlace>): Promise<IPlace[]> {
        return this.cacheGetData<any, IPlace[]>('getAdmin1s', ADMIN1S_CACHE, data, options);
    }
    getAdmin1(data: { country: string; admin1Code: string; }, options?: RepAccessOptions<IPlace>): Promise<IPlace> {
        return this.cacheGetData<any, IPlace>('getAdmin1', ADMIN1_CACHE, data, options);
    }
    getPlacesInAdmin1(data: { country: string; admin1Code: string; limit: number; }, options?: RepAccessOptions<IPlace>): Promise<IPlace[]> {
        return this.cacheGetData<any, IPlace[]>('getPlacesInAdmin1', PLACES_CACHE, data, options);
    }
    getOldPlaceId(id: number): Promise<IOldPlaceId> {
        return this.cacheGetData<number, IOldPlaceId>('getOldPlaceId', OLD_IDS_CACHE, id);
    }
    getMainPlaces(data: { country: string; limit: number; }, options?: RepAccessOptions<IPlace>): Promise<IPlace[]> {
        return this.cacheGetData<any, IPlace[]>('getMainPlaces', PLACES_CACHE, data, options);
    }
    getById(id: number, options?: RepAccessOptions<IPlace>): Promise<IPlace> {
        return this.cacheGetData<number, IPlace>('getById', PLACE_CACHE, id, options);
    }
    getByIds(ids: number[], options?: RepAccessOptions<IPlace>): Promise<IPlace[]> {
        return this.cacheGetData<number[], IPlace[]>('getByIds', PLACES_CACHE, ids, options);
    }
}
