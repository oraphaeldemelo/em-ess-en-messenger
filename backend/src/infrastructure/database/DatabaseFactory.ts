import { IMessageRepository } from "@/domain/repositories/IMessageRepository";
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { SQLiteUserRepository } from "./repositories/SQLite/SQLiteUserRepository";
import { MongoUserRepository } from "./repositories/MongoDB/MongoUserRepository";
import { config } from "@/shared/config";
import { SQLiteMessageRepository } from "./repositories/SQLite/SQLiteMessageRepository";

export class DatabaseFactory {
    private static userRepository: IUserRepository | null = null;
    private static messageRepository: IMessageRepository | null = null;

    static getUserRepository(): IUserRepository {
        if(!this.userRepository) {
            switch(config.database.type) {
                case 'sqlite':
                    console.log('Using SQLite for User');
                    this.userRepository = new SQLiteUserRepository();
                    break;
                default: 
                console.log('Using default MongoDB for User');
                this.userRepository = new MongoUserRepository();
            }
        }
        return this.userRepository;
    }

    static getMessageRepository(): IMessageRepository {
        if(!this.messageRepository) {
            switch(config.database.type) {
                case 'sqlite':
                    console.log('Using SQLite for Message');
                    this.messageRepository = new SQLiteMessageRepository();
                    break;
                default:
                    console.log('Using default MongoDB for Message');
                    this.messageRepository = new SQLiteMessageRepository(); //new MongoMessageRepository();
                    
            }
        }
        return this.messageRepository;
    }

    static reset(): void {
        this.userRepository = null;
        this.messageRepository = null;
    }

    static clearData(): void {
        const { SQLiteConnection } = require('./SQLiteConnection');
        SQLiteConnection.getInstance().clearData();
        
    }
}