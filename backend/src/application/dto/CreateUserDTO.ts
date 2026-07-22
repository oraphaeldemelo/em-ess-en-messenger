export interface CreateUserDTO {
    username: string;
    email: string;
    password: string;
}

export interface LoginUserDTO {
    email: string;
    password: string;
}

export interface CreateMessageDTO {
    content: string;
    senderId: string;
    receiverId: string;
}