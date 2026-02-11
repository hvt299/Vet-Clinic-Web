"use client";

import { Users, PawPrint, Stethoscope, Pill } from "lucide-react";
import { GeneralStats } from "@/services/statistics.service";

interface DashboardCardsProps {
    data: GeneralStats | null;
}

export default function DashboardCards({ data }: DashboardCardsProps) {
    const cards = [
        { label: "Khách hàng", value: data?.totalCustomers || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Thú cưng", value: data?.totalPets || 0, icon: PawPrint, color: "text-pink-600", bg: "bg-pink-50" },
        { label: "Bác sĩ", value: data?.totalDoctors || 0, icon: Stethoscope, color: "text-green-600", bg: "bg-green-50" },
        { label: "Kho thuốc", value: data?.totalMedicines || 0, icon: Pill, color: "text-orange-600", bg: "bg-orange-50" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => (
                <div key={index} className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 flex items-center justify-between hover:shadow-md transition">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{card.value}</h3>
                    </div>
                    <div className={`p-3 rounded-full ${card.bg} ${card.color}`}>
                        <card.icon size={24} />
                    </div>
                </div>
            ))}
        </div>
    );
}