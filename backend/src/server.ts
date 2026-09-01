import { buildApp } from './main/app';
import { buildSocketServer } from './main/socket';

import { config } from './shared/config';

import { MongoDBConnection } from './infrastructure/database/MongoDBConnection'

async function connectDatabase(): Promise<void> {
    if(config.database.type === 'sqlite') {
        const { SQLiteConnection } = await import('./infrastructure/database/SQLiteConnection')

        SQLiteConnection.getInstance().connect();
        return;
    }

    await MongoDBConnection.getInstance().connect();
}

async function start(): Promise<void> {
    try {
        await connectDatabase();

        const app = buildApp();

        buildSocketServer(app.server);

        await app.listen({
            port: config.server.port,
            host: '0.0.0.0',
        })

        app.log.info(`Server running on port ${config.server.port}`)
    } catch (error) {
        console.error('Failed to start application:', error);
        process.exit(1);
    }
}
void start();