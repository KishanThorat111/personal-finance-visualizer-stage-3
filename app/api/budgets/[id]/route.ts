

// // app/api/budgets/[id]/route.ts
// import { connectDB } from '@/lib/mongo';
// import Budget from '@/models/Budget';
// import { NextRequest, NextResponse } from 'next/server';

// export async function PATCH(req: NextRequest, context: any) {
//   await connectDB();
//   const id = context.params.id;
//   const body = await req.json();

//   const updated = await Budget.findByIdAndUpdate(id, body, { new: true });
//   return NextResponse.json(updated);
// }

// export async function DELETE(req: NextRequest, context: any) {
//   await connectDB();
//   const id = context.params.id;

//   await Budget.findByIdAndDelete(id);
//   return NextResponse.json({ success: true });
// }


// // app/api/budgets/[id]/route.ts
// import { connectDB } from '@/lib/mongo';
// import Budget from '@/models/Budget';
// import { NextRequest, NextResponse } from 'next/server';

// export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     await connectDB();
//     const id = params.id; // Correctly access id from params
//     const body = await req.json();

//     const updated = await Budget.findByIdAndUpdate(id, body, { new: true, runValidators: true });

//     if (!updated) {
//       console.warn(`API PATCH /api/budgets/${id}: Budget not found.`);
//       return NextResponse.json({ success: false, message: 'Budget not found.' }, { status: 404 });
//     }

//     console.log(`API PATCH /api/budgets/${id}: Updated budget:`, updated);
//     return NextResponse.json({ success: true, data: updated }, { status: 200 });
//   } catch (error: any) {
//     console.error(`API PATCH /api/budgets/${params.id} error:`, error);
//     if (error.name === 'CastError') { // Invalid ID format
//         return NextResponse.json({ success: false, message: 'Invalid Budget ID format.' }, { status: 400 });
//     }
//     if (error.name === 'ValidationError') { // Mongoose validation error
//         return NextResponse.json({ success: false, message: error.message }, { status: 400 });
//     }
//     return NextResponse.json(
//       { success: false, message: 'Error updating budget.', error: error.message },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     await connectDB();
//     const id = params.id; // Correctly access id from params

//     const deleted = await Budget.findByIdAndDelete(id);

//     if (!deleted) {
//       console.warn(`API DELETE /api/budgets/${id}: Budget not found.`);
//       return NextResponse.json({ success: false, message: 'Budget not found.' }, { status: 404 });
//     }

//     console.log(`API DELETE /api/budgets/${id}: Deleted budget:`, deleted);
//     return NextResponse.json({ success: true, message: 'Budget deleted successfully.' }, { status: 200 });
//   } catch (error: any) {
//     console.error(`API DELETE /api/budgets/${params.id} error:`, error);
//     if (error.name === 'CastError') {
//         return NextResponse.json({ success: false, message: 'Invalid Budget ID format.' }, { status: 400 });
//     }
//     return NextResponse.json(
//       { success: false, message: 'Error deleting budget.', error: error.message },
//       { status: 500 }
//     );
//   }
// }



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
