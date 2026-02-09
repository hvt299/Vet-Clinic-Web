import api from "@/lib/axios";

export const settingsService = {
    get: async () => {
        const res = await api.get("/settings");
        return res.data;
    },
    update: async (data: any) => {
        const res = await api.patch("/settings", data);
        return res.data;
    }
};