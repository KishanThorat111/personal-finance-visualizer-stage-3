
// components/TransactionList.tsx

'use client';

import { Trash2, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TransactionList({ data, onDelete, onEdit }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center mb-2">📜 Recent Transactions</h2>
      {data.map((tx: any) => (
        <motion.div
          key={tx._id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-between items-center bg-white/80 dark:bg-slate-700/50 rounded-xl p-4 shadow hover:scale-[1.01] transition-transform"
        >
          <div>
            <p className="font-bold text-lg">₹{tx.amount}</p>
            <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{tx.description}</p>
            <p className="text-xs italic text-emerald-600 dark:text-emerald-400">Category: {tx.category || 'Other'}</p>

          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => onEdit(tx)}
              className="text-emerald-500 hover:text-emerald-700 transition-all transform hover:scale-110 hover:-translate-y-0.5"
              title="Edit"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(tx._id)}
              className="text-red-500 hover:text-red-700 transition-all transform hover:scale-110 hover:-translate-y-0.5"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
