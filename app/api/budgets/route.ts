// app/api/budgets/route.ts
import { connectDB } from '@/lib/mongo';
import Budget from '@/models/Budget';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  const budgets = await Budget.find();
  return NextResponse.json(budgets);
}

export async function POST(request: Request) {
  await connectDB();
  const data = await request.json();

  const created = await Budget.create({
    amount: data.amount,
    month: data.month,
    year: data.year,
    category: data.category || 'Other',
  });

  return NextResponse.json(created, { status: 201 });
}
