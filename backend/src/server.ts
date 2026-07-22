import Fastify from "fastify";
import { createServer } from "http";
import { userRoutes } from "./interfaces/routes/userRoute";
import { authRoutes } from './interfaces/routes/authRoutes';
import { chatRoutes } from './interfaces/routes/chatRoutes';
import { config } from "./shared/config";
import { Server } from "socket.io";
import { MongoDBConnection } from "./infrastructure/database/MongoDBConnection";
import cors from "@fastify/cors";

const fastify = Fastify({ logger: true});

// CORS
fastify.register(cors, { 
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
})

// Routes
fastify.register(userRoutes, { prefix: '/api'})
fastify.register(authRoutes, { prefix: '/api/auth'})
fastify.register(chatRoutes, { prefix: '/api'})

// Socket.io setup
const httpServer = createServer(fastify.server);
const io = new Server(httpServer, {
    cors: {
        origin: config.socket.corsOrigin,
        methods: ['GET', 'POST']
    }
})

// Socket events
io.on('connection', (socket) => {
    console.log("User connected: ", socket.id);

    socket.on('join-room', (roomId: string) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`)
    });

    socket.on('send-message', (data) => {
        socket.to(data.roomId).emit('receive-message', data);
    })

    socket.on('disconnect', () => {
        console.log(`User disconnected: `, socket.id);
    })
})

const start = async () => {
    try {
        if(config.database.type === 'sqlite') {
            const { SQLiteConnection } = await import('./infrastructure/database/SQLiteConnection');
            SQLiteConnection.getInstance().connect();
        } else {
            await MongoDBConnection.getInstance().connect();
        }
        
        await fastify.listen({ port: Number(config.server.port), host: '0.0.0.0'});
        console.log(`Server running on port ${config.server.port}`)
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();