// components/BudgetInsights.tsx

'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Added CardHeader, CardTitle
import { format } from 'date-fns'; // Import format for month name

type Budget = {
  category: string;
  amount: number;
  month: number; // Changed to number, assuming 0-indexed as per other components
  year: number;
};

type Transaction = {
  category: string;
  amount: number;
  date: string;
};

type Props = {
  budgets: Budget[];
  transactions: Transaction[];
  // Removed currentMonth, currentYear as they will be managed internally
};

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
};

export default function BudgetInsights({ budgets, transactions }: Props) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  // Derive month label for display
  const monthLabel = format(new Date(selectedYear, selectedMonth), 'MMMM yyyy');

  const insights = useMemo(() => {
    // console.log(`BudgetInsights - useMemo: Filtering for month ${selectedMonth} and year ${selectedYear}`);

    const filteredBudgets = budgets.filter(
      (b) =>
        b.year === selectedYear &&
        b.month === selectedMonth
    );

    const filteredTransactions = transactions.filter((tx) => {
      const d = new Date(tx.date);
      return (
        d.getFullYear() === selectedYear &&
        d.getMonth() === selectedMonth
      );
    });

    const actualMap: Record<string, number> = {};
    for (const tx of filteredTransactions) {
      if (!actualMap[tx.category]) actualMap[tx.category] = 0;
      actualMap[tx.category] += tx.amount;
    }

    const combined: {
      category: string;
      budgeted: number;
      spent: number;
      diff: number;
      status: 'over' | 'met' | 'under';
    }[] = filteredBudgets.map((b) => {
      const spent = actualMap[b.category] || 0;
      const diff = b.amount - spent; // Positive means saved, negative means overspent

      return {
        category: b.category,
        budgeted: b.amount,
        spent,
        diff,
        status: diff < 0 ? 'over' : diff === 0 ? 'met' : 'under',
      };
    });

    // Add categories from transactions that might not have a budget set
    const allCategories = new Set([
      ...combined.map((c) => c.category),
      ...Object.keys(actualMap),
    ]);
    for (const cat of allCategories) {
      if (!combined.find((c) => c.category === cat)) {
        combined.push({
          category: cat,
          budgeted: 0,
          spent: actualMap[cat],
          diff: -actualMap[cat],
          status: 'over', // If no budget, any spending is "over" what was budgeted (0)
        });
      }
    }

    // Sort by spending (most spent first) and take top 10 relevant categories
    // This sorting ensures the most active categories are shown for insights
    const sortedCombined = combined.sort((a, b) => b.spent - a.spent);
    // console.log('BudgetInsights - useMemo: Generated insights data:', sortedCombined);
    return sortedCombined; // No slice here, show all relevant insights
  }, [budgets, transactions, selectedMonth, selectedYear]);

  const overBudget = insights.filter((i) => i.status === 'over');
  const underBudget = insights.filter((i) => i.status === 'under');
  const totalSaved = underBudget.reduce((sum, i) => sum + i.diff, 0);
  const totalOver = overBudget.reduce((sum, i) => sum + Math.abs(i.diff), 0);
  const totalBudgeted = insights.reduce((sum, i) => sum + i.budgeted, 0);
  const totalActual = insights.reduce((sum, i) => sum + i.spent, 0);

  const netDifference = totalBudgeted - totalActual;
  const netStatus = netDifference < 0 ? 'over' : netDifference === 0 ? 'met' : 'under';
  const netStatusColor = netDifference < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400';


  return (
    <div className="p-6 bg-white/70 dark:bg-slate-800/50 rounded-2xl shadow-xl space-y-4 mt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-center sm:text-left">📈 Monthly Budget Insights</h2>
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

      <div className="text-center text-muted-foreground mb-4">
        <span className="inline-block px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 rounded-full shadow-md text-muted-foreground">
          Insights for {monthLabel}
        </span>
      </div>

      {insights.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No budget or transaction data available for {monthLabel}.</p>
          <p>Set a budget and record some transactions to see insights.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-green-100/70 dark:bg-green-900/40 border-green-300 dark:border-green-700">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800 dark:text-green-200">
                <span className="mr-2">🟢</span> Categories Under Budget
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2 text-sm">
              {underBudget.length === 0 ? (
                <p className="text-green-700 dark:text-green-300">No categories under budget this month.</p>
              ) : (
                <ul className="list-disc list-inside text-green-700 dark:text-green-300">
                  {underBudget.map((i) => (
                    <li key={i.category} className="flex justify-between items-center py-0.5">
                      <span className="font-medium">{i.category}</span>
                      <span className="text-right">Saved {formatCurrency(i.diff)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="bg-red-100/70 dark:bg-red-900/40 border-red-300 dark:border-red-700">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800 dark:text-red-200">
                <span className="mr-2">🔴</span> Categories Over Budget
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2 text-sm">
              {overBudget.length === 0 ? (
                <p className="text-red-700 dark:text-red-300">All within limits 🎉</p>
              ) : (
                <ul className="list-disc list-inside text-red-700 dark:text-red-300">
                  {overBudget.map((i) => (
                    <li key={i.category} className="flex justify-between items-center py-0.5">
                      <span className="font-medium">{i.category}</span>
                      <span className="text-right">Over by {formatCurrency(Math.abs(i.diff))}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2 bg-blue-100/70 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700">
            <CardHeader>
              <CardTitle className="text-center text-blue-800 dark:text-blue-200">
                Overall Monthly Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-center space-y-2 text-sm">
              <p className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                <span>Total Budgeted:</span> <strong>{formatCurrency(totalBudgeted)}</strong>
              </p>
              <p className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                <span>Total Spent:</span> <strong>{formatCurrency(totalActual)}</strong>
              </p>
              <div className="border-t border-gray-300 dark:border-gray-600 my-2"></div>
              <p className="flex justify-between items-center text-base font-semibold">
                <span>Net Difference:</span>{' '}
                <strong className={netStatusColor}>
                  {netDifference > 0 ? 'Saved ' : netDifference < 0 ? 'Overspent ' : 'Met Budget '}
                  {formatCurrency(Math.abs(netDifference))}
                </strong>
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}