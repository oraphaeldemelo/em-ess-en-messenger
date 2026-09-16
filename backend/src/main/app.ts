import Fastify, { FastifyInstance } from "fastify"
import cors from '@fastify/cors';

import { userRoutes } from '../interfaces/routes/userRoute';
import { authRoutes } from '../interfaces/routes/authRoutes';
import { chatRoutes } from '../interfaces/routes/chatRoutes';

import { errorHandler } from "@/interfaces/http/errorHandler";
import { config } from '../shared/config'

export function buildApp(): FastifyInstance {
    const app = Fastify({ logger: true });

    app.setErrorHandler(
        errorHandler,
    )

    app.register(cors, {
        origin: config.cors.origin,
        credentials: true,
    });

    app.register(userRoutes, {
        prefix: '/api',
    });

    app.register(authRoutes, { 
        prefix: '/api/auth',
    });

    app.register(chatRoutes, {
        prefix: '/api',
    });

    return app;
}