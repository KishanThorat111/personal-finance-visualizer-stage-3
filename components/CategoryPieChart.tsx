// components/CategoryPieChart.tsx

'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#34d399', '#facc15', '#f87171', '#60a5fa', '#c084fc',
  '#f97316', '#a3e635', '#f43f5e', '#14b8a6', '#fcd34d'
];

export default function CategoryPieChart({ data }: { data: any[] }) {
  const categoryTotals = data.reduce((acc: Record<string, number>, tx: any) => {
    const category = tx.category || 'Other';
    acc[category] = (acc[category] || 0) + tx.amount;
    return acc;
  }, {});

  const chartData = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const totalAmount = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-2xl backdrop-blur-md bg-white/60 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700 shadow-xl p-6 space-y-6 w-full max-w-6xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 dark:text-white">
        🍰 Top 10 Category-wise Expenses
      </h2>

      {chartData.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No category data to display.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bigger Pie Chart */}
          <div className="h-[360px] sm:h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={130}
                  paddingAngle={2}
                  label={false}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                    color: '#111',
                  }}
                  formatter={(value: string | number, name: string) => {
                    const num = typeof value === 'number' ? value : parseFloat(value);
                    const percent = totalAmount > 0
                      ? ((num / totalAmount) * 100).toFixed(1)
                      : '0';
                    return [`₹${num.toLocaleString()} (${percent}%)`, name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Legend */}
          <div className="flex flex-col justify-center space-y-3 text-sm text-gray-800 dark:text-gray-200 px-1">
            {chartData.map((item, i) => {
              const percent = ((item.value / totalAmount) * 100).toFixed(1);
              return (
                <div
                  key={item.name}
                  className="flex justify-between items-center px-4 py-2 rounded-xl bg-white/50 dark:bg-slate-800/50 shadow-inner border border-white/20 dark:border-slate-700 truncate hover:bg-white/70 dark:hover:bg-slate-700/60 transition"
                  title={item.name}
                >
                  <span className="flex items-center gap-2 max-w-[60%] truncate">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="font-semibold">
                    ₹{item.value.toLocaleString()} ({percent}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
