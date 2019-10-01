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
  ) {
    if (!mongoClient.isConnected()) {
      throw new Error(`mongoClient must be connected!`);
    }
  }

  static async create(mongoConnectionString: string) {
    const client = await MongoClient.connect(mongoConnectionString);
    return new DbDataConnection(client, mongoConnectionString);
  }

  close() {
    return this.mongoClient.close();
  }
}
