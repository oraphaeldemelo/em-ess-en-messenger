import { JwtUtils } from "@/shared/utils/jwt";
import { FastifyReply, FastifyRequest } from "fastify";

export interface AuthenticatedRequest extends FastifyRequest {
    user: {
        userId: string;
        email: string;
    }
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
    try {
        const authHeader = request.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return reply.status(401).send({ error: 'Required token'});
        }

        const token = authHeader.substring(7);
        const payload = JwtUtils.verify(token);

        (request as AuthenticatedRequest).user = payload
    } catch (error) {
        return reply.status(401).send({ error: 'Invalid token'})
    }
}