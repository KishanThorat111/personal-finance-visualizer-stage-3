
// 'use client';

// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   LabelList,
// } from 'recharts';
// import { useMemo, useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { toast } from '@/components/ui/toaster';

// type Transaction = {
//   category: string;
//   amount: number;
//   date: string;
// };

// type Budget = {
//   _id?: string;
//   category: string;
//   amount: number;
//   month: number | null;
//   year: number;
// };

// type Props = {
//   budgets: Budget[];
//   transactions: Transaction[];
//   refreshBudgets: () => void;
// };

// const formatCurrency = (value: number) => {
//   if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
//   if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
//   if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
//   return `₹${value}`;
// };

// export default function BudgetChart({ budgets, transactions, refreshBudgets }: Props) {
//   const now = new Date();
//   const month = now.getMonth();
//   const year = now.getFullYear();

//   const [localBudgets, setLocalBudgets] = useState<Record<string, number>>({});

//   const data = useMemo(() => {
//     const budgetData = budgets.filter(b => b.year === year && b.month === month);
//     const actualMap: Record<string, number> = {};

//     transactions.forEach(tx => {
//       const d = new Date(tx.date);
//       if (d.getMonth() === month && d.getFullYear() === year) {
//         actualMap[tx.category] = (actualMap[tx.category] || 0) + tx.amount;
//       }
//     });

//     const combinedCategories = new Set([
//       ...budgetData.map(b => b.category),
//       ...Object.keys(actualMap),
//     ]);

//     const combined = Array.from(combinedCategories).map(category => ({
//       category,
//       budget:
//         budgets.find(b => b.category === category && b.year === year && b.month === month)?.amount ||
//         0,
//       actual: actualMap[category] || 0,
//     }));

//     if (Object.keys(localBudgets).length === 0) {
//       const initial: Record<string, number> = {};
//       combined.forEach(item => (initial[item.category] = item.budget));
//       setLocalBudgets(initial);
//     }

//     return combined.sort((a, b) => b.actual - a.actual).slice(0, 10);
//   }, [budgets, transactions]);

//   const handleChange = (category: string, value: string) => {
//     const sanitized = value.replace(/^0+(?=\d)/, ''); // prevent "020000"
//     const num = Number(sanitized);
//     setLocalBudgets(prev => ({
//       ...prev,
//       [category]: isNaN(num) ? 0 : num,
//     }));
//   };

//   const handleUpdate = async (category: string) => {
//     const newAmount = localBudgets[category] || 0;
//     try {
//       const res = await fetch(`/api/budgets`);
//       const existing: Budget[] = await res.json();
//       const match = existing.find(b => b.category === category && b.month === month && b.year === year);

//       const payload = { category, amount: newAmount, month, year };

//       if (match) {
//         await fetch(`/api/budgets/${match._id}`, {
//           method: 'PATCH',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         });
//       } else {
//         await fetch('/api/budgets', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         });
//       }

//       toast.success('Budget saved');
//       refreshBudgets();
//     } catch (err) {
//       toast.error('Error saving budget');
//     }
//   };

//   if (data.length === 0) return null;

//   return (
//     <div className="p-6 bg-white/70 dark:bg-slate-800/50 rounded-2xl shadow-xl space-y-4 mt-6">
//       <h2 className="text-xl font-bold">📊 Budget vs Actual (Monthly)</h2>

//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data} margin={{ top: 10, bottom: 50 }}>
//           <XAxis dataKey="category" interval={0} angle={-20} textAnchor="end" height={60} />
//           <YAxis tickFormatter={formatCurrency} />
//           <Tooltip formatter={(val: number) => formatCurrency(val)} />
//           <Legend />
//           <Bar dataKey="budget" fill="#60a5fa" name="Budgeted">
//             <LabelList
//               dataKey="budget"
//               position="top"
//               formatter={(label) =>
//                 typeof label === 'number' ? formatCurrency(label) : label
//               }
//             />
//           </Bar>
//           <Bar dataKey="actual" fill="#f87171" name="Spent">
//             <LabelList
//               dataKey="actual"
//               position="top"
//               formatter={(label) =>
//                 typeof label === 'number' ? formatCurrency(label) : label
//               }
//             />
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>

//       <div className="space-y-2 mt-4">
//         <h3 className="font-semibold">✏️ Set Monthly Budgets</h3>
//         {data.map(item => (
//           <div key={item.category} className="flex justify-between items-center text-sm gap-2">
//             <span className="w-1/3 truncate">{item.category}</span>
//             <span>Spent: {formatCurrency(item.actual)}</span>
//             <input
//               type="number"
//               min={0}
//               value={localBudgets[item.category] ?? 0}
//               className="w-24 px-2 py-1 border rounded"
//               onChange={e => handleChange(item.category, e.currentTarget.value)}
//             />
//             <Button size="sm" onClick={() => handleUpdate(item.category)}>
//               Update
//             </Button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// // components/BudgetChart.tsx

// 'use client';

// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   LabelList,
// } from 'recharts';
// import { useMemo, useState, useEffect } from 'react';
// import { toast } from '@/components/ui/toaster';
// import { Button } from '@/components/ui/button';

// const formatCurrency = (value: number) => {
//   if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
//   if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
//   if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
//   return `₹${value}`;
// };

// type Transaction = {
//   _id?: string;
//   category: string;
//   amount: number;
//   date: string;
// };

// type Budget = {
//   _id?: string;
//   category: string;
//   amount: number;
//   month: number | null;
//   year: number;
// };

// type Props = {
//   budgets: Budget[];
//   transactions: Transaction[];
//   onBudgetChangeSuccess: () => void;
//   currentMonth: number; // ADDED PROP
//   currentYear: number;   // ADDED PROP
// };

// export default function BudgetChart({
//   budgets,
//   transactions,
//   onBudgetChangeSuccess,
//   currentMonth, // Destructure from props
//   currentYear,  // Destructure from props
// }: Props) {
//   // State to hold temporary input values before saving
//   const [tempBudgetAmounts, setTempBudgetAmounts] = useState<
//     Record<string, number>
//   >({});

//   const data = useMemo(() => {
//     const isMonthly = true; // Always monthly

//     // --- DEBUGGING LOGS ---
//     console.log('BudgetChart - useMemo: budgets received:', budgets);
//     console.log('BudgetChart - useMemo: transactions received:', transactions);
//     console.log(`BudgetChart - useMemo: filtering for month ${currentMonth} and year ${currentYear}`);
//     // --- END DEBUGGING LOGS ---

//     const filteredBudgets = budgets.filter(
//       (b) =>
//         b.year === currentYear &&
//         (isMonthly ? b.month === currentMonth : b.month === null)
//     );

//     const filteredTransactions = transactions.filter((t) => {
//       const d = new Date(t.date);
//       return (
//         d.getFullYear() === currentYear &&
//         (isMonthly ? d.getMonth() === currentMonth : true)
//       );
//     });

//     const actualMap: Record<string, number> = {};
//     for (const tx of filteredTransactions) {
//       if (!actualMap[tx.category]) actualMap[tx.category] = 0;
//       actualMap[tx.category] += tx.amount;
//     }

//     const combined = filteredBudgets.map((b) => ({
//       category: b.category,
//       budget: b.amount,
//       actual: actualMap[b.category] || 0,
//     }));

//     const allCategories = new Set([
//       ...combined.map((c) => c.category),
//       ...Object.keys(actualMap),
//     ]);
//     for (const cat of allCategories) {
//       if (!combined.find((c) => c.category === cat)) {
//         combined.push({
//           category: cat,
//           budget: 0,
//           actual: actualMap[cat],
//         });
//       }
//     }

//     const sortedCombined = combined.sort((a, b) => b.actual - a.actual).slice(0, 10);
//     // --- DEBUGGING LOGS ---
//     console.log('BudgetChart - useMemo: Generated chart data:', sortedCombined);
//     // --- END DEBUGGING LOGS ---
//     return sortedCombined;
//   }, [budgets, transactions, currentMonth, currentYear]); // ADD currentMonth, currentYear to dependency array

//   // Use useEffect to update tempBudgetAmounts when 'data' changes
//   useEffect(() => {
//     const initialAmounts: Record<string, number> = {};
//     data.forEach((item) => {
//       initialAmounts[item.category] = item.budget;
//     });
//     setTempBudgetAmounts(initialAmounts);
//     // --- DEBUGGING LOGS ---
//     console.log('BudgetChart - useEffect: tempBudgetAmounts updated:', initialAmounts);
//     // --- END DEBUGGING LOGS ---
//   }, [data]);

//   const handleInputChange = (category: string, value: string) => {
//     const newAmount = Number(value);
//     setTempBudgetAmounts((prev) => ({
//       ...prev,
//       [category]: isNaN(newAmount) ? 0 : newAmount,
//     }));
//   };

//   const handleSaveBudget = async (category: string) => {
//     const newAmount = tempBudgetAmounts[category];
//     if (newAmount === undefined || isNaN(newAmount)) {
//       toast('Please enter a valid number.');
//       return;
//     }
//     try {
//       const match = budgets.find(
//         (b) =>
//           b.category === category &&
//           b.year === currentYear &&
//           b.month === currentMonth
//       );

//       const payload = {
//         category,
//         amount: newAmount,
//         month: currentMonth,
//         year: currentYear,
//       };

//       // --- DEBUGGING LOGS ---
//       console.log('BudgetChart - handleSaveBudget: Saving payload:', payload);
//       // --- END DEBUGGING LOGS ---

//       if (match) {
//         await fetch(`/api/budgets/${match._id}`, {
//           method: 'PATCH',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         });
//         toast('Budget updated successfully!');
//       } else {
//         await fetch('/api/budgets', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         });
//         toast('Budget added successfully!');
//       }
      
//       // --- DEBUGGING LOGS ---
//       console.log('BudgetChart - handleSaveBudget: Calling onBudgetChangeSuccess');
//       // --- END DEBUGGING LOGS ---
//       onBudgetChangeSuccess(); // Notify parent to re-fetch data
//     } catch (error) {
//       toast('Error saving budget');
//       console.error('Error in handleSaveBudget:', error); // Log actual error
//     }
//   };

//   if (data.length === 0) return null;

//   return (
//     <div className="p-6 bg-white/70 dark:bg-slate-800/50 rounded-2xl shadow-xl space-y-4 mt-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-bold">📊 Monthly Budget vs Actual</h2>
//       </div>

//       <ResponsiveContainer width="100%" height={350}>
//         <BarChart data={data} margin={{ top: 10, bottom: 50 }}>
//           <XAxis
//             dataKey="category"
//             interval={0}
//             angle={-20}
//             textAnchor="end"
//             height={60}
//           />
//           <YAxis tickFormatter={formatCurrency} />
//           <Tooltip formatter={(val: number) => formatCurrency(val)} />
//           <Legend />
//           <Bar dataKey="budget" fill="#60a5fa" name="Budgeted">
//             <LabelList
//               dataKey="budget"
//               position="top"
//               content={({ value }) => formatCurrency(value as number)}
//             />
//           </Bar>
//           <Bar dataKey="actual" fill="#f87171" name="Spent">
//             <LabelList
//               dataKey="actual"
//               position="top"
//               content={({ value }) => formatCurrency(value as number)}
//             />
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>

//       <div className="space-y-2 mt-4">
//         <h3 className="font-semibold">✏️ Set or Adjust Monthly Budgets</h3>
//         {data.map((item) => (
//           <div
//             key={item.category}
//             className="flex justify-between items-center text-sm gap-2"
//           >
//             <span className="w-1/3">{item.category}</span>
//             <span className="text-muted-foreground">
//               Spent: {formatCurrency(item.actual)}
//             </span>
//             <input
//               type="number"
//               min={0}
//               value={tempBudgetAmounts[item.category] || 0}
//               onChange={(e) => handleInputChange(item.category, e.target.value)}
//               className="w-24 px-2 py-1 border rounded"
//             />
//             <Button onClick={() => handleSaveBudget(item.category)} size="sm">
//               Save
//             </Button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }




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
} from 'recharts';
import { useMemo } from 'react'; // Removed useState, useEffect as tempBudgetAmounts is no longer needed
// import { toast } from '@/components/ui/toaster'; // No longer needed
// import { Button } from '@/components/ui/button'; // No longer needed

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
  month: number | null;
  year: number;
};

type Props = {
  budgets: Budget[];
  transactions: Transaction[];
  onBudgetChangeSuccess: () => void; // Still needed if you want to allow re-fetch via prop, but not strictly used in this component anymore for saving
  currentMonth: number;
  currentYear: number;
};

export default function BudgetChart({
  budgets,
  transactions,
  // Removed onBudgetChangeSuccess as it's not directly used for saving here anymore
  currentMonth,
  currentYear,
}: Props) {
  // Removed: const [tempBudgetAmounts, setTempBudgetAmounts] = useState<Record<string, number>>({});

  const data = useMemo(() => {
    const isMonthly = true; // Always monthly

    console.log('BudgetChart - useMemo: budgets received:', budgets);
    console.log('BudgetChart - useMemo: transactions received:', transactions);
    console.log(`BudgetChart - useMemo: filtering for month ${currentMonth} and year ${currentYear}`);

    const filteredBudgets = budgets.filter(
      (b) =>
        b.year === currentYear &&
        (isMonthly ? b.month === currentMonth : b.month === null)
    );

    const filteredTransactions = transactions.filter((t) => {
      const d = new Date(t.date);
      return (
        d.getFullYear() === currentYear &&
        (isMonthly ? d.getMonth() === currentMonth : true)
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

    const allCategories = new Set([
      ...combined.map((c) => c.category),
      ...Object.keys(actualMap),
    ]);
    for (const cat of allCategories) {
      if (!combined.find((c) => c.category === cat)) {
        combined.push({
          category: cat,
          budget: 0,
          actual: actualMap[cat],
        });
      }
    }

    const sortedCombined = combined.sort((a, b) => b.actual - a.actual).slice(0, 10);
    console.log('BudgetChart - useMemo: Generated chart data:', sortedCombined);
    return sortedCombined;
  }, [budgets, transactions, currentMonth, currentYear]); // ADD currentMonth, currentYear to dependency array

  // Removed: useEffect to update tempBudgetAmounts
  // Removed: handleInputChange
  // Removed: handleSaveBudget

  if (data.length === 0) {
    // Optionally render a message if no budget data for the current month
    return (
      <div className="p-6 bg-white/70 dark:bg-slate-800/50 rounded-2xl shadow-xl space-y-4 mt-6 text-center text-gray-500">
        <h2 className="text-xl font-bold">📊 Monthly Budget vs Actual</h2>
        <p>No budget data available for {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}.</p>
        <p>Please set a budget using the "Monthly Category Budgets" section.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white/70 dark:bg-slate-800/50 rounded-2xl shadow-xl space-y-4 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">📊 Monthly Budget vs Actual</h2>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 10, bottom: 50 }}>
          <XAxis
            dataKey="category"
            interval={0}
            angle={-20}
            textAnchor="end"
            height={60}
          />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip formatter={(val: number) => formatCurrency(val)} />
          <Legend />
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

      {/* REMOVED Budget Adjustment section */}
    </div>
  );
}