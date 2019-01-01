
import LRU from 'lru-cache';
import ms = require('ms');

import {
    PlaceRepository,
    PlaceSearchData,
    Place,
    PlacesAdminData,
    CountryPlacesData,
    PlaceAdminData,
    OldPlaceId,
} from "@ournet/places-domain";
import { RepositoryAccessOptions } from "@ournet/domain";
import { CacheRepositoryStorage, CacheRepository } from './cache-repository';

interface PlaceCacheRepositoryStorage extends CacheRepositoryStorage<Place> {
    getAdmin1s: LRU.Cache<string, Place[]>
    getAdmin1: LRU.Cache<string, Place>
    getPlacesInAdmin1: LRU.Cache<string, Place[]>
    getOldPlaceId: LRU.Cache<string, OldPlaceId>
    getMainPlaces: LRU.Cache<string, Place[]>
}

export class CachePlaceRepository extends CacheRepository<Place, PlaceRepository, PlaceCacheRepositoryStorage> implements PlaceRepository {
    constructor(rep: PlaceRepository) {
        super(rep, {
            getById: new LRU<string, Place>({
                max: 100,
                maxAge: ms('1h'),
            }),

            getByIds: new LRU<string, Place[]>({
                max: 100,
                maxAge: ms('1h'),
            }),

            getAdmin1s: new LRU<string, Place[]>({
                max: 100,
                maxAge: ms('2h'),
            }),

            getAdmin1: new LRU<string, Place>({
                max: 100,
                maxAge: ms('2h'),
            }),
            getPlacesInAdmin1: new LRU<string, Place[]>({
                max: 100,
                maxAge: ms('1h'),
            }),

            getOldPlaceId: new LRU<string, OldPlaceId>({
                max: 100,
                maxAge: ms('1d'),
            }),
            getMainPlaces: new LRU<string, Place[]>({
                max: 100,
                maxAge: ms('1h'),
            }),
        })
    }

    search(data: PlaceSearchData, options?: RepositoryAccessOptions<Place>) {
        return this.rep.search(data, options);
    }

    getAdmin1s(data: CountryPlacesData, options?: RepositoryAccessOptions<Place>) {
        return this.getCacheData<Place[]>(this.rep, 'getAdmin1s', this.storage.getAdmin1s, data, options);
    }
    getAdmin1(data: PlaceAdminData, options?: RepositoryAccessOptions<Place>) {
        return this.getCacheData<Place | null>(this.rep, 'getAdmin1', this.storage.getAdmin1, data, options);
    }
    getPlacesInAdmin1(data: PlacesAdminData, options?: RepositoryAccessOptions<Place>) {
        return this.getCacheData<Place[]>(this.rep, 'getPlacesInAdmin1', this.storage.getPlacesInAdmin1, data, options);
    }
    getOldPlaceId(id: number) {
        return this.getCacheData<OldPlaceId | null>(this.rep, 'getOldPlaceId', this.storage.getOldPlaceId, id);
    }
    getMainPlaces(data: CountryPlacesData, options?: RepositoryAccessOptions<Place>) {
        return this.getCacheData<Place[]>(this.rep, 'getMainPlaces', this.storage.getMainPlaces, data, options);
    }
}
