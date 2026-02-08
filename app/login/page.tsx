"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PawPrint, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post("/auth/login", formData);

            const { access_token, user } = res.data;
            Cookies.set("token", access_token, { expires: 1 });
            Cookies.set("user", JSON.stringify(user), { expires: 1 });

            toast.success(`Xin chào, ${user.fullName || 'Admin'}!`);
            router.push("/dashboard");

        } catch (error: any) {
            const message = error.response?.data?.message || "Đăng nhập thất bại!";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4">
            <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-zinc-800">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <PawPrint className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chào mừng trở lại!</h1>
                    <p className="text-gray-500 mt-2">Đăng nhập vào hệ thống quản lý Min Min</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Tên đăng nhập</label>
                        <input
                            type="text"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                            placeholder="admin"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Mật khẩu</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-primary hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Đăng nhập"}
                    </button>
                </form>
            </div>
        </div>
    );
}