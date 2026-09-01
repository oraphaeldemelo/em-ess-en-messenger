import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

import { config } from '../shared/config';

export function buildSocketServer(httpServer: HttpServer): Server {
    const io = new Server(httpServer, {
        cors: {
            origin: config.socket.corsOrigin,
            methods: [ 'GET', 'POST'],
            credentials: true,
        }
    })

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('join-room', (roomId: string) => {
            socket.join(roomId);

            console.log(`Socket ${socket.id} joined room ${roomId}`)
        });

        socket.on('send-message', (data) => {
            socket.to(data.roomId).emit('receive-message', data);
        });

        socket.on('leave-room', (roomId: string) => {
            socket.leave(roomId);

            console.log(`Socket ${socket.id} left room ${roomId}`);
        })

        socket.on('disconnect', (reason) => {
            console.log(`Socket disconnected: ${socket.id}. Reason: ${reason}`)
        })
    })

    return io;
}