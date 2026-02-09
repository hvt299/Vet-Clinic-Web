import api from "@/lib/axios";

export interface Pet {
    _id: string;
    customerId: {
        _id: string;
        name: string;
        phoneNumber: string;
    };
    name: string;
    species: string;
    gender: string;
    dob?: string;
    weight?: number;
    sterilization: boolean;
    characteristic?: string;
    drugAllergy?: string;
    createdAt?: string;
}

export const petsService = {
    getAll: async () => {
        const res = await api.get<Pet[]>("/pets");
        return res.data;
    },
    create: async (data: any) => {
        const res = await api.post("/pets", data);
        return res.data;
    },
    update: async (id: string, data: any) => {
        const res = await api.patch(`/pets/${id}`, data);
        return res.data;
    },
    delete: async (id: string) => {
        const res = await api.delete(`/pets/${id}`);
        return res.data;
    }
};