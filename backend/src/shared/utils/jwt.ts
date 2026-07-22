import jwt from 'jsonwebtoken';
import { config } from "../config";

export interface JwtPayload {
    userId: string;
    email: string;
}

export class JwtUtils {
    static generate(payload: JwtPayload): string {
        const expiresIn = config.jwt.expiresIn || '24h';
        return jwt.sign(payload, config.jwt.secret, { expiresIn } as jwt.SignOptions);
    }

    static verify(token: string): JwtPayload {
        return jwt.verify(token, config.jwt.secret) as JwtPayload;
    }
}