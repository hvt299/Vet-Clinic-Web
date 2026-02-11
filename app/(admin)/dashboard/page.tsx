"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { statisticsService, GeneralStats, TodayStats, ChartData, RecentTreatment, TopDiagnosis } from "@/services/statistics.service";

import DashboardCards from "@/components/admin/dashboard/DashboardCards";
import DashboardChart from "@/components/admin/dashboard/DashboardChart";
import RecentActivity from "@/components/admin/dashboard/RecentActivity";
import RecentTreatmentsTable from "@/components/admin/dashboard/RecentTreatmentsTable";
import TopDiagnosesChart from "@/components/admin/dashboard/TopDiagnosesChart";

export default function DashboardPage() {
    const [generalStats, setGeneralStats] = useState<GeneralStats | null>(null);
    const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [recentTreatments, setRecentTreatments] = useState<RecentTreatment[]>([]);
    const [topDiagnoses, setTopDiagnoses] = useState<TopDiagnosis[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllStats = async () => {
            try {
                const [general, today, chart, recent, topDiag] = await Promise.all([
                    statisticsService.getGeneralStats(),
                    statisticsService.getTodayStats(),
                    statisticsService.getChartData(),
                    statisticsService.getRecentTreatments(),
                    statisticsService.getTopDiagnoses()
                ]);

                setGeneralStats(general);
                setTodayStats(today);
                setChartData(chart);
                setRecentTreatments(recent);
                setTopDiagnoses(topDiag);
            } catch (error) {
                toast.error("Không thể tải dữ liệu thống kê");
            } finally {
                setLoading(false);
            }
        };

        fetchAllStats();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">Đang tải dữ liệu Dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tổng quan phòng khám</h1>
                <p className="text-sm text-gray-500">Chào mừng trở lại! Dưới đây là tình hình hoạt động của phòng khám.</p>
            </div>

            {/* Cards */}
            <DashboardCards data={generalStats} />

            {/* LAYOUT GRID: Chia 3 cột (2 cho Chart cột, 1 cho Chart tròn) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <DashboardChart data={chartData} />
                </div>
                <div className="lg:col-span-1">
                    <TopDiagnosesChart data={topDiagnoses} />
                </div>
            </div>

            {/* Recent Activity & Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentTreatmentsTable data={recentTreatments} />
                </div>
                <div>
                    <RecentActivity data={todayStats} />
                </div>
            </div>
        </div>
    );
}