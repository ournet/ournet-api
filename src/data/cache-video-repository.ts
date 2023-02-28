import { RepositoryUpdateData, RepositoryAccessOptions } from "@ournet/domain";
import { Video, VideoRepository } from "@ournet/videos-domain";
import { CacheStorage } from "./cache-storage";

export class CacheVideoRepository implements VideoRepository {
  constructor(private rep: VideoRepository, private storage: CacheStorage) {}
  delete(id: string): Promise<boolean> {
    return this.rep.delete(id);
  }
  create(data: Video): Promise<Video> {
    return this.rep.create(data);
  }
  update(data: RepositoryUpdateData<Video>): Promise<Video> {
    this.storage.removeCacheValue("1");
    return this.rep.update(data);
  }

  getById(
    id: string,
    options?: RepositoryAccessOptions<Video> | undefined
  ): Promise<Video | null> {
    return this.rep.getById(id, options);
  }

  getByIds(
    ids: string[],
    options?: RepositoryAccessOptions<Video> | undefined
  ): Promise<Video[]> {
    return this.rep.getByIds(ids, options);
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
