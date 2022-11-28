export type CacheStorageExecuteCachedOptions = {
  omitNull?: boolean;
};

/* eslint-disable @typescript-eslint/ban-types */
export interface CacheStorage {
  getCacheValue<T = {}>(key: string): Promise<T | undefined>;

  setCacheValue<T>(key: string, value: T, ttlSeconds: number): Promise<void>;

  removeCacheValue(key: string): Promise<void>;

  /** formats key by concatinating input strings */
  formatKey(input: (string | number | undefined)[]): string;

  executeCached<T>(
    key: string,
    ttlSeconds: number,
    fn: () => Promise<T>,
    options?: CacheStorageExecuteCachedOptions
  ): Promise<T>;
}

export abstract class BaseCacheStorage implements CacheStorage {
  abstract getCacheValue<T = {}>(key: string): Promise<T | undefined>;

  abstract setCacheValue<T>(
    key: string,
    value: T,
    ttlSeconds: number
  ): Promise<void>;

  abstract removeCacheValue(key: string): Promise<void>;

  formatKey(input: (string | number | undefined)[]): string {
    return `cache_${input.join("_")}`;
  }

  async executeCached<T>(
    key: string,
    ttl: number,
    fn: () => Promise<T>,
    options: CacheStorageExecuteCachedOptions = {}
  ): Promise<T> {
    const cacheData = await this.getCacheValue<T>(key);

    if (cacheData !== undefined) return cacheData;

    const data = await fn();

    const omitValues =
      options.omitNull === true ? [undefined, null] : [undefined];

    if (!omitValues.includes(data as never))
      await this.setCacheValue(key, data, ttl);

    return data;
  }
}
