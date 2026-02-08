"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard, Users, UserCircle, Stethoscope, PawPrint,
    Package, Syringe, ClipboardList, CalendarDays, Settings,
    Activity, Home, LogOut, Menu, X
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

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

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) {
    const pathname = usePathname();

    return (
        <>
            {/* Overlay cho Mobile */}
            <div
                className={cn("fixed inset-0 z-20 bg-black/50 md:hidden transition-opacity", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar chính */}
            <aside className={cn(
                "fixed md:sticky top-0 left-0 z-30 h-screen w-64 bg-white dark:bg-zinc-900 border-r border-border transition-transform duration-300 ease-in-out overflow-y-auto",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-4 flex items-center justify-between border-b border-border h-16">
                    <div className="flex items-center gap-2 font-bold text-primary text-xl">
                        <PawPrint className="w-8 h-8" />
                        <span>Min Min Spa</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="md:hidden">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">Chức năng chính</p>
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-white shadow-md"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                )}
                            >
                                <item.icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}

                    <div className="mt-8 border-t border-border pt-4">
                        <button className="flex w-full items-center gap-3 px-3 py-2.5 text-custom-red hover:bg-red-50 rounded-lg text-sm font-medium">
                            <LogOut size={20} />
                            Đăng xuất
                        </button>
                    </div>
                </nav>
            </aside>
        </>
    );
}