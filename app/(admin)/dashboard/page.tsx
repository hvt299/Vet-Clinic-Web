"use client";

import {
    Users, PawPrint, Calendar, DollarSign,
    TrendingUp, ArrowUpRight, ArrowDownRight, MoreHorizontal
} from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tổng quan</h1>
                    <p className="text-sm text-gray-500">Báo cáo hoạt động phòng khám hôm nay</p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1 rounded-lg border border-border shadow-sm">
                    <span className="text-sm font-medium px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-md">Hôm nay</span>
                    <span className="text-sm text-gray-500 px-3 py-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md transition">Tuần này</span>
                    <span className="text-sm text-gray-500 px-3 py-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md transition">Tháng này</span>
                </div>
            </div>

            {/* 2. Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Doanh thu"
                    value="12.500.000 đ"
                    trend="+15.3%"
                    isPositive={true}
                    icon={DollarSign}
                    color="bg-pink-500"
                />
                <StatCard
                    title="Lịch hẹn mới"
                    value="24"
                    trend="+4.1%"
                    isPositive={true}
                    icon={Calendar}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Khách hàng mới"
                    value="12"
                    trend="-2.5%"
                    isPositive={false}
                    icon={Users}
                    color="bg-yellow-500"
                />
                <StatCard
                    title="Thú cưng tiếp nhận"
                    value="38"
                    trend="+8.2%"
                    isPositive={true}
                    icon={PawPrint}
                    color="bg-green-500"
                />
            </div>

            {/* 3. Charts & Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Revenue Chart (Simulated with CSS) */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-border">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-800 dark:text-white">Biểu đồ doanh thu tuần</h3>
                        <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
                    </div>

                    {/* Mock Chart Bar */}
                    <div className="h-64 flex items-end justify-between gap-2">
                        {[40, 70, 45, 90, 65, 85, 55].map((height, index) => (
                            <div key={index} className="w-full flex flex-col items-center gap-2 group">
                                <div
                                    className="w-full bg-pink-100 dark:bg-pink-900/30 rounded-t-lg relative group-hover:bg-pink-200 transition-all cursor-pointer"
                                    style={{ height: `${height}%` }}
                                >
                                    <div
                                        className="absolute bottom-0 left-0 w-full bg-primary rounded-t-lg transition-all duration-500 group-hover:opacity-80"
                                        style={{ height: `${height * 0.7}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-500 font-medium">T{index + 2 === 8 ? "CN" : index + 2}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Top Services (List) */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-border">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Dịch vụ phổ biến</h3>
                    <div className="space-y-4">
                        <ServiceItem name="Tiêm Vaccine 5 bệnh" count={128} percent={75} color="bg-blue-500" />
                        <ServiceItem name="Spa - Cắt tỉa lông" count={96} percent={60} color="bg-pink-500" />
                        <ServiceItem name="Khám tổng quát" count={45} percent={30} color="bg-yellow-500" />
                        <ServiceItem name="Triệt sản mèo cái" count={24} percent={15} color="bg-green-500" />
                        <ServiceItem name="Cấp cứu" count={10} percent={8} color="bg-red-500" />
                    </div>
                </div>
            </div>

            {/* 4. Recent Appointments Table (Reusing your Users Table Structure) */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Lịch hẹn gần đây</h3>
                    <button className="text-sm text-primary font-medium hover:underline">Xem tất cả</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4 whitespace-nowrap">Khách hàng</th>
                                <th className="px-6 py-4 whitespace-nowrap">Thú cưng</th>
                                <th className="px-6 py-4 whitespace-nowrap">Dịch vụ</th>
                                <th className="px-6 py-4 whitespace-nowrap">Trạng thái</th>
                                <th className="px-6 py-4 whitespace-nowrap text-right">Thời gian</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <AppointmentRow
                                customer="Nguyễn Văn A"
                                pet="Milu (Chó)"
                                service="Tiêm Vaccine"
                                status="Đang chờ"
                                time="10:30 AM"
                                statusColor="bg-yellow-100 text-yellow-700 border-yellow-200"
                            />
                            <AppointmentRow
                                customer="Trần Thị B"
                                pet="Mimi (Mèo)"
                                service="Spa trọn gói"
                                status="Đang thực hiện"
                                time="10:45 AM"
                                statusColor="bg-blue-100 text-blue-700 border-blue-200"
                            />
                            <AppointmentRow
                                customer="Lê Văn C"
                                pet="Lu (Chó)"
                                service="Khám bệnh"
                                status="Hoàn thành"
                                time="09:15 AM"
                                statusColor="bg-green-100 text-custom-green border-green-200"
                            />
                            <AppointmentRow
                                customer="Phạm Thị D"
                                pet="Mướp (Mèo)"
                                service="Cấp cứu"
                                status="Đã hủy"
                                time="08:00 AM"
                                statusColor="bg-red-100 text-custom-red border-red-200"
                            />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// --- Sub Components (Để code gọn hơn) ---

function StatCard({ title, value, trend, isPositive, icon: Icon, color }: any) {
    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-border">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
                    <Icon size={24} className={color.replace('bg-', 'text-')} />
                </div>
                <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                    {isPositive ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                    {trend}
                </span>
            </div>
            <div>
                <p className="text-sm text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
            </div>
        </div>
    )
}

function ServiceItem({ name, count, percent, color }: any) {
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300 font-medium">{name}</span>
                <span className="text-gray-500">{count} ca</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2">
                <div className={`${color} h-2 rounded-full`} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    )
}

function AppointmentRow({ customer, pet, service, status, time, statusColor }: any) {
    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
            <td className="px-6 py-4 font-medium whitespace-nowrap">{customer}</td>
            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{pet}</td>
            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{service}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
                    {status}
                </span>
            </td>
            <td className="px-6 py-4 text-right text-gray-500 font-medium whitespace-nowrap">{time}</td>
        </tr>
    )
}