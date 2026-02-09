"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { Moon, Sun, Menu, Bell, Search, User, Key, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const [user, setUser] = useState<{ fullName: string; avatar?: string; role: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);

        const userCookie = Cookies.get("user");
        if (userCookie) {
            try {
                setUser(JSON.parse(userCookie));
            } catch (error) {
                console.error("Lỗi đọc cookie user", error);
            }
        }
    }, []);

    if (!mounted) return null;

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("user");
        toast.success("Đã đăng xuất thành công!");
        router.push("/login");
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-black transition-colors">
            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            <div
                className={cn(
                    "flex-1 flex flex-col transition-all duration-300 ease-in-out",
                    isCollapsed ? "md:pl-20" : "md:pl-64"
                )}
            >
                {/* Header */}
                <header className="h-16 bg-white dark:bg-zinc-900 border-b border-border flex items-center justify-between px-4 sticky top-0 z-10 transition-colors">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md text-gray-600 dark:text-gray-300"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="hidden md:block">
                            <h2 className="font-semibold text-primary">Phòng Khám Thú Y Min Min</h2>
                            <p className="text-xs text-gray-500">163/5 Võ Văn Kiệt, TP. Bạc Liêu</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="hidden md:flex items-center bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-transparent focus-within:border-primary transition-all">
                            <Search size={18} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="bg-transparent border-none outline-none text-sm ml-2 w-48"
                            />
                        </div>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            {theme === "dark" ? <Sun size={20} className="text-custom-yellow" /> : <Moon size={20} />}
                        </button>

                        {/* USER MENU */}
                        <div className="relative group flex items-center h-full">
                            <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-zinc-700 cursor-pointer py-1">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        {user?.fullName || "Admin"}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}
                                    </p>
                                </div>

                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20 transition-transform group-hover:scale-105">
                                    <img
                                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName || "Admin"}&background=random`}
                                        alt="User Avatar"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${user?.fullName || "Admin"}&background=random`;
                                        }}
                                    />
                                </div>
                            </div>

                            {/* MENU DROPDOWN */}
                            <div className="absolute top-full right-0 w-60 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right">
                                <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-700 overflow-hidden py-1">

                                    {/* Header mobile (chỉ hiện khi màn hình nhỏ ẩn tên ở trên) */}
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-700 md:hidden">
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user?.fullName}</p>
                                        <p className="text-xs text-gray-500">{user?.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}</p>
                                    </div>

                                    {/* Option 1: Thông tin tài khoản */}
                                    <Link href="/profile" className="block w-full">
                                        <button
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700/50 flex items-center gap-2 transition-colors">
                                            <User size={16} className="text-blue-500" />
                                            Thông tin tài khoản
                                        </button>
                                    </Link>

                                    {/* Option 2: Đổi mật khẩu */}
                                    <Link href="/profile" className="block w-full">
                                        <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700/50 flex items-center gap-2 transition-colors">
                                            <Key size={16} className="text-yellow-500" />
                                            Đổi mật khẩu
                                        </button>
                                    </Link>

                                    <div className="h-px bg-gray-100 dark:bg-zinc-700 my-1"></div>

                                    {/* Option 3: Đăng xuất */}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}