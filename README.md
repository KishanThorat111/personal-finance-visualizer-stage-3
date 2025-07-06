Absolutely\! I've updated the `README.md` to include your live Vercel URL for Stage 3.

-----

# 💸 Personal Finance Visualizer — Stage 3 (Budgeting & Enhanced Insights)

A modern, responsive full-stack web application to **track personal expenses and manage budgets**. Built with **Next.js 14**, **MongoDB**, **Tailwind CSS**, **shadcn/ui**, **Recharts**, and animated with **Framer Motion** — it offers a sleek interface to manage transactions, set budgets, and visualize spending.

-----

## 🚀 Features

### ✅ Stage 1: Basic Transaction Tracking

  * ➕ Add / ✏️ Edit / ❌ Delete transactions (amount, date, description)
  * 📃 List view of recent transactions
  * 📊 Monthly expenses bar chart
  * ✅ Form validation with error states
  * 🌙 Dark mode + responsive UI
  * 🔔 Toast notifications using `sonner`

### ✅ Stage 2: Dashboard + Visual Analytics

  * 🧾 **Category-based tagging** of transactions
  * 🥧 **Top 10 Category-wise Expense Pie Chart** using `Recharts`
  * 💠 Glassmorphism design with rounded cards & hover tooltips
  * 🧮 Dashboard summary cards (Total, Most Recent)
  * 🎯 Responsive layout improvements with better section separation
  * 🧠 Hover-based tooltips and better font scaling for large data
  * 🧊 Cards prepared for Stage 3 integration

### 🆕 Stage 3: Budget Management & Enhanced Insights

  * 💰 **Monthly Category Budgets:** Set and manage specific budgets for each spending category.
  * 📊 **Monthly Budget vs Actual Chart:** Visualize your actual spending against your set budgets for the top 10 categories.
      * **Dynamic Date Selection:** Interactive month and year selectors allow viewing budget performance for any period.
      * **Improved Label Readability:** Enhanced X-axis handling for category names (rotation, truncation) ensures clear display.
  * 📈 **Monthly Budget Insights:** Get high-level overviews of your financial health.
      * **Dynamic Date Selection:** Interactive month and year selectors to analyze insights for any period.
      * **Detailed Category Breakdown:** Clearly distinguish between categories where you saved (under budget) and overspent.
      * **Overall Performance Summary:** A consolidated view of total budgeted, total spent, and the net difference for the selected month, with intuitive color-coding.
  * 🗑️ **Budget Deletion:** Easily remove set budgets via a confirmation dialog.

> ✅ Fully functional and deployed live\!

-----

## 🌐 Live Demo

🔗 [Live App on Vercel](https://personal-finance-visualizer-stage-3-delta.vercel.app/)

📦 [GitHub Repository (Stage 3)](https://www.google.com/search?q=https://github.com/KishanThorat111/personal-finance-visualizer-stage3) (Consider creating a new branch or repo for Stage 3, or update your existing one)

-----

## 🧠 Tech Stack

| Tech              | Usage                                    |
| :---------------- | :--------------------------------------- |
| **Next.js** | Full-stack React framework               |
| **MongoDB** | NoSQL database with Mongoose ORM         |
| **Tailwind CSS** | Utility-first styling                    |
| **shadcn/ui** | Styled components with accessibility     |
| **Framer Motion** | Smooth component animations              |
| **Recharts** | Interactive charting for expense visuals |
| **React Hook Form** | Simplified form handling + validation  |
| **Lucide Icons** | Clean icons for actions                  |
| **Sonner** | Toast notifications                      |
| **date-fns** | Robust date utility library              |

-----

### 📊 Dashboard Charts & Summary Cards

| Component            | Description                                                |
| :------------------- | :--------------------------------------------------------- |
| **MonthlyChart** | Bar chart of daily expenses in selected month              |
| **CategoryPieChart** | Pie chart of top 10 categories with percent + tooltips     |
| **BudgetManager** | Manage monthly budgets for spending categories             |
| **BudgetChart** | Compare monthly actual spending against set budgets        |
| **BudgetInsights** | Detailed summary of budget performance and insights        |
| **DashboardSummary** | Card with Total Expenses, Most Recent, and more summaries  |

-----

## 🧩 Project Structure

```
personal-finance-visualizer/
├── app/
│   ├── api/
│   │   ├── transactions/route.ts        // POST + GET transactions
│   │   ├── transactions/[id]/route.ts   // PATCH + DELETE transactions
│   │   ├── budgets/route.ts             // POST + GET budgets
│   │   └── budgets/[id]/route.ts        // PATCH + DELETE budgets
│   └── page.tsx                         // Main Dashboard
├── components/
│   ├── TransactionForm.tsx
│   ├── TransactionList.tsx
│   ├── MonthlyChart.tsx
│   ├── CategoryPieChart.tsx
│   ├── BudgetManager.tsx                // NEW
│   ├── BudgetChart.tsx                  // NEW
│   ├── BudgetInsights.tsx               // NEW
│   └── ui/                              // shadcn/ui components (toaster, card, etc.)
├── lib/
│   ├── categories.ts
│   └── mongo.ts
├── models/
│   ├── Transaction.ts
│   └── Budget.ts                        // NEW
├── .env.local
```

-----

## ⚙️ Setup & Installation

### ✅ Step 1: Clone the repo

```bash
git clone https://github.com/KishanThorat111/personal-finance-visualizer-stage3.git
cd personal-finance-visualizer-stage3
```

### ✅ Step 2: Install dependencies

```bash
npm install
```

### ✅ Step 3: Setup MongoDB

Create `.env.local` in the root:

```env
MONGODB_URI="your_mongodb_connection_string"
```

### ✅ Step 4: Run the app

```bash
npm run dev
```

Visit: [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)

-----

## 📅 Development Timeline & Commits (Current Stage 3 Focus)

### Step-by-step commits:

```bash
# Stage 2 Commits (from your previous README)
git commit -m "feat: added category field to transactions and predefined categories list"
git commit -m "feat: implemented top 10 category-wise pie chart with Recharts"
git commit -m "style: added glassmorphism UI to pie chart card"
git commit -m "fix: handled long labels with tooltip on hover"
git commit -m "refactor: adjusted layout for better alignment with monthly chart"
git commit -m "style: matched glassmorphism colors with overall dashboard"
git commit -m "fix: tweaked pie chart size for better readability"

# Stage 3 Commits (recent additions)
git commit -m "feat: Implement monthly budgeting feature with dedicated API endpoints"
git commit -m "feat: Develop 'Monthly Budget vs Actual' chart with dynamic date selection"
git commit -m "style: Improve X-axis category label readability in Budget vs Actual chart"
git commit -m "feat: Create 'Monthly Budget Insights' component with dynamic date selection"
git commit -m "style: Enhance design and layout of Monthly Budget Insights for clarity"
git commit -m "fix: Correct date-fns `YYYY` to `yyyy` formatting across components"
git commit -m "feat: Add budget deletion functionality with confirmation dialog"
```

-----

## 🧪 What's Next? (Future Enhancements)

  * 🔍 Advanced filtering and search for transactions and budgets.
  * 🔄 Recurring transactions/budgets.
  * 📈 Historical trend analysis over multiple months/years.
  * 📥 Data import/export (e.g., CSV).
  * 🔑 User authentication and multi-user support.

-----

## 📄 License

MIT License © 2025 [Kishan Thorat](https://github.com/KishanThorat111)

-----

## 🤝 Connect

💼 [LinkedIn](https://linkedin.com/in/kishanthorat)
💻 [GitHub](https://github.com/KishanThorat111)

-----

> Built with ❤️ using Next.js, Tailwind, MongoDB, and Recharts