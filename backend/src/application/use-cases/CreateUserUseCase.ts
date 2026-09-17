import { User } from '@/domain/entities/User';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { randomUUID } from 'crypto';
import { AppError } from '@/shared/errors/AppError';

export class CreateUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(data: CreateUserDTO): Promise<Omit<User, 'password'>> {
        const existingUser = await this.userRepository.findByEmail(data.email);

        if (existingUser) {
            throw new AppError('EMAIL_ALREADY_IN_USE', 'User already exists with this email', 409);
        }

        const user = new User(randomUUID(), data.username, data.email, data.password);

        if (!user.isValid()) {
            throw new AppError('INVALID_USER_DATA', 'Invalid user data', 400);
        }

        const createdUser = await this.userRepository.create(user);

        return createdUser.toPublicJSON() as Omit<User, 'password'>;
    }
}
