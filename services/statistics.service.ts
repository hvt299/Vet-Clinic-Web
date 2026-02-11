import api from "@/lib/axios";

export interface GeneralStats {
    totalCustomers: number;
    totalPets: number;
    totalDoctors: number;
    totalMedicines: number;
}

export interface TodayStats {
    vaccinationsToday: number;
    activeTreatments: number;
    sessionsToday: number;
}

export interface ChartData {
    name: string;
    treatments: number;
    vaccinations: number;
}

export interface RecentTreatment {
    _id: string;
    petId: {
        name: string;
        species: string;
    };
    customerId: {
        name: string;
        phoneNumber: string;
    };
    diagnosisSummary: string;
    startDate: string;
    status: string;
}

export interface TopDiagnosis {
    _id: string;
    count: number;
}

export const statisticsService = {
    getGeneralStats: async () => {
        const res = await api.get<GeneralStats>("/statistics/general");
        return res.data;
    },
    getTodayStats: async () => {
        const res = await api.get<TodayStats>("/statistics/today");
        return res.data;
    },
    getChartData: async () => {
        const res = await api.get<ChartData[]>("/statistics/revenue-chart");
        return res.data;
    },
    getRecentTreatments: async () => {
        const res = await api.get<RecentTreatment[]>("/statistics/recent-treatments");
        return res.data;
    },
    getTopDiagnoses: async () => {
        const res = await api.get<TopDiagnosis[]>("/statistics/top-diagnoses");
        return res.data;
    }
};