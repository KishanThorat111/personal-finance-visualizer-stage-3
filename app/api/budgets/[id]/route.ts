// app/api/budgets/[id]/route.ts
import { connectDB } from '@/lib/mongo';
import Budget from '@/models/Budget';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest, context: any) {
  await connectDB();
  const id = context.params?.id;
  await Budget.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest, context: any) {
  await connectDB();
  const data = await request.json();
  const id = context.params?.id;

  const updated = await Budget.findByIdAndUpdate(id, {
    amount: data.amount,
    month: data.month,
    year: data.year,
    category: data.category,
  }, { new: true });

  return NextResponse.json(updated);
}
