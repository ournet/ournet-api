
import * as LRU from 'lru-cache';
import ms = require('ms');
import { RepositoryAccessOptions } from "@ournet/domain";
import { CacheRepositoryStorage, CacheRepository } from './cache-repository';
import { Topic, TopicRepository, TopicWikiId } from '@ournet/topics-domain';


interface TopicCacheRepositoryStorage extends CacheRepositoryStorage<Topic> {
    getByWikiIds: LRU.Cache<string, Topic[]>
}

export class CacheTopicRepository extends CacheRepository<Topic, TopicRepository, TopicCacheRepositoryStorage> implements TopicRepository {

    constructor(rep: TopicRepository) {
        super(rep, {
            getById: new LRU<string, Topic>({
                max: 100,
                maxAge: ms('10m'),
            }),

            getByIds: new LRU<string, Topic[]>({
                max: 100,
                maxAge: ms('5m'),
            }),

            getByWikiIds: new LRU<string, Topic[]>({
                max: 100,
                maxAge: ms('5m'),
            }),
        });
    }

    getByWikiIds(wikiIds: TopicWikiId[], options?: RepositoryAccessOptions<Topic>) {
        return this.getCacheData(this.rep, 'getByWikiIds', this.storage.getByWikiIds, wikiIds, options);
    }
}
