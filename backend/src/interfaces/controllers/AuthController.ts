import { CreateUserDTO, LoginUserDTO } from "@/application/dto/CreateUserDTO";
import { LoginUserUseCase } from "@/application/use-cases/LoginUserUseCase";
import { RegisterUserUseCase } from "@/application/use-cases/RegisterUserUseCase";
import { FastifyReply, FastifyRequest } from "fastify";

export class AuthController {
    constructor(
        private registerUserUseCase: RegisterUserUseCase,
        private loginUserUseCase: LoginUserUseCase
    ) {}

    async register(req: FastifyRequest<{ Body: CreateUserDTO}>, reply: FastifyReply) {
        try {
            const result = await this.registerUserUseCase.execute(req.body);
            return reply.status(201).send(result);
        } catch (error: any) {
            return reply.status(400).send({ error: error.message })
        }
    }

    async login(request: FastifyRequest<{ Body: LoginUserDTO }>, reply: FastifyReply) {
        try {
            const result = await this.loginUserUseCase.execute(request.body);
            return reply.status(200).send(result);
        } catch (error: any) {
            return reply.status(401).send({ error: error.message })
        }
    }

}