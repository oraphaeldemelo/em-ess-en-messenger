import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { Collection } from "mongodb";
import { MongoDBConnection } from "../../MongoDBConnection";
import { User } from "@/domain/entities/User";

export class MongoUserRepository implements IUserRepository {
    private collection: Collection;

    constructor(){
        const db = MongoDBConnection.getInstance().getDatabase();
        this.collection = db.collection('users');
    }

    async create(user: User): Promise<User> {
        const result = await this.collection.insertOne(user);
        return {...user, id: result.insertedId.toString()} as unknown as User; // pedir para explicar esse retorno
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.collection.findOne({ id});
        return user ? new User(user.id, user.username, user.email, user.password, user.createdAt, user.updatedAt) : null;
    }

    async findByEmail(email: string): Promise<User | null> { 
        const user = await this.collection.findOne({ email });
        return user ? new User(user.id, user.username, user.email, user.password, user.createdAt, user.updatedAt) : null;
    }
    
    async findByUsername(username: string): Promise<User | null> {
        const user = await this.collection.findOne({ username });
        return user ? new User(user.id, user.username, user.email, user.password, user.createdAt, user.updatedAt) : null;
    }

    async update(id: string, userData: Partial<User>): Promise<User | null> {
        const result = await this.collection.findOneAndUpdate(
            { id },
            { $set: { ...userData, updatedAt: new Date() } },
            { returnDocument: 'after' }
        );
        return result?.value ? new User(result.value.id, result.value.username, result.value.email, result.value.password, result.value.createdAt, result.value.updatedAt): null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.collection.deleteOne({ id });
        return result.deletedCount > 0;
    }

    async findAll(): Promise<User[]> {
        const users = await this.collection.find().toArray();
        return users.map(user => new User(user.id, user.username, user.email, user.password, user.createdAt, user.updatedAt))
    }
}