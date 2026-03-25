"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
  month: string;
  total: number;
}

interface UserGrowthChartProps {
  data?: ChartDataPoint[];
}

export function UserGrowthChart({ data = [] }: UserGrowthChartProps) {
  // Convert API data format (month, total) to chart format (name, value)
  const chartData = data.map(item => ({
    name: item.month,
    value: item.total,
  }));
  return (
    <div className="bg-white p-6 rounded-2xl shadow-none border border-border">
      <h3 className="text-lg font-semibold mb-6 text-foreground">User Growth</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={chartData} barSize={40}>
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
              tickFormatter={(value) => Math.round(value).toString()}
            />
            <Tooltip 
               cursor={{ fill: 'transparent' }}
               contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
               formatter={(value: number | undefined) => [
                 (value || 0).toLocaleString(),
                 "Users",
               ]}
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
  );
}
