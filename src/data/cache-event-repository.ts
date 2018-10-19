const debug = require('debug')('ournet-api');

import * as LRU from 'lru-cache';
import ms = require('ms');
const objectHash = require('object-hash');


import { RepositoryAccessOptions, RepositoryUpdateData } from "@ournet/domain";
import { EventRepository, NewsEvent, LatestEventsQueryParams, LatestEventsByTopicQueryParams, CountEventsQueryParams, CountEventsByTopicQueryParams, TrendingTopicsQueryParams, TopItem, SimilarEventsByTopicsQueryParams } from '@ournet/news-domain';

const EVENT_ID_CACHE = new LRU<string, NewsEvent>({
    max: 100,
    maxAge: ms('10m'),
});

const EVENT_IDS_CACHE = new LRU<string, NewsEvent[]>({
    max: 100,
    maxAge: ms('5m'),
});

const EVENT_LATEST_CACHE = new LRU<string, NewsEvent[]>({
    max: 50,
    maxAge: ms('5m'),
});

const EVENT_LATEST_TOPIC_CACHE = new LRU<string, NewsEvent[]>({
    max: 50,
    maxAge: ms('5m'),
});

const TREND_TOPICS_CACHE = new LRU<string, TopItem[]>({
    max: 50,
    maxAge: ms('5m'),
});

const SIMILAR_EVENTS_CACHE = new LRU<string, NewsEvent[]>({
    max: 100,
    maxAge: ms('20m'),
});

function cacheGetData<R>(rep: EventRepository, repName: keyof EventRepository, cache: LRU.Cache<string, R>, data: any, options?: any): Promise<R> {
    const key = repName + ':' + (['number', 'string'].indexOf(typeof data) > -1 ? data.toString() : objectHash(data));
    const cacheResult = cache.get(key);
    if (cacheResult !== undefined) {
        debug(`got data from cache: ${key}`);
        return Promise.resolve(cacheResult);
    }

    return (<any>rep)[repName](data, options)
        .then((repResult: R) => {
            debug(`set data to cache: ${key}`);
            cache.set(key, repResult);
            return repResult;
        });
}

export class CacheEventRepository implements EventRepository {
    constructor(private rep: EventRepository) { }

    delete(id: string) {
        return this.rep.delete(id);
    }
    create(data: NewsEvent) {
        return this.rep.create(data);
    }
    update(data: RepositoryUpdateData<NewsEvent>) {
        return this.rep.update(data);
    }
    getById(id: string, options?: RepositoryAccessOptions<NewsEvent>) {
        return cacheGetData<NewsEvent>(this.rep, 'getById', EVENT_ID_CACHE, id, options);
    }
    getByIds(ids: string[], options?: RepositoryAccessOptions<NewsEvent>) {
        return cacheGetData<NewsEvent[]>(this.rep, 'getByIds', EVENT_IDS_CACHE, ids, options);
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
    latest(params: LatestEventsQueryParams, options?: RepositoryAccessOptions<NewsEvent>) {
        return cacheGetData<NewsEvent[]>(this.rep, 'latest', EVENT_LATEST_CACHE, params, options);
    }
    latestByTopic(params: LatestEventsByTopicQueryParams, options?: RepositoryAccessOptions<NewsEvent>) {
        return cacheGetData<NewsEvent[]>(this.rep, 'latestByTopic', EVENT_LATEST_TOPIC_CACHE, params, options);
    }
    count(params: CountEventsQueryParams) {
        return this.rep.count(params);
    }
    countByTopic(params: CountEventsByTopicQueryParams) {
        return this.rep.countByTopic(params);
    }
    topTopics(params: LatestEventsQueryParams) {
        return this.rep.topTopics(params);
    }
    trendingTopics(params: TrendingTopicsQueryParams) {
        return cacheGetData<TopItem[]>(this.rep, 'trendingTopics', TREND_TOPICS_CACHE, params);
    }
    viewNewsEvent(id: string): Promise<number> {
        return this.rep.viewNewsEvent(id);
    }
    similarByTopics(params: SimilarEventsByTopicsQueryParams, options?: RepositoryAccessOptions<NewsEvent>) {
        return cacheGetData<NewsEvent[]>(this.rep, 'similarByTopics', SIMILAR_EVENTS_CACHE, params, options);
    }
}
