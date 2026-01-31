"use client";
import { useMemo } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { StatsCard } from "@/components/Shared/StatsCard";
import { usersData } from "@/data/usersData";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { DollarSign, Users, Eye, Activity, Trash2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import Image from "next/image";
import { User } from "@/types/users";
import { TableColumn } from "@/types/table.types";

// --- Mock Data for Charts ---
const revenueData = [
  { name: "Jul", value: 12 },
  { name: "Aug", value: 14 },
  { name: "Sep", value: 15 },
  { name: "Oct", value: 14.5 },
  { name: "Nov", value: 17 },
  { name: "Dec", value: 18.5 },
];

const userData = [
  { name: "Jul", value: 1800 },
  { name: "Aug", value: 2000 },
  { name: "Sep", value: 2200 },
  { name: "Oct", value: 2500 },
  { name: "Nov", value: 2700 },
  { name: "Dec", value: 2900 },
];

export default function DashboardPage() {
  // Filter only creators for the "Top Creators" table
  const creators = useMemo(() => usersData.filter(u => u.role === 'creator'), []);

  // Columns for Top Creators
  const columns: TableColumn<User>[] = [
    {
      key: "name",
      header: "Name",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative shrink-0">
             <Image
                src={row.image || "/images/avatar.png"}
                alt={row.name}
                fill
                className="object-cover"
              />
          </div>
          <span className="font-semibold text-foreground">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "email",
      header: "Email address",
      accessor: "email",
    },
    {
      key: "videos",
      header: "Videos",
      accessor: "videos",
    },
    {
      key: "sales",
      header: "Sales",
      render: (_, row) => <span className="font-medium">${row.sales}</span>,
      sortable: true,
    },
    {
      key: "commission",
      header: "Commission",
      render: (_, row) => <span className="font-medium">${row.commission}</span>,
      sortable: true,
    },
  ];

  const actions = [
    {
      label: "Delete",
      icon: <Trash2 className="w-5 h-5 text-red-400 hover:text-red-500 transition-colors cursor-pointer" />,
      onClick: (row: User) => console.log("Delete", row.id), 
      // variant: "ghost",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <DashboardHeader title="Dashboard" description="Xandra Platform" />

      <main className="p-4 md:p-8 space-y-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Monthly Revenue"
            value="$45,234"
            icon={DollarSign}
            iconColor="#FFFFFF"
            iconBgColor="#C14A7A"
            subtitle="15.2% vs last month"
            isUp={true}
          />
          <StatsCard
            title="Total Users"
            value="2,847"
            icon={Users}
            iconColor="#FFFFFF"
            iconBgColor="#C14A7A"
            subtitle="12.5% vs last month"
            isUp={true}
          />
          <StatsCard
            title="Total Views"
            value="2.4M"
            icon={Eye}
            iconColor="#FFFFFF"
            iconBgColor="#C14A7A"
            subtitle="10.1% vs last month"
            isUp={true}
          />
          <StatsCard
            title="Videos Posted"
            value="342"
            icon={Activity}
            iconColor="#FFFFFF"
            iconBgColor="#C14A7A"
            subtitle="8.3% vs last month"
            isUp={true}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-white p-6 rounded-2xl shadow-none border border-border">
            <h3 className="text-lg font-semibold mb-6 text-foreground">Revenue Trend</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAECF0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#98A2B3', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#98A2B3', fontSize: 12 }} 
                    tickFormatter={(value) => `${value}M`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#4BA44B" 
                    strokeWidth={3} 
                    dot={{ fill: '#4BA44B', r: 6, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Growth */}
          <div className="bg-white p-6 rounded-2xl shadow-none border border-border">
            <h3 className="text-lg font-semibold mb-6 text-foreground">User Growth</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAECF0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#98A2B3', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#98A2B3', fontSize: 12 }} 
                  />
                  <Tooltip 
                     cursor={{ fill: 'transparent' }}
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#457B9D"
                    radius={[6, 6, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Creators Table */}
        <DynamicTable
            title="Top Creators"
            data={creators}
            config={{
                columns,
                showActions: true,
                actions,
                actionsLabel: "Action",
                actionsAlign: "center",
            }}
            pagination={{ enabled: false }}
            className="border border-border shadow-none overflow-hidden p-0"
            headerClassName="text-white"
        />
      </main>
    </div>
  );
}