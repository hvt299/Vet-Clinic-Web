"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { User, Shield, Key, Edit, Calendar, ShieldAlert } from "lucide-react";
import api from "@/lib/axios";
import UserModal from "@/components/admin/UserModal";
import ChangePasswordModal from "@/components/admin/ChangePasswordModal";
import { format } from "date-fns";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPassModalOpen, setIsPassModalOpen] = useState(false);

    const fetchProfile = async () => {
        const userCookie = Cookies.get("user");
        if (userCookie) {
            try {
                const userData = JSON.parse(userCookie);
                const userId = userData._id || userData.id;

                if (!userId) {
                    console.error("Cookie thiếu ID");
                    return null;
                }

                const res = await api.get(`/users/${userId}`);
                setUser(res.data);
                return res.data;
            } catch (err) {
                console.error("Lỗi tải profile:", err);
                return null;
            }
        }
        return null;
    };

    const updateCookie = (updatedUser: any) => {
        const oldCookie = Cookies.get("user");
        if (oldCookie) {
            const parsed = JSON.parse(oldCookie);
            const newUserData = {
                ...parsed,
                fullName: updatedUser.fullName,
                avatar: updatedUser.avatar,
                role: updatedUser.role
            };
            Cookies.set("user", JSON.stringify(newUserData), { expires: 1 });
        }
    };

    useEffect(() => { fetchProfile(); }, []);

    if (!user) return <div className="p-8 text-center text-gray-500">Đang tải thông tin...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Hồ sơ cá nhân</h1>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-border p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full border-4 border-primary/10 overflow-hidden shadow-lg bg-gray-100">
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullName}&background=random`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.fullName}&background=random`;
                            }}
                        />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase tracking-wide inline-flex items-center gap-1">
                        {user.role === 'ADMIN' ? <ShieldAlert size={14} /> : <Shield size={14} />}
                        {user.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}
                    </span>
                </div>

                {/* Info Section */}
                <div className="flex-1 w-full space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Họ tên */}
                        <div>
                            <label className="text-sm text-gray-500 block mb-1">Họ và tên</label>
                            <div className="font-medium text-lg flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                <User size={18} className="text-gray-400" /> {user.fullName}
                            </div>
                        </div>

                        {/* Tên đăng nhập */}
                        <div>
                            <label className="text-sm text-gray-500 block mb-1">Tên đăng nhập</label>
                            <div className="font-medium text-lg flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                <Shield size={18} className="text-gray-400" /> {user.username}
                            </div>
                        </div>

                        {/* Ngày tham gia */}
                        <div>
                            <label className="text-sm text-gray-500 block mb-1">Ngày tham gia</label>
                            <div className="font-medium text-lg flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                <Calendar size={18} className="text-gray-400" />
                                {user.createdAt ? format(new Date(user.createdAt), "dd/MM/yyyy") : "N/A"}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition"
                        >
                            <Edit size={18} /> Cập nhật thông tin
                        </button>
                        <button
                            onClick={() => setIsPassModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 font-medium transition"
                        >
                            <Key size={18} /> Đổi mật khẩu
                        </button>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            <UserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={async () => {
                    const freshData = await fetchProfile();
                    if (freshData) {
                        updateCookie(freshData);
                        setTimeout(() => window.location.reload(), 800);
                    }
                }}
                userToEdit={user}
            />

            <ChangePasswordModal
                isOpen={isPassModalOpen}
                onClose={() => setIsPassModalOpen(false)}
                userId={user._id || user.id}
            />
        </div>
    );
}