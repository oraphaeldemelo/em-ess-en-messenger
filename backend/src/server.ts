import { buildApp } from './main/app';
import { buildSocketServer } from './main/socket';

import { config } from './shared/config';

import { MongoDBConnection } from './infrastructure/database/MongoDBConnection';
import { SQLiteConnection } from './infrastructure/database/SQLiteConnection';

async function connectDatabase(): Promise<void> {
    if (config.database.type === 'sqlite') {
        const { SQLiteConnection } = await import('./infrastructure/database/SQLiteConnection');

        SQLiteConnection.getInstance().connect();
        return;
    }

    await MongoDBConnection.getInstance().connect();
}

async function disconnectDatabase(): Promise<void> {
    if (config.database.type === 'mongodb') {
        await MongoDBConnection.getInstance().disconnect();
        return;
    }
    SQLiteConnection.getInstance().disconnect();
}

async function start(): Promise<void> {
    try {
        await connectDatabase();

        const app = buildApp();

        const io = buildSocketServer(app.server);

        let isShuttingDown = false;

        const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
            if (isShuttingDown) {
                return;
            }

            isShuttingDown = true;
            app.log.info({ signal }, 'Shutdown signal received');

            try {
                io.disconnectSockets(true);
                await app.close();
                await disconnectDatabase();

                app.log.info('Application shutdown completed');
                process.exit(0);
            } catch (error) {
                app.log.error({ err: error }, 'Error during application shutdown');
                process.exit(1);
            }
        };

        process.once('SIGINT', () => {
            void shutdown('SIGINT');
        });
        process.once('SIGTERM', () => {
            void shutdown('SIGTERM');
        });

        await app.listen({
            port: config.server.port,
            host: '0.0.0.0',
        });

        app.log.info(`Server running on port ${config.server.port}`);
    } catch (error) {
        console.error('Failed to start application:', error);
        process.exit(1);
    }
}
void start();
