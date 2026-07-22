import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { CreateUserDTO } from "../dto/CreateUserDTO";
import { IUser, User } from "@/domain/entities/User";
import { PasswordUtils } from "@/shared/utils/password";
import { randomUUID } from "crypto";
import { JwtUtils } from "@/shared/utils/jwt";

export class RegisterUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(data: CreateUserDTO): Promise<{ user: Omit<IUser, 'password'>; token: string}> {
        const existingUser = await this.userRepository.findByEmail(data.email);

        if(existingUser) { 
            throw new Error("User already exists with this email");
        }
        const existingUsername = await this.userRepository.findByUsername(data.username);
        if(existingUsername) {
            throw new Error("User already exists with this username");
        }

        const hashedPassword = await PasswordUtils.hash(data.password);

        const user = new User(
            randomUUID(),
            data.username,
            data.email,
            hashedPassword
        )

        if(!user.isValid()) {
            throw new Error("Invalid user data");
        }

        const createdUser = await this.userRepository.create(user);

        const token = JwtUtils.generate({
            userId: createdUser.id,
            email: createdUser.email,
        })

        return {
            user: createdUser.toPublicJSON(),
            token,
        }
    }
}