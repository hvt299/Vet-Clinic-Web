import api from "@/lib/axios";
import { User } from "./users.service";

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    user: User;
}

export const authService = {
    login: async (credentials: LoginCredentials) => {
        const res = await api.post<LoginResponse>("/auth/login", credentials);
        return res.data;
    }
};