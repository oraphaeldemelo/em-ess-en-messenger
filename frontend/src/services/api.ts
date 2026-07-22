import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:3000/api', // URL base do backend
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

api.interceptors.response.use((response) => response, (error) => {
    if(error.response.status === 401) {
        useAuthStore.getState().clear();
        window.location.href = '/login';
    }
    return Promise.reject(error);
})