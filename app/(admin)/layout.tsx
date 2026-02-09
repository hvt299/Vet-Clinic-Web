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
import { settingsService } from "@/lib/settings";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const [user, setUser] = useState<{ fullName: string; avatar?: string; role: string } | null>(null);
    const router = useRouter();
    const [clinicInfo, setClinicInfo] = useState({
        name: "Phòng Khám Thú Y",
        addresses: [] as string[],
        phones: [] as string[]
    });
    const [infoIndex, setInfoIndex] = useState(0);

    useEffect(() => {
        if (clinicInfo.addresses.length <= 1) return;

        const interval = setInterval(() => {
            setInfoIndex((prev) => (prev + 1) % clinicInfo.addresses.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [clinicInfo.addresses.length]);

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

        const fetchSettings = async () => {
            try {
                const data = await settingsService.get();
                setClinicInfo({
                    name: data.clinicName || "Phòng Khám Thú Y",
                    addresses: data.addresses || [],
                    phones: data.phoneNumbers || []
                });
            } catch (error) {
                console.error("Lỗi tải settings header", error);
            }
        };
        fetchSettings();
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
                    isCollapsed ? "lg:pl-20" : "lg:pl-64"
                )}
            >
                {/* Header */}
                <header className="h-16 bg-white dark:bg-zinc-900 border-b border-border flex items-center justify-between px-4 sticky top-0 z-10 transition-colors">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md text-gray-600 dark:text-gray-300"
                        >
                            <Menu size={24} />
                        </button>
                        {/* Ẩn trên Mobile/Tablet */}
                        <div className="hidden lg:block ml-2">
                            <h2 className="font-bold text-primary dark:text-gray-200 text-lg leading-tight">
                                {clinicInfo.name}
                            </h2>

                            {/* Khu vực hiển thị luân phiên: Địa chỉ + SĐT trên CÙNG 1 DÒNG */}
                            <div className="h-5 relative overflow-hidden mt-0.5 min-w-[300px]">
                                {clinicInfo.addresses.length > 0 ? (
                                    <div
                                        key={infoIndex}
                                        className="absolute inset-0 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 animate-in fade-in slide-in-from-bottom-1 duration-500"
                                    >
                                        {/* Địa chỉ */}
                                        <span className="truncate max-w-[280px]" title={clinicInfo.addresses[infoIndex]}>
                                            {clinicInfo.addresses[infoIndex]}
                                        </span>

                                        {/* Ngăn cách và SĐT (nếu có) */}
                                        {clinicInfo.phones[infoIndex] && (
                                            <>
                                                <div className="h-3 w-px bg-gray-300 dark:bg-zinc-700 shrink-0"></div>
                                                <span className="font-medium whitespace-nowrap text-gray-700 dark:text-gray-300">
                                                    {clinicInfo.phones[infoIndex]}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-400 italic">Đang cập nhật thông tin...</span>
                                )}
                            </div>
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