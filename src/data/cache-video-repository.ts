
import LRU from 'lru-cache';
import ms = require('ms');
import { CacheRepositoryStorage, CacheRepository } from './cache-repository';
import { Video, VideoRepository } from '@ournet/videos-domain';

interface VideoCacheRepositoryStorage extends CacheRepositoryStorage<Video> {

}

export class CacheVideoRepository extends CacheRepository<Video, VideoRepository, VideoCacheRepositoryStorage> implements VideoRepository {

    constructor(rep: VideoRepository) {
        super(rep, {
            getById: new LRU<string, Video>({
                max: 500,
                maxAge: ms('15m'),
            }),

            getByIds: new LRU<string, Video[]>({
                max: 50,
                maxAge: ms('5m'),
            }),
        });
    }
}
