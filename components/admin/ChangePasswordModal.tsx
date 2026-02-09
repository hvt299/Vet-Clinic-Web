"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Key, Save } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
}

export default function ChangePasswordModal({ isOpen, onClose, userId }: ChangePasswordModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ oldPassword: "", newPassword: "" });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isStrongPassword = (pass: string) => {
        const regex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
        return pass.length >= 8 && regex.test(pass);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isStrongPassword(formData.newPassword)) {
            toast.error("Mật khẩu quá yếu! Cần ít nhất 8 ký tự, bao gồm chữ HOA, thường, số và ký tự đặc biệt.");
            return;
        }
        setLoading(true);

        try {
            await api.patch(`/users/change-password/${userId}`, formData);
            toast.success("Đổi mật khẩu thành công!");
            onClose();
            setFormData({ oldPassword: "", newPassword: "" });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi đổi mật khẩu");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden !m-0">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                        <Key size={20} className="text-yellow-500" /> Đổi mật khẩu
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Mật khẩu cũ</label>
                        <input
                            type="password"
                            required
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            placeholder="••••••••"
                            value={formData.oldPassword}
                            onChange={e => setFormData({ ...formData, oldPassword: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Mật khẩu mới</label>
                        <input
                            type="password"
                            required
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            placeholder="••••••••"
                            value={formData.newPassword}
                            onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            * Yêu cầu: Ít nhất 8 ký tự, bao gồm chữ hoa, thường, số và ký tự đặc biệt.
                        </p>
                    </div>

                    {/* Footer */}
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
                            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-pink-600 shadow-sm shadow-primary/30 flex items-center gap-2 disabled:opacity-70 transition-all"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Xác nhận
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}