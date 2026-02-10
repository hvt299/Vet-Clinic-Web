import api from "@/lib/axios";

export interface PetVaccination {
    _id: string;
    petId: {
        _id: string;
        name: string;
    };
    customerId: {
        _id: string;
        name: string;
        phoneNumber: string;
    };
    vaccineId: {
        _id: string;
        name: string;
    };
    doctorId: {
        _id: string;
        name: string;
    };
    vaccinationDate: string;
    nextVaccinationDate?: string;
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'MISSED';
    note?: string;
    createdAt?: string;
}

export const vaccinationsService = {
    getAll: async () => {
        const res = await api.get<PetVaccination[]>("/pet-vaccinations");
        return res.data;
    },
    create: async (data: any) => {
        const res = await api.post("/pet-vaccinations", data);
        return res.data;
    },
    update: async (id: string, data: any) => {
        const res = await api.patch(`/pet-vaccinations/${id}`, data);
        return res.data;
    },
    delete: async (id: string) => {
        const res = await api.delete(`/pet-vaccinations/${id}`);
        return res.data;
    }
};