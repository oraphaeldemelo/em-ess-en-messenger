import { User } from "@/domain/entities/User";
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { CreateUserDTO } from "../dto/CreateUserDTO";
import { randomUUID } from "crypto";

export class CreateUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(data: CreateUserDTO): Promise<Omit<User, 'password'>> {
        const existingUser = await this.userRepository.findByEmail(data.email);

        if(existingUser) {
            throw new Error("User already exists with this email");
        }

        const user = new User(
            randomUUID(),
            data.username,
            data.email,
            data.password
        )

        if(!user.isValid()){
            throw new Error("Invalid user data");
        }

        const createdUser = await this.userRepository.create(user);

        return createdUser.toPublicJSON() as Omit<User, 'password'>;
    }
}