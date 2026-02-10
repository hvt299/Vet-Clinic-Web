import api from "@/lib/axios";

export interface TreatmentCourse {
    _id: string;
    customerId: {
        _id: string;
        name: string;
        phoneNumber: string;
    };
    petId: {
        _id: string;
        name: string;
        species?: string;
    };
    diagnosisSummary: string;
    startDate: string;
    endDate?: string;
    status: 'ONGOING' | 'RECOVERED';
    createdAt: string;
}

export const treatmentCoursesService = {
    getAll: async () => {
        const res = await api.get<TreatmentCourse[]>("/treatment-courses");
        return res.data;
    },
    create: async (data: any) => {
        const res = await api.post("/treatment-courses", data);
        return res.data;
    },
    update: async (id: string, data: any) => {
        const res = await api.patch(`/treatment-courses/${id}`, data);
        return res.data;
    },
    delete: async (id: string) => {
        const res = await api.delete(`/treatment-courses/${id}`);
        return res.data;
    }
};