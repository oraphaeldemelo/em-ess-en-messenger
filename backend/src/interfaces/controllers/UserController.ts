import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateUserUseCase } from '@/application/use-cases/CreateUserUseCase';
import { CreateUserDTO } from '@/application/dto/CreateUserDTO';

export class UserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async create(request: FastifyRequest<{ Body: CreateUserDTO }>, reply: FastifyReply) {
    try {
      const user = await this.createUserUseCase.execute(request.body);
      return reply.status(201).send(user);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }
}