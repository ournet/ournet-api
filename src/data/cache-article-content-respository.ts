import { RepositoryUpdateData, RepositoryAccessOptions } from "@ournet/domain";
import { ArticleContent, ArticleContentRepository } from "@ournet/news-domain";
import { SECONDS_1D, uniq } from "../utils";
import { CacheStorage } from "./cache-storage";

export class CacheActicleContentRepository implements ArticleContentRepository {
  constructor(
    private rep: ArticleContentRepository,
    private storage: CacheStorage
  ) {}

  put(content: ArticleContent): Promise<ArticleContent> {
    const key = this.storage.formatKey([
      "ArticleContent",
      "getById",
      content.id
    ]);
    this.storage.removeCacheValue(key);
    return this.rep.put(content);
  }

  delete(id: string): Promise<boolean> {
    const key = this.storage.formatKey(["ArticleContent", "getById", id]);
    this.storage.removeCacheValue(key);
    return this.rep.delete(id);
  }
  create(data: ArticleContent): Promise<ArticleContent> {
    return this.rep.create(data);
  }
  update(data: RepositoryUpdateData<ArticleContent>): Promise<ArticleContent> {
    return this.rep.update(data);
  }

  getById(
    id: string,
    options?: RepositoryAccessOptions<ArticleContent> | undefined
  ): Promise<ArticleContent | null> {
    const key = this.storage.formatKey(["ArticleContent", "getById", id]);

    return this.storage.executeCached(key, SECONDS_1D, () =>
      this.rep.getById(id, options)
    );
  }

  getByIds(
    ids: string[],
    options?: RepositoryAccessOptions<ArticleContent> | undefined
  ): Promise<ArticleContent[]> {
    const key = this.storage.formatKey([
      "ArticleContent",
      "getByIds",
      ...uniq(ids)
    ]);

    return this.storage.executeCached(key, SECONDS_1D, () =>
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
