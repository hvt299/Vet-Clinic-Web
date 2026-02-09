import api from "@/lib/axios";

export interface Customer {
    _id: string;
    name: string;
    gender: 'MALE' | 'FEMALE' | 'UNKNOWN';
    phoneNumber: string;
    identityCard?: string;
    address?: string;
    note?: string;
    createdAt?: string;
}

export const customersService = {
    getAll: async () => {
        const res = await api.get<Customer[]>("/customers");
        return res.data;
    },
    getById: async (id: string) => {
        const res = await api.get<Customer>(`/customers/${id}`);
        return res.data;
    },
    create: async (data: Partial<Customer>) => {
        const res = await api.post("/customers", data);
        return res.data;
    },
    update: async (id: string, data: Partial<Customer>) => {
        const res = await api.patch(`/customers/${id}`, data);
        return res.data;
    },
    delete: async (id: string) => {
        const res = await api.delete(`/customers/${id}`);
        return res.data;
    }
};