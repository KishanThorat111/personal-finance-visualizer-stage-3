// components/MonthlyChart.tsx
'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useMemo, useState } from 'react';
import { format, getDaysInMonth } from 'date-fns';

export default function MonthlyChart({ data }: { data: any[] }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const monthLabel = format(new Date(year, month), 'MMMM yyyy');

  const days = Array.from({ length: getDaysInMonth(new Date(year, month)) }, (_, i) => {
    const date = new Date(year, month, i + 1);
    return {
      date: format(date, 'yyyy-MM-dd'),
      label: (i + 1).toString(),
      amount: 0,
      descriptions: [] as string[],
    };
  });

  const filteredData = data.filter((tx: any) => {
    const txDate = new Date(tx.date);
    return txDate.getFullYear() === year && txDate.getMonth() === month;
  });

  const dailyData = useMemo(() => {
    const map = new Map<string, { amount: number; descriptions: string[] }>();
    for (const tx of filteredData) {
      const d = tx.date.slice(0, 10);
      if (!map.has(d)) {
        map.set(d, { amount: 0, descriptions: [] });
      }
      const entry = map.get(d)!;
      // entry.amount += tx.amount;
      // entry.descriptions.push(tx.description);
      entry.amount += tx.amount;
      entry.descriptions.push(`${tx.description} - ₹${tx.amount}`);
    }
    return days.map(day => ({
      ...day,
      amount: map.get(day.date)?.amount || 0,
      descriptions: map.get(day.date)?.descriptions || [],
    }));
  }, [filteredData, month, year]);

  const total = dailyData.reduce((acc, day) => acc + day.amount, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 text-sm p-3 rounded-lg shadow-md border border-slate-300 dark:border-slate-600 max-w-xs">
          <p className="font-semibold mb-1">Date: {item.date}</p>
          <p className="text-emerald-600 dark:text-emerald-400">₹{item.amount}</p>
          {item.descriptions.length > 0 && (
            <ul className="mt-2 list-disc list-inside text-slate-600 dark:text-slate-300">
              {item.descriptions.map((desc: string, idx: number) => (
                <li key={idx} className="text-sm leading-snug">{desc}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-center sm:text-left">
          📊 Monthly Expense Tracker
        </h2>
        <div className="flex gap-3 flex-wrap justify-center sm:justify-end items-center">
          <div className="relative">
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="appearance-none bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm text-sm text-gray-900 dark:text-white rounded-full py-2 px-4 pr-8 shadow-inner border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-400 transition"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute top-2.5 right-3 text-gray-500 dark:text-gray-300">
              ▼
            </div>
          </div>

          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-24 rounded-full bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm text-sm text-gray-900 dark:text-white py-2 px-4 shadow-inner border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-400 transition"
            min="2000"
            max="3000"
          />
        </div>

      </div>

      <p className="text-center text-muted-foreground">
        Total: ₹{total.toLocaleString()}
      </p>

      <div className="w-full h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dailyData}
            margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="label" interval={4} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" fill="#34d399" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
          <span className="inline-block px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 rounded-full shadow-md text-muted-foreground">
            {monthLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
