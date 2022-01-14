import { MongoClient } from "mongodb";

export interface DataConnection {
  readonly mongoClient: MongoClient;
  readonly mongoConnectionString: string;
  close(): Promise<void>;
}

export class DbDataConnection implements DataConnection {
  constructor(
    readonly mongoClient: MongoClient,
    readonly mongoConnectionString: string
  ) {}

  static async create(mongoConnectionString: string) {
    const client = await new MongoClient(mongoConnectionString, {
      // useUnifiedTopology: true,
      // useNewUrlParser: true
    }).connect();
    return new DbDataConnection(client, mongoConnectionString);
  }

  close() {
    return this.mongoClient.close();
  }
}
