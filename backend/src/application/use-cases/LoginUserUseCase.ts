import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { LoginUserDTO } from "../dto/CreateUserDTO";
import { IUser } from "@/domain/entities/User";
import { PasswordUtils } from "@/shared/utils/password";
import { JwtUtils } from "@/shared/utils/jwt";

export class LoginUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(data: LoginUserDTO): Promise<{ user: Omit<IUser, 'password'> ; token: string}> {
        const user = await this.userRepository.findByEmail(data.email);

        if(!user) {
            throw new Error('Email or password incorrect');
        }

        const isPasswordValid = await PasswordUtils.compare(data.password, user.password);

        if(!isPasswordValid) {
            throw new Error('Email or password incorrect');
        }
        
        const token = JwtUtils.generate({
            userId: user.id,
            email: user.email,
        })

        return { 
            user: user.toPublicJSON(),
            token
        }
    }
}