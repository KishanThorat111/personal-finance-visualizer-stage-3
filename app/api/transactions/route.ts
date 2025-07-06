// app/api/transactions/route.ts

import { connectDB } from '@/lib/mongo';
import Transaction from '@/models/Transaction';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  const transactions = await Transaction.find().sort({ date: -1 });
  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();

  // Ensure category exists, fallback to 'Other'
  const created = await Transaction.create({
    amount: data.amount,
    date: data.date,
    description: data.description,
    category: data.category || 'Other',
  });

  return NextResponse.json(created, { status: 201 });
}
