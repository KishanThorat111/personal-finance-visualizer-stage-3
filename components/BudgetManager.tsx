
// components/BudgetManager.tsx
'use client';

import { useEffect, useState } from 'react';
import { categories } from '@/lib/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toaster';
import { Combobox } from './DashboardSummary';
import { Trash2 } from 'lucide-react'; // Import the trash icon

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
  month: number;
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
  // No longer needed to manage dialog open state manually like this
  // const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); 
  const [budgetToDelete, setBudgetToDelete] = useState<{ id: string | undefined; category: string } | null>(null);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const fetchBudgets = async () => {
    try {
      console.log('BudgetManager - fetchBudgets: Fetching budgets from /api/budgets');
      // Pass month and year to fetch specific budgets for current period
      const res = await fetch(`/api/budgets?month=${currentMonth}&year=${currentYear}`);
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
    fetchBudgets();
  }, [currentMonth, currentYear]);

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

    const existing = budgets.find(
      (b) =>
        b.category === selectedCategory &&
        b.month === currentMonth &&
        b.year === currentYear
    );

    const payload = {
      category: selectedCategory,
      amount: parsedAmount,
      month: currentMonth,
      year: currentYear,
    };

    console.log('BudgetManager - handleSave: Saving payload:', payload);

    try {
      let res;
      if (existing) {
        console.log(`BudgetManager - handleSave: PATCH existing budget for ${selectedCategory} with ID ${existing._id}`);
        res = await fetch(`/api/budgets/${existing._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        console.log(`BudgetManager - handleSave: POST new budget for ${selectedCategory}`);
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
        fetchBudgets(); // Also re-fetch budgets for BudgetManager's internal list
      } else {
        const errorData = await res.json(); // Attempt to parse error response
        console.error('BudgetManager - handleSave: API response error:', errorData);
        throw new Error(`Failed to save budget: ${errorData.message || res.statusText}`);
      }
    } catch (error: any) {
      // Catch network errors or errors from res.json()
      toast(`Failed to save budget: ${error.message || 'Unknown error'}`);
      console.error('BudgetManager - handleSave: Error saving budget:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to set the budget to delete and open the AlertDialog
  const prepareForDelete = (id: string | undefined, categoryName: string) => {
    setBudgetToDelete({ id, category: categoryName });
    // AlertDialog handles its own open/close with AlertDialogTrigger and AlertDialogAction/Cancel
    // No need for setIsDeleteDialogOpen(true) here
  };

  // Function to execute deletion after AlertDialog confirmation
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
      // Dialog will close itself via AlertDialogAction after click
      setBudgetToDelete(null); // Clear the budget to delete state
    }
  };

  const monthlyBudgets = budgets.filter(
    (b) => b.month === currentMonth && b.year === currentYear
  );

  return (
    <div className="p-6 bg-white/70 dark:bg-slate-800/50 rounded-2xl shadow-xl space-y-4">
      <h2 className="text-xl font-bold text-center">📌 Monthly Category Budgets</h2>

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

      {monthlyBudgets.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            Saved Budgets for {now.toLocaleString('default', { month: 'long' })}{' '}
            {currentYear}:
          </h3>
          <ul className="text-sm text-gray-800 dark:text-gray-200 space-y-1">
            {monthlyBudgets.map((b) => (
              <li key={b._id} className="flex justify-between items-center border-b pb-1">
                <span>{b.category}: ₹{b.amount}</span>
                
                {/* The AlertDialog must wrap the AlertDialogTrigger */}
                <AlertDialog> 
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => prepareForDelete(b._id, b.category)} // Prepare data for dialog
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