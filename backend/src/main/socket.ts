import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

import { config } from '../shared/config';

import { socketAuthMiddleware } from '@/interfaces/middlewares/socketAuthMiddleware';
import { ClientToServerEvents, ServerToClientEvents } from '@/types/socketEvents';
import { joinRoomSchema, leaveRoomSchema, sendMessageSchema } from '@/interfaces/socket/socketSchemas';
import { validateSocketPayload } from '@/interfaces/socket/validateSocketPayload';

import { emitSocketError } from '@/interfaces/socket/emitSocketError';

import type {
    JoinRoomPayload,
    LeaveRoomPayload,
    SendMessagePayload
} from '../types/socketEvents'

export function buildSocketServer(httpServer: HttpServer): Server {
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
        cors: {
            origin: config.socket.corsOrigin,
            methods: [ 'GET', 'POST'],
            credentials: true,
        }
    })

    io.use(socketAuthMiddleware);

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id} - user: ${socket.data.user.userId}`);

        socket.on('join-room', (receivedPayload) => {
            const payload = validateSocketPayload<JoinRoomPayload>(
                joinRoomSchema,
                receivedPayload
            )

            if(!payload) {
                emitSocketError(
                    socket,
                    { 
                        code: 'INVALID_PAYLOAD',
                        message: 'Invalid join-room payload',
                    }
                )
                return;
            }

            socket.join(payload.roomId);

            console.log(`Socket ${socket.id} joined room ${payload.roomId}`)
        });

        socket.on('send-message', (receivedPayload) => {
            const payload = validateSocketPayload<SendMessagePayload>(
                sendMessageSchema,
                receivedPayload
            )
            if(!payload) {
                emitSocketError(
                    socket,
                    {
                        code: 'INVALID_PAYLOAD',
                        message: 'Invalid send-message payload',
                    }
                );
                return;
            };

            console.log(`Socket ${socket.id} sent message to room ${payload.roomId}`);
            socket.to(payload.roomId).emit('receive-message', payload.message);
        });

        socket.on('leave-room', (receivedPayload) => {
            const payload = validateSocketPayload<LeaveRoomPayload> (
                leaveRoomSchema, receivedPayload
            )

            if(!payload) {
                emitSocketError(
                    socket,
                    {
                        code: 'INVALID_PAYLOAD',
                        message: 'Invalid leave-room payload',
                    }
                );
                return;
            };

            socket.leave(payload.roomId);

            console.log(`Socket ${socket.id} left room ${payload.roomId}`);
        })

        socket.on('disconnect', (reason) => {
            console.log(`Socket disconnected: ${socket.id}. Reason: ${reason}`)
        })
    })

    return io;
}