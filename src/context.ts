import { DataService, DbDataService } from './data/data-service';
import { DataConnection, DbDataConnection } from './data/data-connection';
import { getConfigFromEnv, Config } from './config';

export class Context {
    readonly data: DataService

    constructor(private connection: DataConnection, config: Config) {
        this.data = new DbDataService({
            newsESHost: config.NEWS_ES_HOST,
            placesESHost: config.PLACES_ES_HOST,
            topicsDb: connection.topicsMongoClient.db(),
        });
    }

    destroy() {
        return this.connection.close();
    }

    static async create() {
        const config = getConfigFromEnv();
        const connection = await DbDataConnection.create(config.TOPICS_DB_CONNECTION);
        const context = new Context(connection, config);

        await context.data.init();

        return context;
    }
}
