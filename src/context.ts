import { DataService, DbDataService } from "./data/data-service";
import { DataConnection, DbDataConnection } from "./data/data-connection";
import { getConfigFromEnv, Config } from "./config";
import { ApiContext } from "./container/api-context";

let instance: Context | null = null;

export class Context {
  readonly data: DataService;

  constructor(
    private connection: DataConnection,
    config: Config,
    public api: ApiContext
  ) {
    this.data = new DbDataService({
      newsESHost: config.NEWS_ES_HOST,
      placesESHost: config.PLACES_ES_HOST,
      mongoDb: connection.mongoClient.db(),
      mongoConnectionString: connection.mongoConnectionString
    });
  }

  destroy() {
    return this.connection.close();
  }

  static async create(api: ApiContext) {
    if (instance) {
      instance.api = api;
      return instance;
    }
    const config = getConfigFromEnv();
    const connection = await DbDataConnection.create(
      config.MONGO_DB_CONNECTION
    );
    instance = new Context(connection, config, api);

    await instance.data.init();

    return instance;
  }
}
