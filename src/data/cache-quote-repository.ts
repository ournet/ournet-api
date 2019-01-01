
import LRU from 'lru-cache';
import ms = require('ms');
import { RepositoryAccessOptions } from "@ournet/domain";
import { CacheRepositoryStorage, CacheRepository } from './cache-repository';
import { Quote, QuoteRepository, LatestQuotesQueryParams, LatestQuotesByTopicQueryParams, LatestQuotesByAuthorQueryParams, CountQuotesByTopicQueryParams, CountQuotesQueryParams, CountQuotesByAuthorQueryParams, TopItem } from '@ournet/quotes-domain';


interface QuoteCacheRepositoryStorage extends CacheRepositoryStorage<Quote> {
    latest: LRU.Cache<string, Quote[]>
    latestByTopic: LRU.Cache<string, Quote[]>
    latestByAuthor: LRU.Cache<string, Quote[]>
    topTopics: LRU.Cache<string, TopItem[]>
    topAuthors: LRU.Cache<string, TopItem[]>
    topAuthorTopics: LRU.Cache<string, TopItem[]>
}

export class CacheQuoteRepository extends CacheRepository<Quote, QuoteRepository, QuoteCacheRepositoryStorage> implements QuoteRepository {

    constructor(rep: QuoteRepository) {
        super(rep, {
            getById: new LRU<string, Quote>({
                max: 100,
                maxAge: ms('10m'),
            }),

            getByIds: new LRU<string, Quote[]>({
                max: 100,
                maxAge: ms('5m'),
            }),

            latest: new LRU<string, Quote[]>({
                max: 50,
                maxAge: ms('10m'),
            }),

            latestByTopic: new LRU<string, Quote[]>({
                max: 50,
                maxAge: ms('10m'),
            }),

            latestByAuthor: new LRU<string, Quote[]>({
                max: 50,
                maxAge: ms('20m'),
            }),
            topTopics: new LRU<string, TopItem[]>({
                max: 100,
                maxAge: ms('20m'),
            }),
            topAuthors: new LRU<string, TopItem[]>({
                max: 100,
                maxAge: ms('20m'),
            }),
            topAuthorTopics: new LRU<string, TopItem[]>({
                max: 100,
                maxAge: ms('20m'),
            }),
        });
    }

    latest(params: LatestQuotesQueryParams, options?: RepositoryAccessOptions<Quote>) {
        return this.getCacheData(this.rep, 'latest', this.storage.latest, params, options);
    }
    latestByTopic(params: LatestQuotesByTopicQueryParams, options?: RepositoryAccessOptions<Quote>) {
        return this.getCacheData(this.rep, 'latestByTopic', this.storage.latestByTopic, params, options);
    }
    latestByAuthor(params: LatestQuotesByAuthorQueryParams, options?: RepositoryAccessOptions<Quote>) {
        return this.getCacheData(this.rep, 'latestByAuthor', this.storage.latestByAuthor, params, options);
    }
    count(params: CountQuotesQueryParams) {
        return this.rep.count(params);
    }
    countByTopic(params: CountQuotesByTopicQueryParams) {
        return this.rep.countByTopic(params);
    }
    countByAuthor(params: CountQuotesByAuthorQueryParams) {
        return this.rep.countByAuthor(params);
    }
    topTopics(params: LatestQuotesQueryParams) {
        return this.getCacheData(this.rep, 'topTopics', this.storage.topTopics, params);
    }
    topAuthors(params: LatestQuotesQueryParams) {
        return this.getCacheData(this.rep, 'topAuthors', this.storage.topAuthors, params);
    }
    topAuthorTopics(params: LatestQuotesByAuthorQueryParams) {
        return this.getCacheData(this.rep, 'topAuthorTopics', this.storage.topAuthorTopics, params);
    }
}
