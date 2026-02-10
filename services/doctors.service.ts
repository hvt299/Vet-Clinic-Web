import api from "@/lib/axios";

export interface Doctor {
    _id: string;
    name: string;
    phoneNumber: string;
    identityCard?: string;
    gender?: 'MALE' | 'FEMALE' | 'UNKNOWN';
    address?: string;
    note?: string;
    isActive: boolean;
    avatar?: string;
    createdAt?: string;
}

export const doctorsService = {
    getAll: async () => {
        const res = await api.get<Doctor[]>("/doctors");
        return res.data;
    },
    create: async (data: Partial<Doctor>) => {
        const res = await api.post("/doctors", data);
        return res.data;
    },
    update: async (id: string, data: Partial<Doctor>) => {
        const res = await api.patch(`/doctors/${id}`, data);
        return res.data;
    },
    delete: async (id: string) => {
        const res = await api.delete(`/doctors/${id}`);
        return res.data;
    }
};