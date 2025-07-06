// models/Transaction.ts
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  amount: Number,
  description: String,
  date: Date,
  category: String, // Add category field
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', schema);
