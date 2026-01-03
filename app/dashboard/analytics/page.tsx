"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, Package, Activity, Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- DATA SETS ---
const DATA_SETS = {
  "Today": [
    { name: '8am', value: 1200 },
    { name: '10am', value: 3500 },
    { name: '12pm', value: 8200 },
    { name: '2pm', value: 6500 },
    { name: '4pm', value: 9800 },
    { name: '6pm', value: 14500 },
    { name: '8pm', value: 11200 },
  ],
  "This Week": [
    { name: 'Mon', value: 45000 },
    { name: 'Tue', value: 52000 },
    { name: 'Wed', value: 48000 },
    { name: 'Thu', value: 61000 },
    { name: 'Fri', value: 85000 },
    { name: 'Sat', value: 92000 },
    { name: 'Sun', value: 65000 },
  ],
  "This Month": [
    { name: 'Week 1', value: 320000 },
    { name: 'Week 2', value: 450000 },
    { name: 'Week 3', value: 410000 },
    { name: 'Week 4', value: 580000 },
  ],
  "This Year": [
    { name: 'Jan', value: 1200000 },
    { name: 'Feb', value: 1450000 },
    { name: 'Mar', value: 1350000 },
    { name: 'Apr', value: 1600000 },
    { name: 'May', value: 1850000 },
    { name: 'Jun', value: 2100000 },
    { name: 'Jul', value: 1950000 },
    { name: 'Aug', value: 2300000 },
    { name: 'Sep', value: 2450000 },
    { name: 'Oct', value: 2100000 },
    { name: 'Nov', value: 2600000 },
    { name: 'Dec', value: 2900000 },
  ]
};

// --- Components ---

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = "blue" }: { children: React.ReactNode; color?: "blue" | "green" | "red" | "orange" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-green-50 text-green-700 border-green-100",
    red: "bg-red-50 text-red-700 border-red-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[color]}`}>
      {children}
    </span>
  );
};

const ABCXYZMatrix = () => {
  // A visual representation of the ABC-XYZ classification
  const matrix = [
    { label: "AX", desc: "High Value, Stable", color: "bg-green-500", count: 12 },
    { label: "AY", desc: "High Value, Fluctuating", color: "bg-green-400", count: 5 },
    { label: "AZ", desc: "High Value, Irregular", color: "bg-green-300", count: 2 },
    { label: "BX", desc: "Med Value, Stable", color: "bg-blue-500", count: 24 },
    { label: "BY", desc: "Med Value, Fluctuating", color: "bg-blue-400", count: 15 },
    { label: "BZ", desc: "Med Value, Irregular", color: "bg-blue-300", count: 8 },
    { label: "CX", desc: "Low Value, Stable", color: "bg-orange-500", count: 150 },
    { label: "CY", desc: "Low Value, Fluctuating", color: "bg-orange-400", count: 65 },
    { label: "CZ", desc: "Low Value, Irregular", color: "bg-orange-300", count: 45 },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 h-64">
      {/* Headers */}
      <div className="col-span-3 flex justify-between px-2 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
        <span>Stable (X)</span>
        <span>Fluctuating (Y)</span>
        <span>Irregular (Z)</span>
      </div>

      {matrix.map((cell) => (
        <div key={cell.label} className={`relative rounded-lg p-3 flex flex-col justify-between text-white transition-transform hover:scale-105 ${cell.color} shadow-sm`}>
          <div className="flex justify-between items-start">
            <span className="font-bold text-lg opacity-90">{cell.label}</span>
            <span className="font-mono text-sm bg-white/20 px-1.5 rounded">{cell.count}</span>
          </div>
          <span className="text-[10px] leading-tight opacity-90 font-medium">{cell.desc}</span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<keyof typeof DATA_SETS>("This Month");
  const [chartData, setChartData] = useState(DATA_SETS["This Month"]);

  useEffect(() => {
    setChartData(DATA_SETS[timeRange]);
  }, [timeRange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Analytics & Insights</h1>
          <p className="text-slate-500 mt-1">Real-time data processing for inventory optimization.</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as keyof typeof DATA_SETS)}
          className="bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
        >
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: "₦2,450,000", change: "+12.5%", trend: "up", icon: DollarSign, color: "bg-blue-500" },
          { label: "Total Inventory Value", value: "₦12,840,000", change: "+2.1%", trend: "up", icon: Package, color: "bg-purple-500" },
          { label: "Turnover Rate", value: "4.2x", change: "-0.5%", trend: "down", icon: Activity, color: "bg-orange-500" },
          { label: "Stockouts Prevented", value: "28", change: "+4", trend: "up", icon: TrendingUp, color: "bg-green-500" },
        ].map((stat, i) => (
          <Card key={i} className="relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-2">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-lg text-white shadow-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm">
              <span className={`flex items-center font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
                {stat.change}
              </span>
              <span className="text-slate-400">vs last period</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Revenue Analysis</h3>
            <Badge color="blue">Sales Trend</Badge>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(value) => `₦${(value / 1000)}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: unknown) => [`₦${Number(value).toLocaleString()}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Average Order</p>
              <p className="text-lg font-bold text-slate-700">₦4,250</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Peak Sales Time</p>
              <p className="text-lg font-bold text-slate-700">5:00 PM</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Best Seller</p>
              <p className="text-lg font-bold text-slate-700">Panadol Extra</p>
            </div>
          </div>
        </Card>

        {/* ABC-XYZ Matrix */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800">ABC-XYZ Matrix</h3>
              <div className="group relative">
                <Info className="h-4 w-4 text-slate-400 cursor-help" />
                <div className="absolute right-0 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  A=High Value, C=Low Value<br />X=Stable, Z=Irregular
                </div>
              </div>
            </div>
            <Badge color="green">Optimization</Badge>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            Strategic classification of inventory based on value and demand volatility.
          </p>
          <ABCXYZMatrix />
          <div className="flex justify-between items-center mt-6 text-sm text-slate-500">
            <span>Class A Items</span>
            <span className="font-bold text-slate-800">19 items</span>
          </div>
        </Card>
      </div>

      {/* Bottom Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-bold text-slate-800 mb-4">Stock Health Distribution</h3>
          <div className="space-y-4">
            {[
              { label: "Healthy Stock", count: 145, pct: "75%", color: "bg-green-500" },
              { label: "Overstocked", count: 32, pct: "15%", color: "bg-blue-500" },
              { label: "Low Stock", count: 12, pct: "8%", color: "bg-orange-500" },
              { label: "Out of Stock", count: 4, pct: "2%", color: "bg-red-500" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="text-slate-500">{item.count} items ({item.pct})</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: item.pct }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">Smart Alerts History</h3>
            <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { msg: "Reorder suggestion for Panadol Extra (Batch Prediction)", time: "2h ago", type: "info" },
              { msg: "High demand detected for Vitamin C", time: "5h ago", type: "success" },
              { msg: "Amoxicillin expired in shelf 3B", time: "1d ago", type: "error" },
            ].map((alert, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${alert.type === 'error' ? 'bg-red-500' :
                  alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                <div>
                  <p className="text-sm text-slate-700 font-medium">{alert.msg}</p>
                  <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
}
