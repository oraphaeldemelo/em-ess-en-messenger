import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";


export function useAuth() {
    const { user, token, isAuthenticated, setAuth, clear } = useAuthStore();

    useEffect(() => {
        if(!user && token) {
            authService.me().then((u) => setAuth(u, token)).catch(() => clear());
        }
    }, [user, token]);

    return { user, token, isAuthenticated, setAuth, clear}
}