import { Socket } from 'socket.io';

import { JwtUtils } from '../../shared/utils/jwt';

type SocketNext = (
    error?: ExtendedError,
) => void;

interface ExtendedError extends Error {
    data?: {
        code: string;
    }
}

export function socketAuthMiddleware (
    socket: Socket,
    next: SocketNext
): void {
    try {
        const token = socket.handshake.auth?.token;

        if (!token || typeof token !== 'string') {
            const error = new Error('Authentication token is required') as ExtendedError;

            error.data = { code: 'AUTH_TOKEN_REQUIRED' }

            next(error);
            return;
        }

        const payload = JwtUtils.verify(token);

        socket.data.user = {
            userId: payload.userId,
            email: payload.email,
        }
        next();
    } catch {
        const error = new Error('Invalid or expired authentication token') as ExtendedError;
        error.data = {
            code: 'AUTH_TOKEN_INVALID',
        }
        next(error);
    }
}