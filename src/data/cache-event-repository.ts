
import LRU from 'lru-cache';
import ms = require('ms');
import { RepositoryAccessOptions } from "@ournet/domain";
import { EventRepository, NewsEvent, LatestEventsQueryParams, LatestEventsByTopicQueryParams, CountEventsQueryParams, CountEventsByTopicQueryParams, TrendingTopicsQueryParams, TopItem, SimilarEventsByTopicsQueryParams } from '@ournet/news-domain';
import { CacheRepositoryStorage, CacheRepository } from './cache-repository';

interface EventCacheRepositoryStorage extends CacheRepositoryStorage<NewsEvent> {
    similarEvents: LRU.Cache<string, NewsEvent[]>
    topTopics: LRU.Cache<string, TopItem[]>
    trendTopics: LRU.Cache<string, TopItem[]>
    latestEventsByTopic: LRU.Cache<string, NewsEvent[]>
    latestEvents: LRU.Cache<string, NewsEvent[]>
}

export class CacheEventRepository extends CacheRepository<NewsEvent, EventRepository, EventCacheRepositoryStorage> implements EventRepository {
    constructor(rep: EventRepository) {
        super(rep, {
            getById: new LRU<string, NewsEvent>({
                max: 100,
                maxAge: ms('10m'),
            }),

            getByIds: new LRU<string, NewsEvent[]>({
                max: 100,
                maxAge: ms('5m'),
            }),

            latestEvents: new LRU<string, NewsEvent[]>({
                max: 50,
                maxAge: ms('5m'),
            }),

            latestEventsByTopic: new LRU<string, NewsEvent[]>({
                max: 50,
                maxAge: ms('5m'),
            }),

            trendTopics: new LRU<string, TopItem[]>({
                max: 50,
                maxAge: ms('5m'),
            }),

            topTopics: new LRU<string, TopItem[]>({
                max: 100,
                maxAge: ms('5m'),
            }),

            similarEvents: new LRU<string, NewsEvent[]>({
                max: 100,
                maxAge: ms('20m'),
            }),
        });
    }

    latest(params: LatestEventsQueryParams, options?: RepositoryAccessOptions<NewsEvent>) {
        return this.getCacheData<NewsEvent[]>(this.rep, 'latest', this.storage.latestEvents, params, options);
    }
    latestByTopic(params: LatestEventsByTopicQueryParams, options?: RepositoryAccessOptions<NewsEvent>) {
        return this.getCacheData<NewsEvent[]>(this.rep, 'latestByTopic', this.storage.latestEventsByTopic, params, options);
    }
    count(params: CountEventsQueryParams) {
        return this.rep.count(params);
    }
    countByTopic(params: CountEventsByTopicQueryParams) {
        return this.rep.countByTopic(params);
    }
    topTopics(params: LatestEventsQueryParams) {
        return this.getCacheData<TopItem[]>(this.rep, 'topTopics', this.storage.topTopics, params);
    }
    trendingTopics(params: TrendingTopicsQueryParams) {
        return this.getCacheData<TopItem[]>(this.rep, 'trendingTopics', this.storage.trendTopics, params);
    }
    viewNewsEvent(id: string): Promise<number> {
        return this.rep.viewNewsEvent(id);
    }
    similarByTopics(params: SimilarEventsByTopicsQueryParams, options?: RepositoryAccessOptions<NewsEvent>) {
        return this.getCacheData<NewsEvent[]>(this.rep, 'similarByTopics', this.storage.similarEvents, params, options);
    }
}
