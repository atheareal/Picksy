"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingDown,
  DollarSign,
  PieChart as PieChartIcon,
  Calendar,
  Plus,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  X,
  AlertCircle,
  Clock,
  ShieldCheck,
  Trash2,
  RotateCcw,
} from "lucide-react";
import {
  MOCK_MONTHLY_SPENDING,
  MOCK_SPENDING_SUMMARY,
} from "@/lib/mock/data";
import { Category, MonthlySpendingData } from "@/types";

interface SpendingTransaction {
  id: string;
  itemName: string;
  category: Category;
  amount: number;
  date: string;
  type: "purchase" | "avoided_impulse" | "cooling_off";
  notes?: string;
}

const INITIAL_TRANSACTIONS: SpendingTransaction[] = [
  {
    id: "tx-1",
    itemName: "Hydrating Barrier Repair Cream",
    category: "skincare",
    amount: 38,
    date: "2026-11-12",
    type: "purchase",
    notes: "Restock replacement for empty moisturizer.",
  },
  {
    id: "tx-2",
    itemName: "Limited Edition Velvet Eyeshadow Palette",
    category: "makeup",
    amount: 65,
    date: "2026-11-14",
    type: "avoided_impulse",
    notes: "Impulse check identified 3 redundant neutral palettes in collection.",
  },
  {
    id: "tx-3",
    itemName: "Merino Wool Relaxed Crewneck",
    category: "clothing",
    amount: 115,
    date: "2026-11-08",
    type: "purchase",
    notes: "Seasonal capsule staple; 100% extra-fine wool.",
  },
  {
    id: "tx-4",
    itemName: "Designer Tinted Glow Balm",
    category: "makeup",
    amount: 42,
    date: "2026-11-05",
    type: "avoided_impulse",
    notes: "Cooling-off window allowed emotional urgency to fade.",
  },
  {
    id: "tx-5",
    itemName: "Tailored Weatherproof Trench Coat",
    category: "clothing",
    amount: 195,
    date: "2026-11-02",
    type: "cooling_off",
    notes: "Active 48h cooling period to evaluate autumn necessity.",
  },
];

export default function InsightsPage() {
  const [mounted, setMounted] = React.useState(false);

  // Spending data & Monthly budget limit state
  const [monthlyBudget, setMonthlyBudget] = React.useState(250);
  const [spendingHistory, setSpendingHistory] = React.useState<MonthlySpendingData[]>(MOCK_MONTHLY_SPENDING);
  const [transactions, setTransactions] = React.useState<SpendingTransaction[]>(INITIAL_TRANSACTIONS);

  // Timeframe and category view filters
  const [timeframe, setTimeframe] = React.useState<"3months" | "6months">("6months");
  const [categoryFilter, setCategoryFilter] = React.useState<"all" | Category>("all");

  // Budget Adjust Modal
  const [isBudgetModalOpen, setIsBudgetModalOpen] = React.useState(false);
  const [tempBudgetInput, setTempBudgetInput] = React.useState(monthlyBudget.toString());

  // Log Expense Modal
  const [isExpenseModalOpen, setIsExpenseModalOpen] = React.useState(false);
  const [expenseItem, setExpenseItem] = React.useState("");
  const [expenseCategory, setExpenseCategory] = React.useState<Category>("skincare");
  const [expenseAmount, setExpenseAmount] = React.useState("");
  const [expenseType, setExpenseType] = React.useState<"purchase" | "avoided_impulse">("purchase");
  const [expenseNotes, setExpenseNotes] = React.useState("");
  const [modalError, setModalError] = React.useState<string | null>(null);

  // Status notice
  const [actionNotice, setActionNotice] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (actionNotice) {
      const timer = setTimeout(() => setActionNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionNotice]);

  // Filtered monthly spending data based on timeframe
  const filteredSpendingData = React.useMemo(() => {
    if (timeframe === "3months") {
      return spendingHistory.slice(-3);
    }
    return spendingHistory;
  }, [spendingHistory, timeframe]);

  // Current month totals
  const currentMonthData = spendingHistory[spendingHistory.length - 1] || {
    makeup: 0,
    skincare: 0,
    clothing: 0,
    total: 0,
    budget: monthlyBudget,
  };

  const totalAvoidedSavings = transactions
    .filter((tx) => tx.type === "avoided_impulse")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Category breakdown for Donut/Pie Chart
  const categoryChartData = [
    { name: "Skincare", value: currentMonthData.skincare, color: "#C77D98" },
    { name: "Clothing", value: currentMonthData.clothing, color: "#6E5B63" },
    { name: "Makeup", value: currentMonthData.makeup, color: "#E8B8C8" },
  ];

  // Cumulative savings trend
  const cumulativeSavingsTrend = [
    { month: "Jun", saved: 65 },
    { month: "Jul", saved: 110 },
    { month: "Aug", saved: 145 },
    { month: "Sep", saved: 180 },
    { month: "Oct", saved: 215 },
    { month: "Nov", saved: 215 + totalAvoidedSavings },
  ];

  // Budget adjustment submit
  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(tempBudgetInput);
    if (isNaN(val) || val <= 0) {
      setModalError("Please enter a valid positive budget amount.");
      return;
    }
    setMonthlyBudget(val);
    setIsBudgetModalOpen(false);
    setModalError(null);
    setActionNotice(`Updated monthly discretionary budget limit to $${val}.`);
  };

  // Add new transaction
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!expenseItem.trim()) {
      setModalError("Please specify the item name.");
      return;
    }

    const amt = parseFloat(expenseAmount);
    if (isNaN(amt) || amt <= 0) {
      setModalError("Please enter a valid expense amount.");
      return;
    }

    const newTx: SpendingTransaction = {
      id: `tx-${Date.now()}`,
      itemName: expenseItem.trim(),
      category: expenseCategory,
      amount: amt,
      date: new Date().toISOString().split("T")[0],
      type: expenseType,
      notes: expenseNotes.trim() || undefined,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // If it's a purchase, increment current month spending
    if (expenseType === "purchase") {
      setSpendingHistory((prev) => {
        const lastIdx = prev.length - 1;
        const current = { ...prev[lastIdx] };
        if (expenseCategory === "skincare") current.skincare += amt;
        if (expenseCategory === "clothing") current.clothing += amt;
        if (expenseCategory === "makeup") current.makeup += amt;
        current.total += amt;

        const updated = [...prev];
        updated[lastIdx] = current;
        return updated;
      });
      setActionNotice(`Logged $${amt} expenditure for "${newTx.itemName}".`);
    } else {
      setActionNotice(`Recorded $${amt} avoided impulse purchase for "${newTx.itemName}".`);
    }

    setIsExpenseModalOpen(false);
    setExpenseItem("");
    setExpenseAmount("");
    setExpenseNotes("");
  };

  // Remove transaction
  const handleRemoveTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setActionNotice("Removed entry from transaction ledger.");
  };

  const budgetProgressPercent = Math.min(
    100,
    parseFloat(((currentMonthData.total / monthlyBudget) * 100).toFixed(1))
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Action Notice */}
        {actionNotice && (
          <div className="flex items-center justify-between p-3 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 animate-in fade-in">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              {actionNotice}
            </span>
            <button
              type="button"
              onClick={() => setActionNotice(null)}
              className="text-emerald-700 hover:text-emerald-900"
              aria-label="Dismiss notice"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Top Header & Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-espresso/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-espresso">
                Shopping Insights
              </h2>
              <Badge variant="subtle" size="sm">
                Habit Analytics
              </Badge>
            </div>
            <p className="text-xs text-espresso-muted mt-0.5">
              Monthly spending patterns, category distribution, and cumulative impulse savings
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<SlidersHorizontal className="h-3.5 w-3.5" />}
              onClick={() => {
                setTempBudgetInput(monthlyBudget.toString());
                setIsBudgetModalOpen(true);
              }}
            >
              Adjust budget cap (${monthlyBudget})
            </Button>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => {
                setModalError(null);
                setIsExpenseModalOpen(true);
              }}
            >
              Log transaction
            </Button>
          </div>
        </div>

        {/* Top Analytic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-espresso-muted">
                Monthly Spending
              </span>
              <span className="text-[11px] font-medium text-espresso-muted">
                Cap: ${monthlyBudget}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-espresso">
                ${currentMonthData.total}
              </span>
              <span className="text-xs text-emerald-700 font-medium">
                ${Math.max(0, monthlyBudget - currentMonthData.total)} remaining
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-espresso/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-berry rounded-full transition-all duration-300"
                style={{ width: `${budgetProgressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-espresso-muted block mt-1">
              {budgetProgressPercent}% budget utilization
            </span>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-espresso-muted">
                Avoided Impulse Buys
              </span>
              <TrendingDown className="h-4 w-4 text-berry" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-800">
                +${totalAvoidedSavings}
              </span>
              <span className="text-xs text-espresso-muted">
                saved
              </span>
            </div>
            <p className="text-[11px] text-espresso-muted mt-2">
              Calculated from items declined during cooling-off checks
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-espresso-muted">
                Wardrobe & Vanity Value
              </span>
              <DollarSign className="h-4 w-4 text-espresso-muted" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-espresso">
                ${MOCK_SPENDING_SUMMARY.totalCollectionValue}
              </span>
              <span className="text-xs text-espresso-muted">
                14 owned items
              </span>
            </div>
            <p className="text-[11px] text-espresso-muted mt-2">
              Average item investment: $45.85
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-espresso-muted">
                Average Deliberation Time
              </span>
              <Clock className="h-4 w-4 text-espresso-muted" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-espresso">
                9.4 days
              </span>
            </div>
            <p className="text-[11px] text-espresso-muted mt-2">
              From wishlist queueing to checkout decision
            </p>
          </Card>
        </div>

        {/* Chart Grid: Main Monthly Bar Chart & Category Allocation Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Monthly Spending Breakdown (8 cols) */}
          <Card className="lg:col-span-8 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-espresso/10">
              <div>
                <CardTitle>Monthly spending by category ($)</CardTitle>
                <CardDescription>
                  Tracking makeup, skincare, and clothing expenditures against the ${monthlyBudget} monthly budget cap
                </CardDescription>
              </div>

              {/* Timeframe Selector */}
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setTimeframe("3months")}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    timeframe === "3months"
                      ? "bg-berry text-white"
                      : "bg-white border border-espresso/15 text-espresso hover:border-berry"
                  }`}
                >
                  Last 3 Months
                </button>
                <button
                  type="button"
                  onClick={() => setTimeframe("6months")}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    timeframe === "6months"
                      ? "bg-berry text-white"
                      : "bg-white border border-espresso/15 text-espresso hover:border-berry"
                  }`}
                >
                  Last 6 Months
                </button>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filteredSpendingData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#46363C" opacity={0.08} />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#6E5B63", fontSize: 11 }}
                      axisLine={{ stroke: "#46363C", opacity: 0.15 }}
                    />
                    <YAxis
                      tick={{ fill: "#6E5B63", fontSize: 11 }}
                      axisLine={{ stroke: "#46363C", opacity: 0.15 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFF9F3",
                        borderColor: "#D8CED2",
                        borderRadius: "6px",
                        fontSize: "12px",
                        color: "#46363C",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Bar dataKey="skincare" name="Skincare" fill="#C77D98" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="clothing" name="Clothing" fill="#6E5B63" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="makeup" name="Makeup" fill="#E8B8C8" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs text-espresso-muted">
                  Loading monthly spending chart...
                </div>
              )}
            </div>
          </Card>

          {/* Current Month Category Distribution (4 cols) */}
          <Card className="lg:col-span-4 p-5 space-y-4">
            <div className="pb-2 border-b border-espresso/10">
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>
                Proportion of active month purchases
              </CardDescription>
            </div>

            <div className="h-48 w-full flex items-center justify-center">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFF9F3",
                        borderColor: "#D8CED2",
                        borderRadius: "6px",
                        fontSize: "12px",
                        color: "#46363C",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-xs text-espresso-muted">Loading breakdown...</div>
              )}
            </div>

            {/* Category breakdown legend rows */}
            <div className="space-y-2 pt-1 border-t border-espresso/10 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-espresso-light">
                  <span className="h-2 w-2 rounded-full bg-[#C77D98]" /> Skincare
                </span>
                <span className="font-semibold text-espresso">
                  ${currentMonthData.skincare} ({((currentMonthData.skincare / (currentMonthData.total || 1)) * 100).toFixed(0)}%)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-espresso-light">
                  <span className="h-2 w-2 rounded-full bg-[#6E5B63]" /> Clothing
                </span>
                <span className="font-semibold text-espresso">
                  ${currentMonthData.clothing} ({((currentMonthData.clothing / (currentMonthData.total || 1)) * 100).toFixed(0)}%)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-espresso-light">
                  <span className="h-2 w-2 rounded-full bg-[#E8B8C8]" /> Makeup
                </span>
                <span className="font-semibold text-espresso">
                  ${currentMonthData.makeup} ({((currentMonthData.makeup / (currentMonthData.total || 1)) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Second Chart: Cumulative Savings from Impulse Friction */}
        <Card className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-espresso/10">
            <div>
              <CardTitle>Cumulative Impulse Savings Over Time ($)</CardTitle>
              <CardDescription>
                Financial preservation achieved by declining non-essential impulse items during 48-hour friction checks
              </CardDescription>
            </div>
            <Badge variant="success" size="sm">
              +${totalAvoidedSavings} Saved This Month
            </Badge>
          </div>

          <div className="h-48 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={cumulativeSavingsTrend}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#46363C" opacity={0.08} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#6E5B63", fontSize: 11 }}
                    axisLine={{ stroke: "#46363C", opacity: 0.15 }}
                  />
                  <YAxis
                    tick={{ fill: "#6E5B63", fontSize: 11 }}
                    axisLine={{ stroke: "#46363C", opacity: 0.15 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFF9F3",
                      borderColor: "#D8CED2",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "#46363C",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="saved"
                    name="Cumulative Savings ($)"
                    stroke="#15803d"
                    strokeWidth={2}
                    dot={{ fill: "#15803d", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-espresso-muted">
                Loading savings trajectory...
              </div>
            )}
          </div>
        </Card>

        {/* Recent Purchases & Impulse Avoidance Activity Ledger */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-espresso">
                Decision & Transaction Ledger
              </h3>
              <p className="text-xs text-espresso-muted">
                Audit trail of vetted purchases versus prevented impulse buys
              </p>
            </div>

            <span className="text-[11px] text-espresso-muted">
              [Demo / Prototype Mode • Structured Analytics Ledger]
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-espresso/10 bg-white">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-espresso/10 bg-espresso/5 text-espresso-muted">
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Item & Category</th>
                  <th className="p-3 font-semibold">Decision Status</th>
                  <th className="p-3 font-semibold">Financial Impact</th>
                  <th className="p-3 font-semibold">Notes / Rationale</th>
                  <th className="p-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/10 text-espresso">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-cream-light/60 transition-colors">
                    <td className="p-3 whitespace-nowrap text-espresso-muted font-medium">
                      {tx.date}
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-espresso">{tx.itemName}</div>
                      <span className="text-[11px] text-espresso-muted capitalize">{tx.category}</span>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <Badge
                        variant={
                          tx.type === "purchase"
                            ? "subtle"
                            : tx.type === "avoided_impulse"
                            ? "success"
                            : "warning"
                        }
                        size="sm"
                      >
                        {tx.type === "purchase"
                          ? "Vetted Purchase"
                          : tx.type === "avoided_impulse"
                          ? "Avoided via Impulse Check"
                          : "48h Cooldown Active"}
                      </Badge>
                    </td>

                    <td className="p-3 whitespace-nowrap font-bold">
                      {tx.type === "purchase" ? (
                        <span className="text-espresso">-${tx.amount}</span>
                      ) : tx.type === "avoided_impulse" ? (
                        <span className="text-emerald-800">+${tx.amount} saved</span>
                      ) : (
                        <span className="text-amber-800">${tx.amount} pending</span>
                      )}
                    </td>

                    <td className="p-3 text-xs text-espresso-light max-w-xs truncate">
                      {tx.notes || "—"}
                    </td>

                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveTransaction(tx.id)}
                        className="p-1 text-espresso-muted hover:text-red-700 transition-colors"
                        title="Remove entry"
                        aria-label="Remove transaction entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ADJUST MONTHLY BUDGET CAP MODAL */}
        {/* ========================================================================= */}
        {isBudgetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/40 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-sm bg-cream-light rounded-lg border border-espresso/15 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
                <h3 className="text-sm font-bold text-espresso">
                  Configure Monthly Budget Cap
                </h3>
                <button
                  type="button"
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="text-espresso-muted hover:text-espresso"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {modalError && (
                <div className="p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleBudgetSubmit} className="space-y-3.5">
                <Input
                  label="Monthly Allowance ($) *"
                  type="number"
                  step="1"
                  required
                  value={tempBudgetInput}
                  onChange={(e) => setTempBudgetInput(e.target.value)}
                  placeholder="e.g. 250"
                  helperText="Defines your maximum deliberate spending limit for beauty & clothing each month."
                />

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-espresso/10">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsBudgetModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Save Budget Cap
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LOG TRANSACTION MODAL */}
        {/* ========================================================================= */}
        {isExpenseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/40 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-cream-light rounded-lg border border-espresso/15 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
                <h3 className="text-sm font-bold text-espresso">
                  Log Shopping Activity
                </h3>
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="text-espresso-muted hover:text-espresso"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {modalError && (
                <div className="p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleExpenseSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-espresso mb-1">
                    Activity Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setExpenseType("purchase")}
                      className={`h-8 rounded text-xs font-semibold border ${
                        expenseType === "purchase"
                          ? "bg-berry text-white border-berry"
                          : "bg-white text-espresso border-espresso/15"
                      }`}
                    >
                      Completed Purchase
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpenseType("avoided_impulse")}
                      className={`h-8 rounded text-xs font-semibold border ${
                        expenseType === "avoided_impulse"
                          ? "bg-emerald-800 text-white border-emerald-800"
                          : "bg-white text-espresso border-espresso/15"
                      }`}
                    >
                      Avoided Impulse Buy
                    </button>
                  </div>
                </div>

                <Input
                  label="Item Name *"
                  required
                  value={expenseItem}
                  onChange={(e) => setExpenseItem(e.target.value)}
                  placeholder="e.g. Squalane Hydrating Cleanser"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Amount ($) *"
                    type="number"
                    step="0.01"
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="e.g. 34"
                  />

                  <div>
                    <label className="block text-xs font-medium text-espresso mb-1">
                      Category
                    </label>
                    <select
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value as Category)}
                      className="w-full h-8 px-2 text-xs rounded-md border border-espresso/15 bg-white text-espresso focus:border-berry focus:outline-none"
                    >
                      <option value="skincare">Skincare</option>
                      <option value="clothing">Clothing</option>
                      <option value="makeup">Makeup</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-espresso mb-1">
                    Notes / Deliberation Rationale
                  </label>
                  <textarea
                    rows={2}
                    value={expenseNotes}
                    onChange={(e) => setExpenseNotes(e.target.value)}
                    placeholder="e.g. Empty replacement / Declined after checking 3 duplicates in collection..."
                    className="w-full p-2 text-xs rounded-md border border-espresso/15 bg-white text-espresso focus:border-berry focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-espresso/10">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExpenseModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Log Entry
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
