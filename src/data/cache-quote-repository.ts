
import LRU from 'lru-cache';
import ms = require('ms');
import { RepositoryAccessOptions } from "@ournet/domain";
import { CacheRepositoryStorage, CacheRepository } from './cache-repository';
import { Quote, QuoteRepository, ListQuotesQueryParams, ListQuotesByTopicQueryParams, ListQuotesByAuthorQueryParams, CountQuotesByTopicQueryParams, CountQuotesQueryParams, CountQuotesByAuthorQueryParams, TopItem } from '@ournet/quotes-domain';


interface QuoteCacheRepositoryStorage extends CacheRepositoryStorage<Quote> {
    latest: LRU.Cache<string, Quote[]>
    latestByTopic: LRU.Cache<string, Quote[]>
    latestByAuthor: LRU.Cache<string, Quote[]>
    topTopics: LRU.Cache<string, TopItem[]>
    topAuthors: LRU.Cache<string, TopItem[]>
    topAuthorTopics: LRU.Cache<string, TopItem[]>
    popularQuotesByAuthor: LRU.Cache<string, Quote[]>
}

export class CacheQuoteRepository extends CacheRepository<Quote, QuoteRepository, QuoteCacheRepositoryStorage> implements QuoteRepository {
    popularQuotes(_params: ListQuotesQueryParams, _options?: RepositoryAccessOptions<Quote> | undefined): Promise<Quote[]> {
        throw new Error("Method not implemented.");
    }
    popularQuotesByTopic(_params: ListQuotesByTopicQueryParams, _options?: RepositoryAccessOptions<Quote> | undefined): Promise<Quote[]> {
        throw new Error("Method not implemented.");
    }
    countPopularQuotes(_params: CountQuotesQueryParams): Promise<number> {
        throw new Error("Method not implemented.");
    }
    countPopularQuotesByTopic(_params: CountQuotesByTopicQueryParams): Promise<number> {
        throw new Error("Method not implemented.");
    }
    countPopularQuotesByAuthor(_params: CountQuotesByAuthorQueryParams): Promise<number> {
        throw new Error("Method not implemented.");
    }

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
            popularQuotesByAuthor: new LRU<string, Quote[]>({
                max: 100,
                maxAge: ms('20m'),
            }),
        });
    }

    popularQuotesByAuthor(params: ListQuotesByAuthorQueryParams, options?: RepositoryAccessOptions<Quote>) {
        return this.getCacheData(this.rep, 'popularQuotesByAuthor', this.storage.popularQuotesByAuthor, params, options);
    }

    latest(params: ListQuotesQueryParams, options?: RepositoryAccessOptions<Quote>) {
        return this.getCacheData(this.rep, 'latest', this.storage.latest, params, options);
    }
    latestByTopic(params: ListQuotesByTopicQueryParams, options?: RepositoryAccessOptions<Quote>) {
        return this.getCacheData(this.rep, 'latestByTopic', this.storage.latestByTopic, params, options);
    }
    latestByAuthor(params: ListQuotesByAuthorQueryParams, options?: RepositoryAccessOptions<Quote>) {
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
    topTopics(params: ListQuotesQueryParams) {
        return this.getCacheData(this.rep, 'topTopics', this.storage.topTopics, params);
    }
    topAuthors(params: ListQuotesQueryParams) {
        return this.getCacheData(this.rep, 'topAuthors', this.storage.topAuthors, params);
    }
    topAuthorTopics(params: ListQuotesByAuthorQueryParams) {
        return this.getCacheData(this.rep, 'topAuthorTopics', this.storage.topAuthorTopics, params);
    }

}
