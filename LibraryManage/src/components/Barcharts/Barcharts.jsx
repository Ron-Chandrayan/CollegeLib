import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

// const data = [
//   { date: "2025-08-01", count: 120 },
//   { date: "2025-08-02", count: 150 },
//   { date: "2025-08-03", count: 180 },
//   { date: "2025-08-04", count: 90 },
//   { date: "2025-08-05", count: 200 },
// ];

export default function Barcharts({data}) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  return (
    <div className="w-full h-96 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Daily Footfall</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" /*tickFormatter={formatDate}*/ />
          <YAxis />
          <Tooltip /*labelFormatter={formatDate}*/ />
          <Legend />
          <Bar dataKey="count" fill="#2563EB" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
