import { User } from "@/types";
import { storage } from "@/utils/storage";
import { create } from "zustand";

type AuthState = {
    user: User | null;
    token: string | null;
    setAuth: (u: User, t: string) => void;
    clear: () => void;
    isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: storage.get<User>('user'),
    token: storage.get<string>('token'),
    isAuthenticated: !!storage.get<string>('token'),
    setAuth: (user, token) => {
        storage.set('user', user);
        storage.set('token', token);
        set({user, token, isAuthenticated: true });
    },
    clear: () => {
        storage.remove('user');
        storage.remove('token');
        set({ user: null, token: null, isAuthenticated: false });
    }
}))
