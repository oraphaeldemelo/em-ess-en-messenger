import { User } from "@/types";
import { api } from "./api"

export const authService = {
    login: async (email: string, password: string) => {
        const { data } = await api.post<{ user: User; token: string }>('/auth/login', { email, password });
        return data;
    },
    register: async (username: string, email: string, password: string) => {
        const { data } = await api.post<{ user: User; token: string }>('/auth/register', { username, email, password });
        return data;
    },
    me: async () => { // ????
        const { data } = await api.get<User>('/auth/me');
        return data;
    }
}