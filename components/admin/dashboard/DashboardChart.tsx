"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartData } from "@/services/statistics.service";

interface DashboardChartProps {
    data: ChartData[];
}

export default function DashboardChart({ data }: DashboardChartProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6 h-full">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Xu hướng Khám & Tiêm phòng (6 tháng)</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#F3F4F6' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar
                            name="Ca khám bệnh"
                            dataKey="treatments"
                            fill="#3B82F6"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                        <Bar
                            name="Ca tiêm phòng"
                            dataKey="vaccinations"
                            fill="#10B981"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}