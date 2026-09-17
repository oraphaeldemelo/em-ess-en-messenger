import { AppError } from '@/shared/errors/AppError';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export function errorHandler(
    error: FastifyError | Error,
    request: FastifyRequest,
    reply: FastifyReply,
) {
    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
            error: {
                code: error.code,
                message: error.message,
            },
        });
    }

    request.log.error(
        {
            err: error,
        },
        'Unhandled application error',
    );

    return reply.status(500).send({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal server error',
        },
    });
}
