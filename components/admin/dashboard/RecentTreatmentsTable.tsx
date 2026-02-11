"use client";

import { format } from "date-fns";
import { Activity } from "lucide-react";
import { RecentTreatment } from "@/services/statistics.service";
import Link from "next/link";

interface RecentTreatmentsTableProps {
    data: RecentTreatment[];
}

export default function RecentTreatmentsTable({ data }: RecentTreatmentsTableProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Activity className="text-primary" size={20} />
                    Bệnh nhân đang điều trị (Mới nhất)
                </h3>
                <Link href="/treatments" className="text-sm text-primary hover:underline font-medium">Xem tất cả</Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                        <tr>
                            <th className="px-4 py-3 rounded-tl-lg">Thú cưng</th>
                            <th className="px-4 py-3">Chủ nuôi</th>
                            <th className="px-4 py-3">Chẩn đoán</th>
                            <th className="px-4 py-3">Ngày nhập viện</th>
                            <th className="px-4 py-3 rounded-tr-lg text-right">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500 italic">
                                    Hiện không có ca điều trị nào.
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition">
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                        {item.petId?.name}
                                        <span className="block text-xs text-gray-500 font-normal">{item.petId?.species}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.customerId?.name}
                                        <span className="block text-xs text-gray-500">{item.customerId?.phoneNumber}</span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-[200px] truncate">
                                        {item.diagnosisSummary}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                        {format(new Date(item.startDate), "dd/MM/yyyy")}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-200">
                                            Đang điều trị
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}