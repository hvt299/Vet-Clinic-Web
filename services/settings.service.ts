import api from "@/lib/axios";

export interface ClinicSettings {
    clinicName: string;
    logo: string;
    representativeName: string;
    email: string;
    phoneNumbers: string[];
    addresses: string[];
}

export const settingsService = {
    get: async () => {
        const res = await api.get<ClinicSettings>("/settings");
        return res.data;
    },
    update: async (data: Partial<ClinicSettings>) => {
        const res = await api.patch("/settings", data);
        return res.data;
    }
};