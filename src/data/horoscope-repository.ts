
const debug = require('debug')('ournet-api');

import * as LRU from 'lru-cache';
import ms = require('ms');
import {
    PhraseRepository as HoroscopePhraseRepository,
    ReportRepository as HoroscopeReportRepository,
    Report,
} from '@ournet/horoscopes-domain';
import { RepositoryUpdateData, RepositoryAccessOptions } from '@ournet/domain';

export { HoroscopePhraseRepository, HoroscopeReportRepository }

const REPORT_CACHE = new LRU<string, Report>({
    max: 100,
    maxAge: ms('30m'),
});
const REPORTS_CACHE = new LRU<string, Report[]>({
    max: 25,
    maxAge: ms('60m'),
});

export class CacheHoroscopeReportRepository implements HoroscopeReportRepository {
    constructor(private rep: HoroscopeReportRepository) { }

    delete(id: string): Promise<boolean> {
        return this.rep.delete(id);
    }
    create(data: Report): Promise<Report> {
        return this.rep.create(data);
    }
    update(data: RepositoryUpdateData<Report>): Promise<Report> {
        return this.rep.update(data);
    }
    async getById(id: string, options?: RepositoryAccessOptions<Report>): Promise<Report | null> {
        const key = id;
        const cacheResult = REPORT_CACHE.get(key);

        if (cacheResult) {
            debug(`getById: got from cache: ${key}`);
            return cacheResult;
        }

        const repResult = await this.rep.getById(id, options);

        if (repResult) {
            debug(`getById: set to cache: ${key}`);
            REPORT_CACHE.set(key, repResult);
        }

        return repResult;
    }
    async getByIds(ids: string[], options?: RepositoryAccessOptions<Report>): Promise<Report[]> {
        const key = ids.sort().join(',');
        const cacheResult = REPORTS_CACHE.get(key);

        if (cacheResult) {
            debug(`getByIds: got from cache: ${key}`);
            return cacheResult;
        }

        const repResult = await this.rep.getByIds(ids, options);

        if (repResult) {
            debug(`getByIds: set to cache: ${key}`);
            REPORTS_CACHE.set(key, repResult);
        }

        return repResult;
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
