import { RepositoryAccessOptions, RepositoryUpdateData } from "@ournet/domain";
import {
  Quote,
  QuoteRepository,
  ListQuotesQueryParams,
  ListQuotesByTopicQueryParams,
  ListQuotesByAuthorQueryParams,
  CountQuotesByTopicQueryParams,
  CountQuotesQueryParams,
  CountQuotesByAuthorQueryParams
} from "@ournet/quotes-domain";
import { SECONDS_1D, SECONDS_3H, SECONDS_6H, uniq } from "../utils";
import { CacheStorage } from "./cache-storage";

export class CacheQuoteRepository implements QuoteRepository {
  constructor(private rep: QuoteRepository, private storage: CacheStorage) {}
  delete(id: string): Promise<boolean> {
    return this.rep.delete(id);
  }
  create(data: Quote): Promise<Quote> {
    return this.rep.create(data);
  }
  update(data: RepositoryUpdateData<Quote>): Promise<Quote> {
    return this.rep.update(data);
  }

  getById(
    id: string,
    options?: RepositoryAccessOptions<Quote> | undefined
  ): Promise<Quote | null> {
    const key = this.storage.formatKey(["Quote", "getById", id]);

    return this.storage.executeCached(key, SECONDS_1D, () =>
      this.rep.getById(id, options)
    );
  }

  getByIds(
    ids: string[],
    options?: RepositoryAccessOptions<Quote> | undefined
  ): Promise<Quote[]> {
    const key = this.storage.formatKey(["Quote", "getByIds", ...uniq(ids)]);

    return this.storage.executeCached(key, SECONDS_6H, () =>
      this.rep.getByIds(ids, options)
    );
  }

  exists(id: string): Promise<boolean> {
    return this.rep.exists(id);
  }
  deleteStorage(): Promise<void> {
    return this.rep.deleteStorage();
  }
  createStorage(): Promise<void> {
    return this.rep.createStorage();
  }

  popularQuotes(
    _params: ListQuotesQueryParams,
    _options?: RepositoryAccessOptions<Quote> | undefined
  ): Promise<Quote[]> {
    throw new Error("Method not implemented.");
  }
  popularQuotesByTopic(
    _params: ListQuotesByTopicQueryParams,
    _options?: RepositoryAccessOptions<Quote> | undefined
  ): Promise<Quote[]> {
    throw new Error("Method not implemented.");
  }
  countPopularQuotes(_params: CountQuotesQueryParams): Promise<number> {
    throw new Error("Method not implemented.");
  }
  countPopularQuotesByTopic(
    _params: CountQuotesByTopicQueryParams
  ): Promise<number> {
    throw new Error("Method not implemented.");
  }
  countPopularQuotesByAuthor(
    _params: CountQuotesByAuthorQueryParams
  ): Promise<number> {
    throw new Error("Method not implemented.");
  }

  popularQuotesByAuthor(
    params: ListQuotesByAuthorQueryParams,
    options?: RepositoryAccessOptions<Quote>
  ) {
    const key = this.storage.formatKey([
      "Quote",
      "popularQuotesByAuthor",
      params.authorId,
      params.country,
      params.lang,
      params.limit,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_6H, () =>
      this.rep.popularQuotesByAuthor(params, options)
    );
  }

  latest(
    params: ListQuotesQueryParams,
    options?: RepositoryAccessOptions<Quote>
  ) {
    const key = this.storage.formatKey([
      "Quote",
      "latest",
      params.country,
      params.lang,
      params.limit,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_3H, () =>
      this.rep.latest(params, options)
    );
  }

  latestByTopic(
    params: ListQuotesByTopicQueryParams,
    options?: RepositoryAccessOptions<Quote>
  ) {
    const key = this.storage.formatKey([
      "Quote",
      "latestByTopic",
      params.topicId,
      params.country,
      params.lang,
      params.limit,
      params.relation || "",
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_6H, () =>
      this.rep.latestByTopic(params, options)
    );
  }

  latestByAuthor(
    params: ListQuotesByAuthorQueryParams,
    options?: RepositoryAccessOptions<Quote>
  ) {
    const key = this.storage.formatKey([
      "Quote",
      "latestByAuthor",
      params.authorId,
      params.country,
      params.lang,
      params.limit,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_6H, () =>
      this.rep.latestByAuthor(params, options)
    );
  }

  count(params: CountQuotesQueryParams) {
    const key = this.storage.formatKey([
      "Quote",
      "count",
      params.country,
      params.lang,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_6H, () =>
      this.rep.count(params)
    );
  }

  countByTopic(params: CountQuotesByTopicQueryParams) {
    const key = this.storage.formatKey([
      "Quote",
      "countByTopic",
      params.topicId,
      params.country,
      params.lang,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_6H, () =>
      this.rep.countByTopic(params)
    );
  }

  countByAuthor(params: CountQuotesByAuthorQueryParams) {
    const key = this.storage.formatKey([
      "Quote",
      "countByAuthor",
      params.authorId,
      params.country,
      params.lang,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_6H, () =>
      this.rep.countByAuthor(params)
    );
  }

  topTopics(params: ListQuotesQueryParams) {
    const key = this.storage.formatKey([
      "Quote",
      "topTopics",
      params.country,
      params.lang,
      params.limit,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_6H, () =>
      this.rep.topTopics(params)
    );
  }

  topAuthors(params: ListQuotesQueryParams) {
    const key = this.storage.formatKey([
      "Quote",
      "topAuthors",
      params.country,
      params.lang,
      params.limit,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_6H, () =>
      this.rep.topAuthors(params)
    );
  }

  topAuthorTopics(params: ListQuotesByAuthorQueryParams) {
    const key = this.storage.formatKey([
      "Quote",
      "topAuthorTopics",
      params.authorId,
      params.country,
      params.lang,
      params.limit,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_6H, () =>
      this.rep.topAuthorTopics(params)
    );
  }
}
