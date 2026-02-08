import { Plus, Edit, Key, Trash2, Search } from "lucide-react";

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Danh sách người dùng</h1>
                    <p className="text-sm text-gray-500">Quản lý tài khoản truy cập hệ thống</p>
                </div>
                <button className="flex items-center gap-2 bg-custom-green hover:bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all font-medium">
                    <Plus size={18} />
                    Thêm người dùng
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm theo tên đăng nhập hoặc họ tên..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Tên đăng nhập</th>
                                <th className="px-6 py-4">Họ tên</th>
                                <th className="px-6 py-4">Vai trò</th>
                                <th className="px-6 py-4">Ngày tạo</th>
                                <th className="px-6 py-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium">admin</td>
                                <td className="px-6 py-4">Quản trị viên</td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-custom-red border border-red-200">
                                        Quản trị viên
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">26-10-2025 10:30</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="p-2 bg-custom-yellow text-white rounded hover:bg-yellow-500 transition shadow-sm">
                                            <Edit size={16} />
                                        </button>
                                        <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition shadow-sm">
                                            <Key size={16} />
                                        </button>
                                        <button className="p-2 bg-custom-red text-white rounded hover:bg-red-600 transition shadow-sm">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {/* Thêm các dòng dummy khác nếu cần */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}