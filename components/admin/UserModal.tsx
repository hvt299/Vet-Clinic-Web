"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { usersService } from "@/services/users.service";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userToEdit: any;
}

export default function UserModal({ isOpen, onClose, onSuccess, userToEdit }: UserModalProps) {
    const [loading, setLoading] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        fullName: "",
        avatar: "",
        role: "STAFF" as "ADMIN" | "STAFF",
    });

    useEffect(() => {
        const cookie = Cookies.get("user");
        if (cookie) {
            const user = JSON.parse(cookie);
            setCurrentUserRole(user.role);
        }
    }, [isOpen]);

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                username: userToEdit.username,
                password: "",
                fullName: userToEdit.fullName,
                avatar: userToEdit.avatar || "",
                role: userToEdit.role as "ADMIN" | "STAFF",
            });
        } else {
            setFormData({
                username: "",
                password: "",
                fullName: "",
                avatar: "",
                role: "STAFF" as "ADMIN" | "STAFF",
            });
        }
    }, [userToEdit, isOpen]);

    const isStrongPassword = (pass: string) => {
        const regex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
        return pass.length >= 8 && regex.test(pass);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userToEdit) {
            if (!isStrongPassword(formData.password)) {
                toast.error("Mật khẩu quá yếu! Cần ít nhất 8 ký tự, bao gồm chữ HOA, thường, số và ký tự đặc biệt.");
                return;
            }
        }

        if (userToEdit && formData.role !== userToEdit.role) {
            const confirmChange = window.confirm(
                `⚠️ CẢNH BÁO QUAN TRỌNG:\n\nBạn đang thay đổi quyền của "${formData.fullName}" từ [${userToEdit.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}] sang [${formData.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}].\n\nViệc này sẽ thay đổi toàn bộ quyền truy cập hệ thống của họ.\nBạn có chắc chắn muốn tiếp tục?`
            );
            if (!confirmChange) return;
        }

        setLoading(true);

        try {
            if (userToEdit) {
                const { password, username, ...updateData } = formData;
                await usersService.update(userToEdit._id, updateData);
                toast.success("Cập nhật thông tin thành công!");
            } else {
                await usersService.create(formData);
                toast.success("Thêm người dùng mới thành công!");
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden !m-0">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                        {userToEdit ? "Cập nhật thông tin" : "Thêm người dùng mới"}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Tên đăng nhập</label>
                        <input
                            type="text"
                            required
                            disabled={!!userToEdit}
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none disabled:opacity-60 disabled:bg-gray-100"
                            placeholder="VD: nguyenvanan"
                        />
                    </div>

                    {/* Fullname */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Họ và tên</label>
                        <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none"
                            placeholder="VD: Nguyễn Văn An"
                        />
                    </div>

                    {/* Avatar */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Avatar URL</label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={formData.avatar}
                                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="https://example.com/avatar.jpg"
                            />
                            {/* Preview ảnh nhỏ bên cạnh */}
                            <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-gray-100 shrink-0">
                                {formData.avatar && <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />}
                            </div>
                        </div>
                    </div>

                    {/* Password (Chỉ hiện khi Thêm mới) */}
                    {!userToEdit && (
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Mật khẩu</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                * Yêu cầu: Ít nhất 8 ký tự, bao gồm chữ hoa, thường, số và ký tự đặc biệt.
                            </p>
                        </div>
                    )}

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Vai trò</label>
                        <select
                            disabled={currentUserRole !== 'ADMIN'} 
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as "ADMIN" | "STAFF" })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-zinc-800"
                        >
                            <option value="STAFF">Nhân viên</option>
                            <option value="ADMIN">Quản trị viên</option>
                        </select>
                        {currentUserRole !== 'ADMIN' && (
                            <p className="text-xs text-red-500 mt-1">
                                * Chỉ Quản trị viên mới có quyền thay đổi vai trò.
                            </p>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 transition"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-pink-600 shadow-sm shadow-primary/30 flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {userToEdit ? "Cập nhật" : "Thêm mới"}
                        </button>
                    </div>

                </form>
            </div>
        </div>,
        document.body
    );
}