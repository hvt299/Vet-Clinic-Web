import api from "@/lib/axios";

export interface Vaccine {
    _id: string;
    name: string;
    description?: string;
}

export const vaccinesService = {
    getAll: async () => {
        const res = await api.get<Vaccine[]>("/vaccines");
        return res.data;
    },
    create: async (data: Partial<Vaccine>) => {
        const res = await api.post("/vaccines", data);
        return res.data;
    },
    update: async (id: string, data: Partial<Vaccine>) => {
        const res = await api.patch(`/vaccines/${id}`, data);
        return res.data;
    },
    delete: async (id: string) => {
        const res = await api.delete(`/vaccines/${id}`);
        return res.data;
    }
};