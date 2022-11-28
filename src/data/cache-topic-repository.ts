import { RepositoryAccessOptions, RepositoryUpdateData } from "@ournet/domain";
import { Topic, TopicRepository, TopicWikiId } from "@ournet/topics-domain";
import { SECONDS_1D, SECONDS_3D, SECONDS_7D, uniq } from "../utils";
import { CacheStorage } from "./cache-storage";

export class CacheTopicRepository implements TopicRepository {
  constructor(private rep: TopicRepository, private storage: CacheStorage) {}
  delete(id: string): Promise<boolean> {
    return this.rep.delete(id);
  }
  create(data: Topic): Promise<Topic> {
    return this.rep.create(data);
  }
  update(data: RepositoryUpdateData<Topic>): Promise<Topic> {
    return this.rep.update(data);
  }

  getById(
    id: string,
    options?: RepositoryAccessOptions<Topic> | undefined
  ): Promise<Topic | null> {
    const key = this.storage.formatKey(["Topic", "getById", id]);
    return this.storage.executeCached(key, SECONDS_7D, () =>
      this.rep.getById(id, options)
    );
  }

  getByIds(
    ids: string[],
    options?: RepositoryAccessOptions<Topic> | undefined
  ): Promise<Topic[]> {
    const key = this.storage.formatKey(["Topic", "getByIds", ...uniq(ids)]);
    return this.storage.executeCached(key, SECONDS_3D, () =>
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

  getByWikiIds(
    wikiIds: TopicWikiId[],
    options?: RepositoryAccessOptions<Topic>
  ) {
    const key = this.storage.formatKey([
      "Topic",
      "getByWikiIds",
      ...uniq(wikiIds.map((it) => [it.country, it.lang, it.wikiId].join("_")))
    ]);
    return this.storage.executeCached(key, SECONDS_1D, () =>
      this.rep.getByWikiIds(wikiIds, options)
    );
  }
}
