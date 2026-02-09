import api from "@/lib/axios";

export interface User {
    _id: string;
    username: string;
    fullName: string;
    role: 'ADMIN' | 'STAFF';
    avatar?: string;
    isActive?: boolean;
    createdAt?: string;
}

export const usersService = {
    getAll: async () => {
        const res = await api.get<User[]>("/users");
        return res.data;
    },
    getById: async (id: string) => {
        const res = await api.get<User>(`/users/${id}`);
        return res.data;
    },
    create: async (data: Partial<User> & { password?: string }) => {
        const res = await api.post("/users", data);
        return res.data;
    },
    update: async (id: string, data: Partial<User>) => {
        const res = await api.patch(`/users/${id}`, data);
        return res.data;
    },
    changePassword: async (id: string, data: { oldPassword?: string; newPassword: string }) => {
        const res = await api.patch(`/users/change-password/${id}`, data);
        return res.data;
    },
    delete: async (id: string) => {
        const res = await api.delete(`/users/${id}`);
        return res.data;
    }
};