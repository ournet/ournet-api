import {
  PhraseRepository as HoroscopePhraseRepository,
  ReportRepository as HoroscopeReportRepository,
  Report
} from "@ournet/horoscopes-domain";
import { RepositoryUpdateData, RepositoryAccessOptions } from "@ournet/domain";
import { CacheStorage } from "./cache-storage";
import { SECONDS_6H, uniq } from "../utils";

export { HoroscopePhraseRepository, HoroscopeReportRepository };

export class CacheHoroscopeReportRepository
  implements HoroscopeReportRepository
{
  constructor(
    private rep: HoroscopeReportRepository,
    private storage: CacheStorage
  ) {}

  delete(id: string): Promise<boolean> {
    return this.rep.delete(id);
  }

  create(data: Report): Promise<Report> {
    return this.rep.create(data);
  }

  update(data: RepositoryUpdateData<Report>): Promise<Report> {
    return this.rep.update(data);
  }

  getByTextHash(hash: string, options?: RepositoryAccessOptions<Report>) {
    return this.rep.getByTextHash(hash, options);
  }

  async getById(
    id: string,
    options?: RepositoryAccessOptions<Report>
  ): Promise<Report | null> {
    const key = this.storage.formatKey(["horoGetById_1", id]);

    return this.storage.executeCached(
      key,
      SECONDS_6H,
      () => this.rep.getById(id, options),
      { omitNull: true }
    );
  }

  async getByIds(
    ids: string[],
    options?: RepositoryAccessOptions<Report>
  ): Promise<Report[]> {
    const key = this.storage.formatKey(["horoGetByIds_1", ...uniq(ids)]);

    return this.storage.executeCached(
      key,
      SECONDS_6H,
      () => this.rep.getByIds(ids, options),
      { omitNull: true }
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
