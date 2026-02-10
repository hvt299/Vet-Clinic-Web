import api from "@/lib/axios";

export interface TreatmentSession {
    _id: string;
    treatmentCourseId: string;
    doctorId: {
        _id: string;
        name: string;
    };
    examinedAt: string;
    temperature?: number;
    weight?: number;
    pulseRate?: number;
    respiratoryRate?: number;
    overallNote: string;
}

export const treatmentSessionsService = {
    getByCourseId: async (courseId: string) => {
        const res = await api.get<TreatmentSession[]>(`/treatment-sessions/by-course/${courseId}`);
        return res.data;
    },
    create: async (data: any) => {
        const res = await api.post("/treatment-sessions", data);
        return res.data;
    },
    update: async (id: string, data: any) => {
        const res = await api.patch(`/treatment-sessions/${id}`, data);
        return res.data;
    },
    delete: async (id: string) => {
        const res = await api.delete(`/treatment-sessions/${id}`);
        return res.data;
    }
};