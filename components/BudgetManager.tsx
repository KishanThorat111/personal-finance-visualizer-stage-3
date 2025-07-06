// components/BudgetManager.tsx
'use client';

import { useEffect, useState } from 'react';
import { categories } from '@/lib/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toaster';
import { Combobox } from './DashboardSummary';
import { Trash2 } from 'lucide-react'; // Import the trash icon
import { format } from 'date-fns'; // Import format for month name

// Import AlertDialog components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


type Budget = {
  _id?: string;
  category: string;
  amount: number;
  month: number; // 0-indexed month
  year: number;
};

type Props = {
  onBudgetChangeSuccess: () => void;
};

export default function BudgetManager({ onBudgetChangeSuccess }: Props) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  // State for AlertDialog
  const [budgetToDelete, setBudgetToDelete] = useState<{ id: string | undefined; category: string } | null>(null);

  // New state for selected month and year, initialized to current month/year
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const fetchBudgets = async () => {
    try {
      console.log(`BudgetManager - fetchBudgets: Fetching budgets for month ${selectedMonth} and year ${selectedYear}`);
      // Pass selected month and year to fetch specific budgets
      const res = await fetch(`/api/budgets?month=${selectedMonth}&year=${selectedYear}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      console.log('BudgetManager - fetchBudgets: Fetched budgets:', json);
      setBudgets(json);
    } catch (error) {
      toast('Error fetching budgets');
      console.error('BudgetManager - fetchBudgets: Failed to fetch budgets:', error);
    }
  };

  useEffect(() => {
    // Fetch budgets whenever selectedMonth or selectedYear changes
    fetchBudgets();
  }, [selectedMonth, selectedYear]);

  const handleSave = async () => {
    if (!selectedCategory || !amount) {
      toast('Please select a category and enter an amount.');
      return;
    }
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      toast('Please enter a valid positive number for the amount.');
      return;
    }

    setLoading(true);

    const payload = {
      category: selectedCategory,
      amount: parsedAmount,
      month: selectedMonth, // Use selected month
      year: selectedYear,   // Use selected year
    };

    // Find if a budget for the selected category, month, and year already exists
    const existing = budgets.find(
      (b) =>
        b.category === selectedCategory &&
        b.month === selectedMonth &&
        b.year === selectedYear
    );

    console.log('BudgetManager - handleSave: Saving payload:', payload);

    try {
      let res;
      if (existing) {
        console.log(`BudgetManager - handleSave: PATCH existing budget for ${selectedCategory} (ID: ${existing._id}) for ${format(new Date(selectedYear, selectedMonth), 'MMMM yyyy')}`);
        res = await fetch(`/api/budgets/${existing._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        console.log(`BudgetManager - handleSave: POST new budget for ${selectedCategory} for ${format(new Date(selectedYear, selectedMonth), 'MMMM yyyy')}`);
        res = await fetch('/api/budgets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        toast(existing ? 'Budget updated successfully!' : 'Budget added successfully!');
        setAmount('');
        setSelectedCategory('');
        onBudgetChangeSuccess(); // Notify parent to re-fetch all data, including updated budgets
        fetchBudgets(); // Re-fetch budgets for BudgetManager's internal list to update display
      } else {
        const errorData = await res.json();
        console.error('BudgetManager - handleSave: API response error:', errorData);
        throw new Error(`Failed to save budget: ${errorData.message || res.statusText}`);
      }
    } catch (error: any) {
      toast(`Failed to save budget: ${error.message || 'Unknown error'}`);
      console.error('BudgetManager - handleSave: Error saving budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const prepareForDelete = (id: string | undefined, categoryName: string) => {
    setBudgetToDelete({ id, category: categoryName });
  };

  const executeDelete = async () => {
    if (!budgetToDelete || !budgetToDelete.id) {
      toast('Cannot delete: Budget ID is missing.');
      return;
    }

    try {
      console.log(`BudgetManager - executeDelete: Deleting budget with ID: ${budgetToDelete.id}`);
      const res = await fetch(`/api/budgets/${budgetToDelete.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast('Budget deleted successfully!');
        onBudgetChangeSuccess(); // Notify parent to re-fetch all data
        fetchBudgets(); // Re-fetch budgets for BudgetManager's internal list
      } else {
        const errorData = await res.json();
        console.error('BudgetManager - executeDelete: API response error:', errorData);
        throw new Error(`Failed to delete budget: ${errorData.message || res.statusText}`);
      }
    } catch (error: any) {
      toast(`Failed to delete budget: ${error.message || 'Unknown error'}`);
      console.error('BudgetManager - executeDelete: Error deleting budget:', error);
    } finally {
      setBudgetToDelete(null);
    }
  };

  // Filter budgets based on selectedMonth and selectedYear (already handled by fetch, but good for local state consistency)
  const displayedBudgets = budgets.filter(
    (b) => b.month === selectedMonth && b.year === selectedYear
  );

  return (
    <div className="p-6 bg-white/70 dark:bg-slate-800/50 rounded-2xl shadow-xl space-y-4">
      <h2 className="text-xl font-bold text-center">📌 Monthly Category Budgets</h2>

      {/* Month and Year Selectors */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
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
          min="2000" // Set a reasonable min year
          max="2100" // Set a reasonable max year
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Combobox
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          options={categories}
          placeholder="Select Category"
        />
        <Input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Budget'}
        </Button>
      </div>

      {displayedBudgets.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            Saved Budgets for {format(new Date(selectedYear, selectedMonth), 'MMMM yyyy')}:
          </h3>
          <ul className="text-sm text-gray-800 dark:text-gray-200 space-y-1">
            {displayedBudgets.map((b) => (
              <li key={b._id} className="flex justify-between items-center border-b pb-1">
                <span>{b.category}: ₹{b.amount}</span>
                
                <AlertDialog> 
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => prepareForDelete(b._id, b.category)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the budget for{' '}
                        <span className="font-semibold text-red-600 dark:text-red-400">
                          {budgetToDelete?.category}
                        </span>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={executeDelete} className="bg-red-600 hover:bg-red-700 text-white">
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}