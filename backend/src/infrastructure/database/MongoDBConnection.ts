import { Db, MongoClient } from "mongodb";
import { config } from "@/shared/config";

export class MongoDBConnection {
    private static instance: MongoDBConnection;
    private client: MongoClient;
    private db: Db | null = null;

    private constructor() {
        this.client = new MongoClient(config.database.uri);
    }

    static getInstance(): MongoDBConnection {
        if(!MongoDBConnection.instance) {
            MongoDBConnection.instance = new MongoDBConnection();
        }
        return MongoDBConnection.instance;
    }

    async connect(): Promise<void> {
        try {
            await this.client.connect();
            this.db = this.client.db();
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("MongoDB connection error: ", error);
            throw error;
        }
    }

    getDatabase(): Db {
        if(!this.db) {
            throw new Error("Database not connected");
        }
        return this.db;
    }

    async disconnect(): Promise<void> {
        await this.client.close();
    }
}