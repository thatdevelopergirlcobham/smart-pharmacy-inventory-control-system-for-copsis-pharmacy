"use client";

import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    DollarSign,
    BarChart2,
    Bell,
    ChevronLeft,
    ChevronRight,
    LogOut
} from "lucide-react";
import { useState } from "react";

const sidebarItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Inventory", icon: Package, path: "/dashboard/inventory" },
    { name: "Sales", icon: DollarSign, path: "/dashboard/sales" },
    { name: "Analytics", icon: BarChart2, path: "/dashboard/analytics" },
    { name: "Alerts", icon: Bell, path: "/dashboard/alerts" },
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    return (
        <aside
            className={`relative h-screen bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col ${isCollapsed ? "w-20" : "w-64"
                }`}
        >
            {/* Header */}
            <div className={`flex items-center p-4 border-b border-slate-800 ${isCollapsed ? "justify-center" : "justify-between"}`}>
                {!isCollapsed && (
                    <span className="font-bold text-lg text-blue-400">COPSIS</span>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                    {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-2 space-y-2">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group relative ${isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                } ${isCollapsed ? "justify-center" : "gap-3"}`}
                        >
                            <item.icon className={`h-5 w-5 min-w-[1.25rem] ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />

                            {!isCollapsed && (
                                <span className="font-medium whitespace-nowrap">{item.name}</span>
                            )}

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                                    {item.name}
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => router.push("/")}
                    className={`w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors ${isCollapsed ? "justify-center" : "gap-3"
                        }`}
                >
                    <LogOut className="h-5 w-5" />
                    {!isCollapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </aside>
    );
}
