"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Key, Trash2, Search, Loader2, ShieldAlert, Shield } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import UserModal from "@/components/admin/UserModal";
import ChangePasswordModal from "@/components/admin/ChangePasswordModal";
import Cookies from "js-cookie";
import { usersService, User } from "@/services/users.service";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isPassModalOpen, setIsPassModalOpen] = useState(false);
    const [passModalUserId, setPassModalUserId] = useState<string>("");
    const router = useRouter();
    const hasAlerted = useRef(false);

    const fetchUsers = async () => {
        try {
            const data = await usersService.getAll();
            setUsers(data);
        } catch (error) {
            toast.error("Không thể tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userCookie = Cookies.get("user");
        if (userCookie) {
            const user = JSON.parse(userCookie);
            if (user.role !== "ADMIN") {
                if (!hasAlerted.current) {
                    toast.error("Bạn không có quyền truy cập trang này!");
                    hasAlerted.current = true;
                }
                router.push("/dashboard");
                return;
            }
        } else {
             router.push("/login");
             return;
        }

        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

        try {
            await usersService.delete(id);
            toast.success("Đã xóa người dùng thành công");
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi khi xóa");
        }
    };

    const handleOpenAdd = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleOpenChangePass = (id: string) => {
        setPassModalUserId(id);
        setIsPassModalOpen(true);
    };

    const filteredUsers = users.filter(user =>
        (user.fullName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.username?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Danh sách người dùng</h1>
                    <p className="text-sm text-gray-500">Quản lý tài khoản truy cập hệ thống</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-custom-green hover:bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all font-medium"
                >
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                                <th className="px-6 py-4 whitespace-nowrap">Tên đăng nhập</th>
                                <th className="px-6 py-4 whitespace-nowrap">Họ tên</th>
                                <th className="px-6 py-4 whitespace-nowrap">Vai trò</th>
                                <th className="px-6 py-4 whitespace-nowrap">Ngày tạo</th>
                                <th className="px-6 py-4 text-center whitespace-nowrap">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <Loader2 className="animate-spin" /> Đang tải dữ liệu...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500">Không tìm thấy dữ liệu</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium whitespace-nowrap">{user.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.fullName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit
                                                ${user.role === 'ADMIN'
                                                    ? 'bg-red-100 text-custom-red border-red-200'
                                                    : 'bg-blue-100 text-blue-700 border-blue-200'}`
                                            }>
                                                {user.role === 'ADMIN' ? <ShieldAlert size={14} /> : <Shield size={14} />}
                                                {user.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            {user.createdAt ? format(new Date(user.createdAt), "dd-MM-yyyy HH:mm") : "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(user)}
                                                    className="p-2 bg-custom-yellow text-white rounded hover:bg-yellow-500 transition shadow-sm"
                                                    title="Sửa thông tin"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenChangePass(user._id)}
                                                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition shadow-sm"
                                                    title="Đổi mật khẩu">
                                                    <Key size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="p-2 bg-custom-red text-white rounded hover:bg-red-600 transition shadow-sm"
                                                    title="Xóa người dùng"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchUsers}
                userToEdit={selectedUser}
            />

            <ChangePasswordModal
                isOpen={isPassModalOpen}
                onClose={() => setIsPassModalOpen(false)}
                userId={passModalUserId}
            />
        </div>
    );
}