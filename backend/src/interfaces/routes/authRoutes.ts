import { RegisterUserUseCase } from "@/application/use-cases/RegisterUserUseCase";
import { DatabaseFactory } from "@/infrastructure/database/DatabaseFactory";
import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/AuthController";
import { LoginUserUseCase } from "@/application/use-cases/LoginUserUseCase";

export async function authRoutes(fastify: FastifyInstance){
    const userRepository = DatabaseFactory.getUserRepository();

    const registerUserUseCase = new RegisterUserUseCase(userRepository);
    const loginUserUseCase = new LoginUserUseCase(userRepository);

    const authController = new AuthController(registerUserUseCase, loginUserUseCase);

    fastify.post('/register', authController.register.bind(authController));
    fastify.post('/login', authController.login.bind(authController));
}