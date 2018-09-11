const debug = require('debug')('ournet-api');

import * as LRU from 'lru-cache';
import ms = require('ms');
const objectHash = require('object-hash');

import {
    PlaceRepository,
    PlaceSearchData,
    Place,
    PlacesAdminData,
    CountryPlacesData,
    PlaceAdminData,
    OldPlaceId,
} from "@ournet/places-domain";
import { RepositoryAccessOptions, RepositoryUpdateData } from "@ournet/domain";

const OLD_IDS_CACHE = new LRU<string, OldPlaceId>({
    max: 100,
    maxAge: ms('1d'),
});

const PLACES_CACHE = new LRU<string, Place[]>({
    max: 100,
    maxAge: ms('1h'),
});

const ADMIN1S_CACHE = new LRU<string, Place[]>({
    max: 100,
    maxAge: ms('2h'),
});

const PLACE_CACHE = new LRU<string, Place>({
    max: 100,
    maxAge: ms('1h'),
});

const ADMIN1_CACHE = new LRU<string, Place>({
    max: 100,
    maxAge: ms('2h'),
});

function cacheGetData<R>(rep: PlaceRepository, repName: keyof PlaceRepository, cache: LRU.Cache<string, R>, data: any, options?: any): Promise<R> {
    const key = repName + ':' + (['number', 'string'].indexOf(typeof data) > -1 ? data.toString() : objectHash(data));
    const cacheResult = cache.get(key);
    if (cacheResult !== undefined) {
        debug(`got data from cache: ${key}`);
        return Promise.resolve(cacheResult);
    }

    return (<any>rep)[repName](data, options)
        .then((repResult: R) => {
            debug(`set data from cache: ${key}`);
            cache.set(key, repResult);
            return repResult;
        });
}

export class CachePlaceRepository implements PlaceRepository {
    constructor(private rep: PlaceRepository) { }

    search(data: PlaceSearchData, options?: RepositoryAccessOptions<Place>) {
        return this.rep.search(data, options);
    }

    getAdmin1s(data: CountryPlacesData, options?: RepositoryAccessOptions<Place>) {
        return cacheGetData<Place[]>(this.rep, 'getAdmin1s', ADMIN1S_CACHE, data, options);
    }
    getAdmin1(data: PlaceAdminData, options?: RepositoryAccessOptions<Place>) {
        return cacheGetData<Place | null>(this.rep, 'getAdmin1', ADMIN1_CACHE, data, options);
    }
    getPlacesInAdmin1(data: PlacesAdminData, options?: RepositoryAccessOptions<Place>) {
        return cacheGetData<Place[]>(this.rep, 'getPlacesInAdmin1', PLACES_CACHE, data, options);
    }
    getOldPlaceId(id: number) {
        return cacheGetData<OldPlaceId | null>(this.rep, 'getOldPlaceId', OLD_IDS_CACHE, id);
    }
    getMainPlaces(data: CountryPlacesData, options?: RepositoryAccessOptions<Place>) {
        return cacheGetData<Place[]>(this.rep, 'getMainPlaces', PLACES_CACHE, data, options);
    }
    delete(id: string) {
        return this.rep.delete(id);
    }
    create(data: Place) {
        return this.rep.create(data);
    }
    update(data: RepositoryUpdateData<Place>) {
        return this.rep.update(data);
    }
    getById(id: string, options?: RepositoryAccessOptions<Place>) {
        return cacheGetData<Place>(this.rep, 'getById', PLACE_CACHE, id, options);
    }
    getByIds(ids: string[], options?: RepositoryAccessOptions<Place>) {
        return cacheGetData<Place[]>(this.rep, 'getByIds', PLACES_CACHE, ids, options);
    }
    exists(id: string) {
        return this.rep.exists(id);
    }
    deleteStorage() {
        return this.rep.deleteStorage();
    }
    createStorage() {
        return this.rep.createStorage();
    }

}
