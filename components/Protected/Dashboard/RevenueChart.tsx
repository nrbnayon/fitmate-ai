"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { name: "Jul", value: 12 },
  { name: "Aug", value: 14 },
  { name: "Sep", value: 15 },
  { name: "Oct", value: 14.5 },
  { name: "Nov", value: 17 },
  { name: "Dec", value: 18.5 },
];

export function RevenueChart() {
  return (
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
  );
}
