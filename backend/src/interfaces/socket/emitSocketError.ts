import type  { Socket } from 'socket.io';

import type {
    ClientToServerEvents,
    ServerToClientEvents,
    SocketErrorPayload,
} from '@/types/socketEvents';

type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents>

export function emitSocketError (
    socket: AppSocket,
    error: SocketErrorPayload,
): void {
    socket.emit('socket-error', error)
}