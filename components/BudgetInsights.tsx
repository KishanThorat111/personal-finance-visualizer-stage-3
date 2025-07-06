// // import React from 'react';

// 'use client';

// import { useState, useMemo } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

// type Budget = {
//   category: string;
//   amount: number;
//   month: number | null;
//   year: number;
// };

// type Transaction = {
//   category: string;
//   amount: number;
//   date: string;
// };

// type Props = {
//   budgets: Budget[];
//   transactions: Transaction[];
// };

// // Format to Lakhs/Crores
// const formatCurrency = (value: number) => {
//   if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
//   if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
//   if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
//   return `₹${value}`;
// };

// export default function BudgetInsights({ budgets, transactions }: Props) {
//   const [view, setView] = useState<'monthly' | 'yearly'>('monthly');
//   const now = new Date();
//   const currentMonth = now.getMonth();
//   const currentYear = now.getFullYear();

//   const insights = useMemo(() => {
//     const isMonthly = view === 'monthly';

//     const filteredBudgets = budgets.filter(
//       (b) => b.year === currentYear && (isMonthly ? b.month === currentMonth : b.month === null)
//     );

//     const filteredTransactions = transactions.filter((tx) => {
//       const d = new Date(tx.date);
//       return d.getFullYear() === currentYear && (isMonthly ? d.getMonth() === currentMonth : true);
//     });

//     const actualMap: Record<string, number> = {};
//     for (const tx of filteredTransactions) {
//       if (!actualMap[tx.category]) actualMap[tx.category] = 0;
//       actualMap[tx.category] += tx.amount;
//     }

//     const combined = filteredBudgets.map((b) => {
//       const spent = actualMap[b.category] || 0;
//       const diff = b.amount - spent;

//       return {
//         category: b.category,
//         budgeted: b.amount,
//         spent,
//         diff,
//         status: diff < 0 ? 'over' : diff === 0 ? 'met' : 'under',
//       };
//     });

//     const allCategories = new Set([...combined.map(c => c.category), ...Object.keys(actualMap)]);
//     for (const cat of allCategories) {
//       if (!combined.find(c => c.category === cat)) {
//         combined.push({
//           category: cat,
//           budgeted: 0,
//           spent: actualMap[cat],
//           diff: -actualMap[cat],
//           status: 'over',
//         });
//       }
//     }

//     return combined
//       .sort((a, b) => b.spent - a.spent)
//       .slice(0, 10);
//   }, [budgets, transactions, view]);

//   const overBudget = insights.filter((i) => i.status === 'over');
//   const underBudget = insights.filter((i) => i.status === 'under');
//   const totalSaved = underBudget.reduce((sum, i) => sum + i.diff, 0);
//   const totalOver = overBudget.reduce((sum, i) => sum + Math.abs(i.diff), 0);

//   return (
//     <div className="space-y-6 mt-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-bold">📈 Budget Insights</h2>
//             <ToggleGroup
//               type="single"
//               value={view}
//               onValueChange={(val) => {
//                 if (val === 'monthly' || val === 'yearly') {
//                   setView(val);
//                 }
//               }}
//             >

//           <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
//           <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
//         </ToggleGroup>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Card className="bg-green-100 dark:bg-green-900/30">
//           <CardContent className="p-4 space-y-1">
//             <h3 className="font-semibold">🟢 Saved Categories</h3>
//             {underBudget.length === 0 ? (
//               <p>No savings in this {view}</p>
//             ) : (
//               <ul className="text-sm">
//                 {underBudget.map((i) => (
//                   <li key={i.category} className="flex justify-between">
//                     <span>{i.category}</span>
//                     <span>Saved {formatCurrency(i.diff)}</span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </CardContent>
//         </Card>

//         <Card className="bg-red-100 dark:bg-red-900/30">
//           <CardContent className="p-4 space-y-1">
//             <h3 className="font-semibold">🔴 Overspent Categories</h3>
//             {overBudget.length === 0 ? (
//               <p>All within limits 🎉</p>
//             ) : (
//               <ul className="text-sm">
//                 {overBudget.map((i) => (
//                   <li key={i.category} className="flex justify-between">
//                     <span>{i.category}</span>
//                     <span>Over by {formatCurrency(Math.abs(i.diff))}</span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       <Card className="bg-slate-100 dark:bg-slate-800/50">
//         <CardContent className="p-4">
//           <h3 className="font-semibold text-center">💡 {view === 'monthly' ? 'Monthly' : 'Yearly'} Summary</h3>
//           <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-2">
//             Total Saved: <strong className="text-green-700">{formatCurrency(totalSaved)}</strong> <br />
//             Total Overspent: <strong className="text-red-700">{formatCurrency(totalOver)}</strong>
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




// // components/BudgetInsights.tsx


// 'use client';

// import { useState, useMemo } from 'react';
// import { Card, CardContent } from '@/components/ui/card';

// type Budget = {
//   category: string;
//   amount: number;
//   month: number | null;
//   year: number;
// };

// type Transaction = {
//   category: string;
//   amount: number;
//   date: string;
// };

// type Props = {
//   budgets: Budget[];
//   transactions: Transaction[];
//   currentMonth: number; // ADDED PROP
//   currentYear: number;   // ADDED PROP
// };

// const formatCurrency = (value: number) => {
//   if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
//   if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
//   if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
//   return `₹${value}`;
// };

// export default function BudgetInsights({ budgets, transactions, currentMonth, currentYear }: Props) {
//   const insights = useMemo(() => {
//     const isMonthly = true;

//     const filteredBudgets = budgets.filter(
//       (b) =>
//         b.year === currentYear &&
//         (isMonthly ? b.month === currentMonth : b.month === null)
//     );

//     const filteredTransactions = transactions.filter((tx) => {
//       const d = new Date(tx.date);
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

//     const combined = filteredBudgets.map((b) => {
//       const spent = actualMap[b.category] || 0;
//       const diff = b.amount - spent;

//       return {
//         category: b.category,
//         budgeted: b.amount,
//         spent,
//         diff,
//         status: diff < 0 ? 'over' : diff === 0 ? 'met' : 'under',
//       };
//     });

//     const allCategories = new Set([
//       ...combined.map((c) => c.category),
//       ...Object.keys(actualMap),
//     ]);
//     for (const cat of allCategories) {
//       if (!combined.find((c) => c.category === cat)) {
//         combined.push({
//           category: cat,
//           budgeted: 0,
//           spent: actualMap[cat],
//           diff: -actualMap[cat],
//           status: 'over',
//         });
//       }
//     }

//     return combined.sort((a, b) => b.spent - a.spent).slice(0, 10);
//   }, [budgets, transactions, currentMonth, currentYear]); // ADD currentMonth, currentYear to dependency array

//   const overBudget = insights.filter((i) => i.status === 'over');
//   const underBudget = insights.filter((i) => i.status === 'under');
//   const totalSaved = underBudget.reduce((sum, i) => sum + i.diff, 0);
//   const totalOver = overBudget.reduce((sum, i) => sum + Math.abs(i.diff), 0);

//   return (
//     <div className="space-y-6 mt-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-bold">📈 Monthly Budget Insights</h2>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Card className="bg-green-100 dark:bg-green-900/30">
//           <CardContent className="p-4 space-y-1">
//             <h3 className="font-semibold">🟢 Saved Categories</h3>
//             {underBudget.length === 0 ? (
//               <p>No savings this month</p>
//             ) : (
//               <ul className="text-sm">
//                 {underBudget.map((i) => (
//                   <li key={i.category} className="flex justify-between">
//                     <span>{i.category}</span>
//                     <span>Saved {formatCurrency(i.diff)}</span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </CardContent>
//         </Card>

//         <Card className="bg-red-100 dark:bg-red-900/30">
//           <CardContent className="p-4 space-y-1">
//             <h3 className="font-semibold">🔴 Overspent Categories</h3>
//             {overBudget.length === 0 ? (
//               <p>All within limits 🎉</p>
//             ) : (
//               <ul className="text-sm">
//                 {overBudget.map((i) => (
//                   <li key={i.category} className="flex justify-between">
//                     <span>{i.category}</span>
//                     <span>Over by {formatCurrency(Math.abs(i.diff))}</span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       <Card className="bg-slate-100 dark:bg-slate-800/50">
//         <CardContent className="p-4">
//           <h3 className="font-semibold text-center">💡 Monthly Summary</h3>
//           <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-2">
//             Total Saved: <strong className="text-green-700">{formatCurrency(totalSaved)}</strong> <br />
//             Total Overspent: <strong className="text-red-700">{formatCurrency(totalOver)}</strong>
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';

type Budget = {
  category: string;
  amount: number;
  month: number | null;
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
  currentMonth: number;
  currentYear: number;
};

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
};

export default function BudgetInsights({ budgets, transactions, currentMonth, currentYear }: Props) {
  const insights = useMemo(() => {
    const isMonthly = true;

    const filteredBudgets = budgets.filter(
      (b) =>
        b.year === currentYear &&
        (isMonthly ? b.month === currentMonth : b.month === null)
    );

    const filteredTransactions = transactions.filter((tx) => {
      const d = new Date(tx.date);
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

    const combined = filteredBudgets.map((b) => {
      const spent = actualMap[b.category] || 0;
      const diff = b.amount - spent;

      return {
        category: b.category,
        budgeted: b.amount,
        spent,
        diff,
        status: diff < 0 ? 'over' : diff === 0 ? 'met' : 'under',
      };
    });

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
          status: 'over',
        });
      }
    }

    return combined.sort((a, b) => b.spent - a.spent).slice(0, 10);
  }, [budgets, transactions, currentMonth, currentYear]); // ADD currentMonth, currentYear to dependency array

  const overBudget = insights.filter((i) => i.status === 'over');
  const underBudget = insights.filter((i) => i.status === 'under');
  const totalSaved = underBudget.reduce((sum, i) => sum + i.diff, 0);
  const totalOver = overBudget.reduce((sum, i) => sum + Math.abs(i.diff), 0);

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">📈 Monthly Budget Insights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-green-100 dark:bg-green-900/30">
          <CardContent className="p-4 space-y-1">
            <h3 className="font-semibold">🟢 Saved Categories</h3>
            {underBudget.length === 0 ? (
              <p>No savings this month</p>
            ) : (
              <ul className="text-sm">
                {underBudget.map((i) => (
                  <li key={i.category} className="flex justify-between">
                    <span>{i.category}</span>
                    <span>Saved {formatCurrency(i.diff)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="bg-red-100 dark:bg-red-900/30">
          <CardContent className="p-4 space-y-1">
            <h3 className="font-semibold">🔴 Overspent Categories</h3>
            {overBudget.length === 0 ? (
              <p>All within limits 🎉</p>
            ) : (
              <ul className="text-sm">
                {overBudget.map((i) => (
                  <li key={i.category} className="flex justify-between">
                    <span>{i.category}</span>
                    <span>Over by {formatCurrency(Math.abs(i.diff))}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-100 dark:bg-slate-800/50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-center">💡 Monthly Summary</h3>
          <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-2">
            Total Saved: <strong className="text-green-700">{formatCurrency(totalSaved)}</strong> <br />
            Total Overspent: <strong className="text-red-700">{formatCurrency(totalOver)}</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}