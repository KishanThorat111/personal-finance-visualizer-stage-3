// models/Budget.ts
import mongoose, { Schema, models } from 'mongoose';

const BudgetSchema = new Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
}, { timestamps: true });

const Budget = models.Budget || mongoose.model('Budget', BudgetSchema);
export default Budget;
