import api from "@/lib/axios";

export interface Diagnosis {
    _id: string;
    treatmentSessionId: string;
    name: string;
    type: 'PRIMARY' | 'SECONDARY';
    clinicalTest?: string;
    note?: string;
    createdAt?: string;
}

export const diagnosesService = {
    getBySessionId: async (sessionId: string) => {
        const res = await api.get<Diagnosis[]>(`/diagnoses/by-session/${sessionId}`);
        return res.data;
    },
    create: async (data: any) => {
        const res = await api.post("/diagnoses", data);
        return res.data;
    },
    update: async (id: string, data: any) => {
        const res = await api.patch(`/diagnoses/${id}`, data);
        return res.data;
    },
    delete: async (id: string) => {
        const res = await api.delete(`/diagnoses/${id}`);
        return res.data;
    }
};