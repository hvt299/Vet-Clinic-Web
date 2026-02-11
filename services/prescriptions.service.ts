import api from "@/lib/axios";

export interface Prescription {
    _id: string;
    treatmentSessionId: string;
    medicineId: {
        _id: string;
        name: string;
        route?: string;
    };
    route: 'PO' | 'IM' | 'IV' | 'SC';
    dosage: number;
    unit: 'ml' | 'mg' | 'mg/kg' | 'g' | 'viên' | 'giọt' | '%';
    frequency: string;
    status: 'IN_PROGRESS' | 'COMPLETED';
    note?: string;
    createdAt?: string;
}

export const prescriptionsService = {
    getBySessionId: async (sessionId: string) => {
        const res = await api.get<Prescription[]>(`/prescriptions/by-session/${sessionId}`);
        return res.data;
    },
    create: async (data: any) => {
        const res = await api.post("/prescriptions", data);
        return res.data;
    },
    update: async (id: string, data: any) => {
        const res = await api.patch(`/prescriptions/${id}`, data);
        return res.data;
    },
    delete: async (id: string) => {
        const res = await api.delete(`/prescriptions/${id}`);
        return res.data;
    }
};