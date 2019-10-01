const debug = require("debug")("ournet-api:cache");

import LRU from "lru-cache";
import objectHash from "object-hash";

import {
  RepositoryAccessOptions,
  RepositoryUpdateData,
  Repository,
  BaseEntity
} from "@ournet/domain";

export interface CacheRepositoryStorage<T extends BaseEntity> {
  getById: LRU.Cache<string, T>;
  getByIds: LRU.Cache<string, T[]>;
}

export class CacheRepository<
  T extends BaseEntity,
  REP extends Repository<T>,
  STORAGE extends CacheRepositoryStorage<T>
> implements Repository<T> {
  constructor(protected rep: REP, protected storage: STORAGE) {}

  protected async getCacheData<R>(
    rep: REP,
    repName: keyof REP,
    cache: LRU.Cache<string, R>,
    data: any,
    options?: any
  ): Promise<R> {
    const key =
      repName +
      ":" +
      (["number", "string"].indexOf(typeof data) > -1
        ? data.toString()
        : objectHash(data || {}));
    const cacheResult = cache.get(key);
    if (cacheResult !== undefined) {
      debug(`got data from cache: ${key}`);
      return cacheResult;
    }

    return (<any>rep)[repName](data, options).then((repResult: R) => {
      debug(`set data to cache: ${key}`);
      cache.set(key, repResult);
      return repResult;
    });
  }

  delete(id: string) {
    return this.rep.delete(id);
  }
  create(data: T) {
    return this.rep.create(data);
  }
  update(data: RepositoryUpdateData<T>) {
    return this.rep.update(data);
  }
  getById(id: string, options?: RepositoryAccessOptions<T>) {
    return this.getCacheData<T>(
      this.rep,
      "getById",
      this.storage.getById,
      id,
      options
    );
  }
  getByIds(ids: string[], options?: RepositoryAccessOptions<T>) {
    return this.getCacheData<T[]>(
      this.rep,
      "getByIds",
      this.storage.getByIds,
      ids,
      options
    );
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
