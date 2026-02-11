"use client";

import { Activity, Syringe, Stethoscope } from "lucide-react";
import { TodayStats } from "@/services/statistics.service";

interface RecentActivityProps {
    data: TodayStats | null;
}

export default function RecentActivity({ data }: RecentActivityProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6 h-full">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Hoạt động hôm nay</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full text-blue-600 dark:text-blue-200"><Syringe size={18} /></div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Lịch tiêm phòng</p>
                            <p className="text-xs text-gray-500">Đã lên lịch hôm nay</p>
                        </div>
                    </div>
                    <span className="text-xl font-bold text-blue-700 dark:text-blue-400">{data?.vaccinationsToday || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-900/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-full text-purple-600 dark:text-purple-200"><Activity size={18} /></div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Đang điều trị</p>
                            <p className="text-xs text-gray-500">Ca bệnh nội trú (ONGOING)</p>
                        </div>
                    </div>
                    <span className="text-xl font-bold text-purple-700 dark:text-purple-400">{data?.activeTreatments || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full text-green-600 dark:text-green-200"><Stethoscope size={18} /></div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Lượt khám bệnh</p>
                            <p className="text-xs text-gray-500">Đã thực hiện hôm nay</p>
                        </div>
                    </div>
                    <span className="text-xl font-bold text-green-700 dark:text-green-400">{data?.sessionsToday || 0}</span>
                </div>
            </div>
        </div>
    );
}