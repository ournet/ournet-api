
import { MongoClient } from 'mongodb';

export interface DataConnection {
    readonly topicsMongoClient: MongoClient
    close(): Promise<void>
}

export class DbDataConnection implements DataConnection {
    constructor(readonly topicsMongoClient: MongoClient) {
        if (!topicsMongoClient.isConnected()) {
            throw new Error(`topicsMongoClient must be connected!`);
        }
    }

    static async create(mongoConnectionString: string) {
        const client = await MongoClient.connect(mongoConnectionString);
        return new DbDataConnection(client);
    }

    close() {
        return this.topicsMongoClient.close();
    }
}
