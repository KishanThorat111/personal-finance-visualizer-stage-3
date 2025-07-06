// app/page.tsx

'use client';

import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import MonthlyChart from '@/components/MonthlyChart';
import CategoryPieChart from '@/components/CategoryPieChart';
import BudgetChart from '@/components/BudgetChart';
import { DashboardSummary } from '@/components/DashboardSummary';
import { categories as ALL_CATEGORIES } from '@/lib/categories';
import { useEffect, useRef, useState } from 'react';
import { Toaster, toast } from '@/components/ui/toaster';
import { Ban, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import BudgetInsights from '@/components/BudgetInsights';
import BudgetManager from '@/components/BudgetManager'; // Import BudgetManager

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]); // State for budgets
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Derive current month and year here, so all components get the same reference
  // Note: BudgetInsights and BudgetChart now manage their own internal month/year state
  // const now = new Date();
  // const currentMonth = now.getMonth();
  // const currentYear = now.getFullYear();

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [txRes, budgetRes] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/budgets'),
      ]);
      const txJson = await txRes.json();
      const budgetJson = await budgetRes.json();

      console.log('app/page.tsx - fetchData: Fetched transactions (JSON):', txJson);
      console.log('app/page.tsx - fetchData: Fetched budgets (JSON):', budgetJson); // This should now show data!

      setTransactions(txJson);
      setBudgets(budgetJson); // Update the budgets state

    } catch (err) {
      setError(true);
      toast('Error fetching data');
      console.error('Error in fetchData:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addTransaction = async (data: any) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast('Transaction added successfully');
        fetchData();
      } else {
        throw new Error();
      }
    } catch {
      toast('Failed to add transaction');
    }
  };

  const updateTransaction = async (data: any) => {
    if (!editing) return;
    try {
      const res = await fetch(`/api/transactions/${editing._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast('Transaction updated');
        fetchData();
        setEditing(null);
      } else {
        throw new Error();
      }
    } catch {
      toast('Failed to update transaction');
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Transaction deleted');
        fetchData();
      } else {
        throw new Error();
      }
    } catch {
      toast('Failed to delete transaction');
    }
  };

  const handleEdit = (tx: any) => {
    setEditing(tx);
    setTimeout(() => {
      window.scrollTo({
        top: formRef.current?.offsetTop! - 150,
        behavior: 'smooth',
      });
    }, 100);
  };

  const cancelEdit = () => setEditing(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 text-gray-900 dark:text-white p-4 sm:p-6 space-y-10 font-sans">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur border-b border-slate-300 dark:border-slate-700 shadow-xl py-4 px-4 sm:px-6 rounded-xl"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center tracking-tight drop-shadow-xl font-display">
          💸 Personal Finance Visualizer
        </h1>
      </motion.header>

      <section className="max-w-4xl mx-auto px-2 sm:px-0" ref={formRef}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl shadow-2xl"
        >
          <TransactionForm
            onSubmit={addTransaction}
            onUpdate={updateTransaction}
            editing={editing}
            cancelEdit={cancelEdit}
            categories={ALL_CATEGORIES}
          />
        </motion.div>
      </section>

      {loading ? (
        <div className="flex justify-center items-center py-16 animate-pulse">
          <p className="text-lg text-gray-500 font-medium">
            Fetching your financial data...
          </p>
        </div>
      ) : error ? (
        <motion.div className="bg-red-50 dark:bg-red-900/30 rounded-xl shadow-md p-6 flex flex-col items-center gap-2 text-red-600 dark:text-red-300 font-medium">
          <AlertTriangle className="w-8 h-8" />
          <p className="text-lg font-semibold">Failed to load data</p>
        </motion.div>
      ) : transactions.length === 0 && budgets.length === 0 ? (
        <motion.div className="bg-slate-100 dark:bg-slate-800/30 rounded-xl shadow-md p-6 flex flex-col items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
          <Ban className="w-8 h-8" />
          <p className="text-lg font-semibold">No data to display yet.</p>
          <p className="text-sm">Start by adding a transaction or setting a budget!</p>
        </motion.div>
      ) : (
        <>
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-2 sm:px-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 dark:bg-slate-800/50 rounded-3xl shadow-xl p-4 sm:p-6 max-h-[550px] overflow-y-auto"
            >
              <TransactionList
                data={transactions}
                onDelete={deleteTransaction}
                onEdit={handleEdit}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 dark:bg-slate-800/50 rounded-3xl shadow-xl p-4 sm:p-6 space-y-6"
            >
              <DashboardSummary data={transactions} />
              <MonthlyChart data={transactions} />
            </motion.div>
          </section>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <CategoryPieChart data={transactions} />
            {/* THIS IS THE BUDGET MANAGER YOU WANT TO KEEP */}
            <BudgetManager onBudgetChangeSuccess={fetchData} />
            {/*
              Removed currentMonth and currentYear from BudgetChart and BudgetInsights
              as they now manage their own internal month/year state.
              The onBudgetChangeSuccess prop was also removed from BudgetInsights
              as it doesn't modify data that needs a parent refresh.
            */}
            <BudgetChart
              budgets={budgets}
              transactions={transactions}
              // onBudgetChangeSuccess={fetchData} // Removed as per previous fix, if still present
              // currentMonth={currentMonth} // Removed
              // currentYear={currentYear} // Removed
            />
            <BudgetInsights
              budgets={budgets}
              transactions={transactions}
              // currentMonth={currentMonth} // Removed
              // currentYear={currentYear} // Removed
            />
          </motion.div>
        </>
      )}

      <Toaster />
    </main>
  );
}