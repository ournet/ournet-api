
import { CachePlaceRepository } from './cachePlaceRepository';

export default {
    access: new CachePlaceRepository({ esOptions: { host: process.env.PLACES_ES_HOST } }),
}
