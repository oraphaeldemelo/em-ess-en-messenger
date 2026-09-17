import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { IUser, User } from '@/domain/entities/User';
import { PasswordUtils } from '@/shared/utils/password';
import { randomUUID } from 'crypto';
import { JwtUtils } from '@/shared/utils/jwt';
import { AppError } from '@/shared/errors/AppError';

export class RegisterUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(data: CreateUserDTO): Promise<{ user: Omit<IUser, 'password'>; token: string }> {
        const existingUser = await this.userRepository.findByEmail(data.email);

        if (existingUser) {
            throw new AppError('EMAIL_ALREADY_IN_USE', 'User already exists with this email', 409);
        }

        const existingUsername = await this.userRepository.findByUsername(data.username);

        if (existingUsername) {
            throw new AppError(
                'USERNAME_ALREADY_IN_USE',
                'User already exists with this username',
                409,
            );
        }

        const hashedPassword = await PasswordUtils.hash(data.password);

        const user = new User(randomUUID(), data.username, data.email, hashedPassword);

        if (!user.isValid()) {
            throw new AppError('INVALID_USER_DATA', 'Invalid user data', 400);
        }

        const createdUser = await this.userRepository.create(user);

        const token = JwtUtils.generate({
            userId: createdUser.id,
            email: createdUser.email,
        });

        return {
            user: createdUser.toPublicJSON(),
            token,
        };
    }
}
