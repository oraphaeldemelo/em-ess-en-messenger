import { IMessageRepository } from "@/domain/repositories/IMessageRepository";
import { SQLiteConnection } from "../../SQLiteConnection";
import { Message } from "@/domain/entities/Message";

export class SQLiteMessageRepository implements IMessageRepository {
    private db = SQLiteConnection.getInstance().getDatabase();

    async create(message: Message): Promise<Message> {
        const stmt = this.db.prepare(`
            INSERT INTO messages (id, content, sender_id, receiver_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)    
        `);

        stmt.run(
            message.id,
            message.content,
            message.senderId,
            message.receiverId,
            message.createdAt.toISOString(),
            message.updatedAt.toISOString()
        )

        return message;
    }

    async findById(id: string): Promise<Message | null> {
        const stmt = this.db.prepare('SELECT * FROM messages WHERE id = ?');

        const row = stmt.get(id) as any;

        return row ? this.mapRowToMessage(row) : null;
    }

    async findBySenderId(senderId: string): Promise<Message[]> {
        const stmt = this.db.prepare('SELECT * FROM messages WHERE sender_id = ? ORDER BY created_at ASC');

        const rows = stmt.all(senderId) as any[]; // as Message[]
        return rows?.map(row => this.mapRowToMessage(row));
    }

    async findByReceiverId(receiverId: string): Promise<Message[]> {
        const stmt = this.db.prepare('SELECT * FROM messages WHERE receiver_id = ? ORDER BY created_at ASC');

        const rows = stmt.all(receiverId) as any[];
        return rows.map(row => this.mapRowToMessage(row));
    }

    async findConversation(userId1: string, userId2: string): Promise<Message[]> {
        const stmt = this.db.prepare(`
            SELECT * FROM messages 
            WHERE (sender_id = ? AND receiver_id = ?)
            OR (sender_id = ? AND receiver_id = ?)
            ORDER BY created_at ASC    
        `)

        const rows = stmt.all(userId1, userId2, userId2, userId1) as any[];
        return rows.map(row => this.mapRowToMessage(row));
    }
    
    async update(id: string, messageData: Partial<Message>): Promise<Message | null> {
        const current = await this.findById(id);
        if(!current) return null;

        const stmt = this.db.prepare(`
            UPDATE messages 
            SET content = ?, updated_at = ?
            WHERE id = ?    
        `)
        
        stmt.run(
            messageData.content ?? current.content,
            new Date().toISOString(),
            id
        )
        return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const stmt = this.db.prepare('DELETE FROM messages WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }

    private mapRowToMessage(row: any): Message {
        return new Message(
            row.id,
            row.content,
            row.sender_id,
            row.receiver_id,
            new Date(row.created_at),
            new Date(row.updated_at)
        )
    }
}