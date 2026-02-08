"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { Moon, Sun, Menu, Bell, Search } from "lucide-react";
import { useTheme } from "next-themes";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-black">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-zinc-900 border-b border-border flex items-center justify-between px-4 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-md">
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

                        {/* User Avatar */}
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1.5 rounded-lg transition">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Admin" alt="Admin" />
                            </div>
                            <span className="text-sm font-medium hidden md:block">Quản trị viên</span>
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