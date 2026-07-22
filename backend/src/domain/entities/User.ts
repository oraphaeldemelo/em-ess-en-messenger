export interface IUser {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export class User implements IUser {

    constructor(       
        public id: string,
        public username: string,
        public email: string,
        public password: string,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),
    ) {}

    isValid(): boolean {
        return !!(this.username && this.email && this.password);
    }

    update(data: Partial<Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>>): void {
        if(data.username) this.username = data.username;
        if(data.email) this.email = data.email;
        if(data.password) this.password = data.password;
        this.updatedAt = new Date();
    }

    toPublicJSON(): Omit<IUser, 'password'> {
        const { password, ...publicData } = this;
        return publicData;
    }
}