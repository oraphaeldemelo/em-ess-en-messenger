import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { SQLiteConnection } from "../../SQLiteConnection";
import { User } from "@/domain/entities/User";

export class SQLiteUserRepository implements IUserRepository {
    private db = SQLiteConnection.getInstance().getDatabase();

    async create(user: User): Promise<User> {
        const stmt = this.db.prepare(`
            INSERT INTO users (id, username, email, password, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)    
        `);

        stmt.run(
            user.id, user.username, user.email, user.password, user.createdAt.toISOString(), user.updatedAt.toISOString()
        );
        return user;
    }

    async findById(id: string): Promise<User | null> {
        const stmt = this.db.prepare(`SELECT * FROM users WHERE id = ?`);

        const row = stmt.get(id) as any;

        return row ? this.mapRowToUser(row) : null;
    }

    async findByEmail(email: string) : Promise<User | null> {
        const stmt = this.db.prepare(`SELECT * from users WHERE email = ?`);
        const row = stmt.get(email) as any; // as User[]

        return row ? this.mapRowToUser(row) : null;
    }

    async findByUsername(username: string): Promise<User | null> {
        const stmt = this.db.prepare(`SELECT * FROM users WHERE username = ?`);

        const row = stmt.get(username) as any; // as User[]

        return row ? this.mapRowToUser(row) : null;
    }

    async update(id: string, userdata: Partial<User>): Promise<User | null> {
        const current = await this.findById(id);
        if (!current) return null;

        const stmt = this.db.prepare(`
            UPDATE users 
            SET username = ?, email = ?, password = ?, updated_at = ?
            WHERE id = ?
        `)

        stmt.run(
            userdata.username ?? current.username, 
            userdata.email ?? current.email, 
            userdata.password ?? current.password, 
            new Date().toISOString, 
            id
        );

        return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const stmt = this.db.prepare('DELETE FROM users WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }

    async findAll(): Promise<User[]> {
        const stmt = this.db.prepare('SELECT * FROM users ORDER BY created_at');
        const rows = stmt.all() as any[] // as User[]
        return rows.map(row => this.mapRowToUser(row));
    }

    private mapRowToUser(row: any): User {
        return new User(
            row.id,
            row.username,
            row.email,
            row.password,
            new Date(row.created_at),
            new Date(row.updated_at)
        )
    }
}