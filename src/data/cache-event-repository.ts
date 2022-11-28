import { RepositoryAccessOptions, RepositoryUpdateData } from "@ournet/domain";
import {
  EventRepository,
  NewsEvent,
  LatestEventsQueryParams,
  LatestEventsByTopicQueryParams,
  CountEventsQueryParams,
  CountEventsByTopicQueryParams,
  TrendingTopicsQueryParams,
  SimilarEventsByTopicsQueryParams
} from "@ournet/news-domain";
import { SECONDS_1D, SECONDS_1H, SECONDS_3H, uniq } from "../utils";
import { CacheStorage } from "./cache-storage";

export class CacheEventRepository implements EventRepository {
  constructor(private rep: EventRepository, private storage: CacheStorage) {}
  delete(id: string): Promise<boolean> {
    return this.rep.delete(id);
  }
  create(data: NewsEvent): Promise<NewsEvent> {
    return this.rep.create(data);
  }
  update(data: RepositoryUpdateData<NewsEvent>): Promise<NewsEvent> {
    return this.rep.update(data);
  }

  getById(
    id: string,
    options?: RepositoryAccessOptions<NewsEvent> | undefined
  ): Promise<NewsEvent | null> {
    const key = this.storage.formatKey(["Event", "getById", id]);

    return this.storage.executeCached(key, SECONDS_1H, () =>
      this.rep.getById(id, options)
    );
  }

  getByIds(
    ids: string[],
    options?: RepositoryAccessOptions<NewsEvent> | undefined
  ): Promise<NewsEvent[]> {
    const key = this.storage.formatKey(["Event", "getByIds", ...uniq(ids)]);

    return this.storage.executeCached(key, SECONDS_1H, () =>
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

  latest(
    params: LatestEventsQueryParams,
    options?: RepositoryAccessOptions<NewsEvent>
  ) {
    const key = this.storage.formatKey([
      "Event",
      "latest",
      params.country,
      params.lang,
      params.limit,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_1H, () =>
      this.rep.latest(params, options)
    );
  }

  latestByTopic(
    params: LatestEventsByTopicQueryParams,
    options?: RepositoryAccessOptions<NewsEvent>
  ) {
    const key = this.storage.formatKey([
      "Event",
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

  count(params: CountEventsQueryParams) {
    const key = this.storage.formatKey([
      "Event",
      "count",
      params.country,
      params.lang,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_1D, () =>
      this.rep.count(params)
    );
  }

  countByTopic(params: CountEventsByTopicQueryParams) {
    const key = this.storage.formatKey([
      "Event",
      "countByTopic",
      params.topicId,
      params.country,
      params.lang,
      params.maxDate || "",
      params.minDate || ""
    ]);

    return this.storage.executeCached(key, SECONDS_1D, () =>
      this.rep.countByTopic(params)
    );
  }

  topTopics(params: LatestEventsQueryParams) {
    const key = this.storage.formatKey([
      "Event",
      "topTopics",
      params.country,
      params.lang,
      params.maxDate || "",
      params.minDate || "",
      params.limit
    ]);

    return this.storage.executeCached(key, SECONDS_1H, () =>
      this.rep.topTopics(params)
    );
  }

  trendingTopics(params: TrendingTopicsQueryParams) {
    const key = this.storage.formatKey([
      "Event",
      "trendingTopics",
      params.country,
      params.lang,
      params.limit,
      params.period
    ]);

    return this.storage.executeCached(key, SECONDS_1H, () =>
      this.rep.trendingTopics(params)
    );
  }

  viewNewsEvent(id: string): Promise<number> {
    return this.rep.viewNewsEvent(id);
  }

  similarByTopics(
    params: SimilarEventsByTopicsQueryParams,
    options?: RepositoryAccessOptions<NewsEvent>
  ) {
    const key = this.storage.formatKey([
      "Event",
      "similarByTopics",
      params.country,
      params.lang,
      params.maxDate || "",
      params.minDate || "",
      params.limit,
      params.exceptId || "",
      ...uniq(params.topicIds)
    ]);

    return this.storage.executeCached(key, SECONDS_1H, () =>
      this.rep.similarByTopics(params, options)
    );
  }
}
