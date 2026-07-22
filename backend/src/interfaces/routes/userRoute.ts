import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController";
import { CreateUserUseCase } from "@/application/use-cases/CreateUserUseCase";
import { DatabaseFactory } from "@/infrastructure/database/DatabaseFactory";

export async function userRoutes(fastify: FastifyInstance) {
    const userRepository = DatabaseFactory.getUserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);
    const userController = new UserController(createUserUseCase);

    fastify.post('/users/', userController.create.bind(userController))
}