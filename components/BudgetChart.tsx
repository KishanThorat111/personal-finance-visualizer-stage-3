// components/BudgetChart.tsx

'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
  CartesianGrid // Added for visual separation
} from 'recharts';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
};

type Transaction = {
  _id?: string;
  category: string;
  amount: number;
  date: string;
};

type Budget = {
  _id?: string;
  category: string;
  amount: number;
  month: number; // 0-indexed month
  year: number;
};

type Props = {
  budgets: Budget[];
  transactions: Transaction[];
};

export default function BudgetChart({
  budgets,
  transactions,
}: Props) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const monthLabel = format(new Date(selectedYear, selectedMonth), 'MMMM yyyy');

  const data = useMemo(() => {
    // console.log('BudgetChart - useMemo: budgets received:', budgets);
    // console.log('BudgetChart - useMemo: transactions received:', transactions);
    // console.log(`BudgetChart - useMemo: filtering for month ${selectedMonth} and year ${selectedYear}`);

    const filteredBudgets = budgets.filter(
      (b) =>
        b.year === selectedYear &&
        b.month === selectedMonth
    );

    const filteredTransactions = transactions.filter((t) => {
      const txDate = new Date(t.date);
      return (
        txDate.getFullYear() === selectedYear &&
        txDate.getMonth() === selectedMonth
      );
    });

    const actualMap: Record<string, number> = {};
    for (const tx of filteredTransactions) {
      if (!actualMap[tx.category]) actualMap[tx.category] = 0;
      actualMap[tx.category] += tx.amount;
    }

    const combined = filteredBudgets.map((b) => ({
      category: b.category,
      budget: b.amount,
      actual: actualMap[b.category] || 0,
    }));

    // Add categories from transactions that might not have a budget set
    const allCategories = new Set([
      ...combined.map((c) => c.category),
      ...Object.keys(actualMap),
    ]);
    for (const cat of allCategories) {
      if (!combined.find((c) => c.category === cat)) {
        combined.push({
          category: cat,
          budget: 0, // No budget set for this category
          actual: actualMap[cat] || 0,
        });
      }
    }

    // Sort by actual spent and take top 10
    const sortedCombined = combined.sort((a, b) => b.actual - a.actual).slice(0, 10);
    // console.log('BudgetChart - useMemo: Generated chart data:', sortedCombined);
    return sortedCombined;
  }, [budgets, transactions, selectedMonth, selectedYear]);

  // Custom Tick component for XAxis to handle long labels better
  const CustomXAxisTick = ({ x, y, payload }: any) => {
    const text = payload.value;
    const maxLength = 15; // Increased max length
    const displayValue = text.length > maxLength ? `${text.substring(0, maxLength - 3)}...` : text;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" fontSize="11px" transform="rotate(-45)">
          {displayValue}
        </text>
      </g>
    );
  };

  if (data.length === 0) {
    return (
      <div className="p-6 bg-white/70 dark:bg-slate-800/50 rounded-2xl shadow-xl space-y-4 mt-6 text-center text-gray-500">
        <h2 className="text-xl font-bold">📊 Monthly Budget vs Actual</h2>
        <p>No budget or transaction data available for {monthLabel}.</p>
        <p>Please ensure you have set budgets and recorded transactions for this period.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white/70 dark:bg-slate-800/50 rounded-2xl shadow-xl space-y-4 mt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-center sm:text-left">📊 Monthly Budget vs Actual</h2>
        {/* Month and Year Selectors */}
        <div className="flex gap-3 flex-wrap justify-center sm:justify-end items-center">
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
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
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-24 rounded-full bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm text-sm text-gray-900 dark:text-white py-2 px-4 shadow-inner border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-400 transition"
            min="2000"
            max="2100"
          />
        </div>
      </div>

      {/* Increased height for better label visibility */}
      <div className="w-full h-[400px] relative"> 
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 80 }}> {/* Increased bottom margin for more label room */}
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> {/* Added subtle grid lines */}
            <XAxis
              dataKey="category"
              interval={0} // Show all labels
              angle={-45} // Increased angle for better spacing
              textAnchor="end" // Keep anchor at the end for proper rotation
              height={90} // More height for the XAxis area
              tick={<CustomXAxisTick />} // Use custom tick component
            />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(val: number) => formatCurrency(val)} />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="budget" fill="#60a5fa" name="Budgeted">
              <LabelList
                dataKey="budget"
                position="top"
                content={({ value }) => formatCurrency(value as number)}
              />
            </Bar>
            <Bar dataKey="actual" fill="#f87171" name="Spent">
              <LabelList
                dataKey="actual"
                position="top"
                content={({ value }) => formatCurrency(value as number)}
              />
            </Bar>
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