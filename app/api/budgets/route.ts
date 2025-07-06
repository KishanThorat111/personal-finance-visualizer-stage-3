// // app/api/budgets/route.ts
// import { connectDB } from '@/lib/mongo';
// import Budget from '@/models/Budget';
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(req: NextRequest) {
//   await connectDB();
//   const { searchParams } = new URL(req.url);
//   const month = Number(searchParams.get('month'));
//   const year = Number(searchParams.get('year'));

//   const query: any = {};
//   if (!isNaN(month)) query.month = month;
//   if (!isNaN(year)) query.year = year;

//   const budgets = await Budget.find(query);
//   return NextResponse.json(budgets);
// }

// export async function POST(req: NextRequest) {
//   await connectDB();
//   const body = await req.json();
//   const { category, amount, month, year } = body;

//   // Check if a budget for this category/month/year exists
//   const existing = await Budget.findOne({ category, month, year });

//   if (existing) {
//     existing.amount = amount;
//     await existing.save();
//     return NextResponse.json(existing);
//   }

//   const created = await Budget.create({ category, amount, month, year });
//   return NextResponse.json(created, { status: 201 });
// }


// // app/api/budgets/route.ts
// import { connectDB } from '@/lib/mongo';
// import Budget from '@/models/Budget';
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(req: NextRequest) {
//   await connectDB();
//   const { searchParams } = new URL(req.url);
//   const monthFromParam = searchParams.get('month'); // Get month as string from URL param
//   const yearFromParam = searchParams.get('year'); // Get year as string from URL param

//   const now = new Date();
//   const currentMonth = now.getMonth(); // 0-indexed (e.g., 6 for July)
//   const currentYear = now.getFullYear();

//   const query: any = {};

//   // Determine the month for the query
//   if (monthFromParam && !isNaN(Number(monthFromParam))) {
//     query.month = Number(monthFromParam);
//   } else {
//     query.month = currentMonth; // Default to current month if no param or invalid
//   }

//   // Determine the year for the query
//   if (yearFromParam && !isNaN(Number(yearFromParam))) {
//     query.year = Number(yearFromParam);
//   } else {
//     query.year = currentYear; // Default to current year if no param or invalid
//   }

//   // --- CRITICAL SERVER-SIDE LOGS ---
//   console.log('--- API GET /api/budgets DEBUG ---');
//   console.log(`Current server time: ${now.toISOString()}`);
//   console.log(`Server's currentMonth (0-indexed): ${currentMonth}`);
//   console.log(`Server's currentYear: ${currentYear}`);
//   console.log(`Month param from frontend URL: ${monthFromParam}`);
//   console.log(`Year param from frontend URL: ${yearFromParam}`);
//   console.log('Final MongoDB Query object:', query);
//   // --- END CRITICAL SERVER-SIDE LOGS ---

//   const budgets = await Budget.find(query);

//   // --- SERVER-SIDE LOG ---
//   console.log('API GET /api/budgets: Found budgets (after query):', budgets);
//   // --- END SERVER-SIDE LOG ---

//   return NextResponse.json(budgets);
// }

// // ... (POST, PATCH, DELETE routes remain the same)





// app/api/budgets/route.ts
import { connectDB } from '@/lib/mongo';
import Budget from '@/models/Budget';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const monthFromParam = searchParams.get('month'); // Get month as string from URL param
    const yearFromParam = searchParams.get('year'); // Get year as string from URL param

    const now = new Date();
    const currentMonth = now.getMonth(); // 0-indexed (e.g., 6 for July)
    const currentYear = now.getFullYear();

    const query: any = {};

    // Determine the month for the query
    if (monthFromParam !== null && !isNaN(Number(monthFromParam))) {
      query.month = Number(monthFromParam);
    } else {
      query.month = currentMonth; // Default to current month if no param or invalid
    }

    // Determine the year for the query
    if (yearFromParam !== null && !isNaN(Number(yearFromParam))) {
      query.year = Number(yearFromParam);
    } else {
      query.year = currentYear; // Default to current year if no param or invalid
    }

    // --- CRITICAL SERVER-SIDE LOGS ---
    console.log('--- API GET /api/budgets DEBUG ---');
    console.log(`Current server time: ${now.toISOString()}`);
    console.log(`Server's currentMonth (0-indexed): ${currentMonth}`);
    console.log(`Server's currentYear: ${currentYear}`);
    console.log(`Month param from frontend URL: ${monthFromParam}`);
    console.log(`Year param from frontend URL: ${yearFromParam}`);
    console.log('Final MongoDB Query object for GET:', query);
    // --- END CRITICAL SERVER-SIDE LOGS ---

    const budgets = await Budget.find(query);

    // --- SERVER-SIDE LOG ---
    console.log('API GET /api/budgets: Found budgets (after query):', budgets);
    // --- END SERVER-SIDE LOG ---

    return NextResponse.json(budgets, { status: 200 }); // Explicitly set status 200
  } catch (error: any) {
    console.error('API GET /api/budgets error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch budgets.', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { category, amount, month, year } = body;

    // Basic validation
    if (!category || amount === undefined || month === undefined || year === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing required budget fields (category, amount, month, year).' },
        { status: 400 }
      );
    }

    // Check if a budget already exists for this category, month, and year
    // This makes POST idempotent for existing records, effectively acting as an upsert.
    const existingBudget = await Budget.findOne({ category, month, year });

    let budget;
    if (existingBudget) {
      // Update existing budget
      existingBudget.amount = amount;
      budget = await existingBudget.save();
      console.log('API POST /api/budgets: Updated existing budget:', budget);
      return NextResponse.json({ success: true, data: budget }, { status: 200 }); // 200 OK for update
    } else {
      // Create new budget
      budget = await Budget.create({ category, amount, month, year });
      console.log('API POST /api/budgets: Created new budget:', budget);
      return NextResponse.json({ success: true, data: budget }, { status: 201 }); // 201 Created for new
    }

  } catch (error: any) {
    console.error('API POST /api/budgets error:', error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Error creating/updating budget.', error: error.message },
      { status: 500 }
    );
  }
}

// NOTE: No need for a separate PATCH/DELETE here as the [id] route handles them.
// If you remove app/api/budgets/[id]/route.ts, you would need PATCH/DELETE here.