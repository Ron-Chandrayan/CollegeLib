import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { hour: "6 AM", footfall: 120 },
  { hour: "7 AM", footfall: 150 },
  { hour: "8 AM", footfall: 200 },
  { hour: "9 AM", footfall: 300 },
  { hour: "10 AM", footfall: 280 },
  { hour: "11 AM", footfall: 250 },
  { hour: "12 PM", footfall: 270 },
  { hour: "1 PM", footfall: 260 },
  { hour: "2 PM", footfall: 220 },
  { hour: "3 PM", footfall: 210 },
  { hour: "4 PM", footfall: 180 },
  { hour: "5 PM", footfall: 160 },
  { hour: "6 PM", footfall: 140 },
  { hour: "7 PM", footfall: 120 },
  { hour: "8 PM", footfall: 100 },
];

export default function Linegraph() {
  return (
    <div className="w-full h-96 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Hourly Footfall</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="footfall"
            stroke="#2563EB" // Tailwind blue-600 color hex
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
