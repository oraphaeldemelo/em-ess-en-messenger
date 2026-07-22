import Database from "better-sqlite3";

export class SQLiteConnection {
    private static instance: SQLiteConnection;
    private db: Database.Database | null = null;

    private constructor() {}

    static getInstance(): SQLiteConnection {
        if(!SQLiteConnection.instance) {
            SQLiteConnection.instance = new SQLiteConnection();
        }
        return SQLiteConnection.instance;
    }

    connect(): void {
        try {
            this.db = new Database(':memory:');
            console.log('SQLite em memória conectado');
            this.createTables();
        } catch (error) {
            console.error('Erro ao conectar ao SQLite:', error);
            throw error;
        }
    }

    getDatabase(): Database.Database {
        if(!this.db){
            throw new Error('SQLite não está conectado');
        }
        return this.db;
    }

    private createTables(): void {
        if (!this.db) return;

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `)

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                content TEXT NOT NULL,
                sender_id TEXT NOT NULL,
                receiver_id TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sender_id) REFERENCES users (id),
                FOREIGN KEY (receiver_id) REFERENCES users(id)
            )    
        `)

        this.db.exec(`
            CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages (sender_id);
            CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages (receiver_id);
            CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (sender_id, receiver_id);    
        `)

        console.log('✅ Tabelas SQLite criadas');
    }

    disconnect(): void {
        if(this.db) {
            this.db.close();
            this.db = null;
            console.log('SQLite desconectado')
        }
    }

    clearData(): void {
        if (!this.db) return;

        this.db.exec('DELETE FROM messages');
        this.db.exec('DELETE FROM users');
        console.log('🧹 Dados SQLite limpos');
    }
}