import { RepositoryAccessOptions, RepositoryUpdateData } from "@ournet/domain";
import {
  NewsRepository,
  NewsItem,
  CountNewsByEventQueryParams,
  CountNewsBySourceQueryParams,
  CountNewsByTopicQueryParams,
  CountNewsQueryParams,
  LatestNewsByEventQueryParams,
  LatestNewsBySourceQueryParams,
  LatestNewsByTopicQueryParams,
  LatestNewsQueryParams,
  NewsSearchParams,
  TopItem
} from "@ournet/news-domain";
import { SECONDS_1H, SECONDS_3H, uniq } from "../utils";
import { CacheStorage } from "./cache-storage";

export class CacheNewsRepository implements NewsRepository {
  constructor(private rep: NewsRepository, private storage: CacheStorage) {}
  search(
    params: NewsSearchParams,
    options?: RepositoryAccessOptions<NewsItem> | undefined
  ): Promise<NewsItem[]> {
    return this.rep.search(params, options);
  }

  latest(
    params: LatestNewsQueryParams,
    options?: RepositoryAccessOptions<NewsItem> | undefined
  ): Promise<NewsItem[]> {
    const key = this.storage.formatKey([
      "News",
      "latest",
      params.limit,
      params.country,
      params.lang,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_1H, () =>
      this.rep.latest(params, options)
    );
  }

  latestBySource(
    params: LatestNewsBySourceQueryParams,
    options?: RepositoryAccessOptions<NewsItem> | undefined
  ): Promise<NewsItem[]> {
    const key = this.storage.formatKey([
      "News",
      "latestBySource",
      params.sourceId,
      params.country,
      params.lang,
      params.limit,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_3H, () =>
      this.rep.latestBySource(params, options)
    );
  }

  latestByTopic(
    params: LatestNewsByTopicQueryParams,
    options?: RepositoryAccessOptions<NewsItem> | undefined
  ): Promise<NewsItem[]> {
    const key = this.storage.formatKey([
      "News",
      "latestByTopic",
      params.topicId,
      params.country,
      params.lang,
      params.limit,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_3H, () =>
      this.rep.latestByTopic(params, options)
    );
  }

  latestByEvent(
    params: LatestNewsByEventQueryParams,
    options?: RepositoryAccessOptions<NewsItem> | undefined
  ): Promise<NewsItem[]> {
    const key = this.storage.formatKey([
      "News",
      "latestByEvent",
      params.eventId,
      params.country,
      params.lang,
      params.limit,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_3H, () =>
      this.rep.latestByEvent(params, options)
    );
  }

  count(params: CountNewsQueryParams): Promise<number> {
    const key = this.storage.formatKey([
      "News",
      "count",
      params.country,
      params.lang,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_3H, () =>
      this.rep.count(params)
    );
  }

  countBySource(params: CountNewsBySourceQueryParams): Promise<number> {
    const key = this.storage.formatKey([
      "News",
      "countBySource",
      params.sourceId,
      params.country,
      params.lang,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_3H, () =>
      this.rep.countBySource(params)
    );
  }

  countByTopic(params: CountNewsByTopicQueryParams): Promise<number> {
    const key = this.storage.formatKey([
      "News",
      "countByTopic",
      params.topicId,
      params.country,
      params.lang,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_3H, () =>
      this.rep.countByTopic(params)
    );
  }

  countByEvent(params: CountNewsByEventQueryParams): Promise<number> {
    const key = this.storage.formatKey([
      "News",
      "countByEvent",
      params.eventId,
      params.country,
      params.lang,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_3H, () =>
      this.rep.countByEvent(params)
    );
  }

  topSources(params: LatestNewsQueryParams): Promise<TopItem[]> {
    const key = this.storage.formatKey([
      "News",
      "topSources",
      params.limit,
      params.country,
      params.lang,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_3H, () =>
      this.rep.topSources(params)
    );
  }

  topSourceTopics(params: LatestNewsBySourceQueryParams): Promise<TopItem[]> {
    const key = this.storage.formatKey([
      "News",
      "topSourceTopics",
      params.sourceId,
      params.limit,
      params.country,
      params.lang,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_3H, () =>
      this.rep.topSourceTopics(params)
    );
  }

  viewNewsItem(id: string): Promise<number> {
    return this.rep.viewNewsItem(id);
  }

  delete(id: string): Promise<boolean> {
    return this.rep.delete(id);
  }
  create(data: NewsItem): Promise<NewsItem> {
    return this.rep.create(data);
  }
  update(data: RepositoryUpdateData<NewsItem>): Promise<NewsItem> {
    return this.rep.update(data);
  }

  getById(
    id: string,
    options?: RepositoryAccessOptions<NewsItem> | undefined
  ): Promise<NewsItem | null> {
    const key = this.storage.formatKey(["NewsItem", "getById", id]);

    return this.storage.executeCached(key, SECONDS_3H, () =>
      this.rep.getById(id, options)
    );
  }

  getByIds(
    ids: string[],
    options?: RepositoryAccessOptions<NewsItem> | undefined
  ): Promise<NewsItem[]> {
    const key = this.storage.formatKey(["NewsItem", "getByIds", ...uniq(ids)]);

    return this.storage.executeCached(key, SECONDS_3H, () =>
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
}
