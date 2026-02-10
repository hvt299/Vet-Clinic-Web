import api from "@/lib/axios";

export interface Medicine {
    _id: string;
    name: string;
    route: 'PO' | 'IM' | 'IV' | 'SC';
    description?: string;
    createdAt?: string;
}

export const medicinesService = {
    getAll: async () => {
        const res = await api.get<Medicine[]>("/medicines");
        return res.data;
    },
    create: async (data: Partial<Medicine>) => {
        const res = await api.post("/medicines", data);
        return res.data;
    },
    update: async (id: string, data: Partial<Medicine>) => {
        const res = await api.patch(`/medicines/${id}`, data);
        return res.data;
    },
    delete: async (id: string) => {
        const res = await api.delete(`/medicines/${id}`);
        return res.data;
    }
};