"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard, Users, UserCircle, Stethoscope, PawPrint,
    Package, Syringe, ClipboardList, CalendarDays, Settings,
    LogOut, ChevronLeft, ChevronRight, X, Moon, Sun
} from "lucide-react";
import { useTheme } from "next-themes";
import Cookies from "js-cookie";
import { toast } from "sonner";

const MENU_ITEMS = [
    { name: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
    { name: "Người dùng", href: "/users", icon: Users },
    { name: "Khách hàng", href: "/customers", icon: UserCircle },
    { name: "Bác sĩ", href: "/doctors", icon: Stethoscope },
    { name: "Thú cưng", href: "/pets", icon: PawPrint },
    { name: "Kho thuốc", href: "/inventory", icon: Package },
    { name: "Vaccine", href: "/vaccines", icon: Syringe },
    { name: "Lịch tiêm", href: "/vaccine-history", icon: ClipboardList },
    { name: "Đợt khám", href: "/visits", icon: CalendarDays },
    { name: "Cài đặt", href: "/settings", icon: Settings },
];

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    isCollapsed: boolean;
    setIsCollapsed: (v: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [userRole, setUserRole] = useState<string>("");

    useEffect(() => {
        const userCookie = Cookies.get("user");
        if (userCookie) {
            try {
                const user = JSON.parse(userCookie);
                setUserRole(user.role);
            } catch (e) { console.error(e); }
        }
    }, []);

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("user");
        toast.success("Đã đăng xuất thành công!");
        router.push("/login");
    };

    const itemClass = (isActive: boolean) => cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 relative group min-h-[44px]",
        isActive
            ? "bg-primary text-white shadow-md"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800",
        isCollapsed ? "justify-center px-2" : ""
    );

    const filteredMenu = MENU_ITEMS.filter(item => {
        if (item.href === "/users" && userRole !== "ADMIN") {
            return false;
        }
        return true;
    });

    return (
        <>
            {/* Overlay cho Mobile */}
            <div
                className={cn("fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar chính */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 bg-white dark:bg-zinc-900 border-r border-border transition-all duration-300 ease-in-out flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                isCollapsed ? "w-20" : "w-64"
            )}>

                {/* Header Logo */}
                <div className={cn("h-16 flex items-center border-b border-border px-4 flex-shrink-0", isCollapsed ? "justify-center" : "justify-between")}>
                    <div className="flex items-center gap-2 font-bold text-primary text-xl overflow-hidden whitespace-nowrap">
                        <PawPrint className="w-8 h-8 flex-shrink-0" />
                        <span className={cn("transition-all duration-300 origin-left", isCollapsed ? "w-0 opacity-0 scale-0" : "w-auto opacity-100 scale-100")}>
                            Min Min
                        </span>
                    </div>
                    {/* Nút đóng trên mobile */}
                    <button onClick={() => setIsOpen(false)} className="md:hidden">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Menu List (Có scroll) */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1">
                    {filteredMenu.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={itemClass(isActive)}
                                title={isCollapsed ? item.name : ""}
                            >
                                {/* Icon luôn giữ nguyên kích thước */}
                                <item.icon size={20} className="flex-shrink-0" />

                                {/* Text trượt ra vào */}
                                <span className={cn(
                                    "whitespace-nowrap overflow-hidden transition-all duration-300",
                                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100 ml-0"
                                )}>
                                    {item.name}
                                </span>

                                {/* Tooltip giả khi hover ở chế độ thu nhỏ */}
                                {isCollapsed && (
                                    <div className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap transition-opacity">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-3 border-t border-border space-y-2 bg-gray-50 dark:bg-zinc-900/50 flex-shrink-0">

                    {/* Nút Dark Mode */}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className={cn(itemClass(false), "w-full")}
                        title={isCollapsed ? (theme === "dark" ? "Chế độ Sáng" : "Chế độ Tối") : ""}
                    >
                        {theme === "dark" ? <Sun size={20} className="flex-shrink-0 text-yellow-500" /> : <Moon size={20} className="flex-shrink-0" />}
                        <span className={cn("whitespace-nowrap overflow-hidden transition-all duration-300", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                            {theme === "dark" ? "Sáng" : "Tối"}
                        </span>
                    </button>

                    {/* Nút Đăng xuất */}
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 relative group min-h-[44px]",
                            "text-custom-red hover:bg-red-50 dark:hover:bg-red-900/10 w-full",
                            isCollapsed ? "justify-center px-2" : ""
                        )}
                        title={isCollapsed ? "Đăng xuất" : ""}
                    >
                        <LogOut size={20} className="flex-shrink-0" />
                        <span className={cn("whitespace-nowrap overflow-hidden transition-all duration-300", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                            Đăng xuất
                        </span>
                    </button>

                    {/* Nút Toggle Sidebar (Chỉ hiện trên Desktop) */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:flex w-full items-center justify-center p-2 mt-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
            </aside>
        </>
    );
}