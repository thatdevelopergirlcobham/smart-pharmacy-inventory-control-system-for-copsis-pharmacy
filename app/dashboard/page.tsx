"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ACTIVITY_DATA = [
    { day: 'Mon', sales: 45000, value: 30 },
    { day: 'Tue', sales: 52000, value: 45 },
    { day: 'Wed', sales: 48000, value: 38 },
    { day: 'Thu', sales: 61000, value: 52 },
    { day: 'Fri', sales: 85000, value: 75 },
    { day: 'Sat', sales: 92000, value: 85 },
    { day: 'Sun', sales: 65000, value: 60 },
];

export default function OverviewPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Overview</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Inventory Value", value: "NGN124,500", change: "+2.5%", color: "blue" },
                    { label: "Low Stock Items", value: "12", change: "-4", color: "red" },
                    { label: "Daily Sales", value: "NGN4,200", change: "+12%", color: "green" },
                    { label: "Pending Orders", value: "5", change: "0", color: "orange" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stat.color === 'red' ? 'bg-red-100 text-red-600' :
                                stat.color === 'green' ? 'bg-green-100 text-green-600' :
                                    'bg-blue-100 text-blue-600'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Weekly Sales Activity</h2>
                <div className="h-[calc(100%-2rem)] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={ACTIVITY_DATA}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                hide={false}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                tickFormatter={(value) => `₦${(value / 1000)}k`}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: unknown) => [`₦${Number(value).toLocaleString()}`, "Sales"]}
                            />
                            <Bar
                                dataKey="sales"
                                fill="#3b82f6"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
