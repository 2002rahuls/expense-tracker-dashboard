"use client";

import { useEffect, useState, useMemo } from "react";
import { getExpenses } from "../../services/api";
import { getSupabaseClient } from "../../services/supabaseClient";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { getCurrencyRate } from "../../services/api";

const COLORS = [
  "#6366F1",
  "#06B6D4",
  "#F97316",
  "#10B981",
  "#EF4444",
  "#F59E0B",
];

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rate, setRate] = useState(null);

  // ================= REALTIME + INITIAL LOAD =================
  useEffect(() => {
    let mounted = true;
    console.log(
      "Dashboard mounted, fetching initial expenses and setting up realtime...",
    );
    const loadInitial = async () => {
      try {
        const [expensesRes, rateRes] = await Promise.all([
          getExpenses(),
          getCurrencyRate(),
        ]);
        if (mounted) {
          setExpenses(expensesRes.data);
          setRate(rateRes?.data?.rate ?? null);
        }
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      }
    };

    loadInitial();

    const supabase = getSupabaseClient();
    console.log(
      "Supabase client:",
      supabase ? "initialized" : "null - check NEXT_PUBLIC_SUPABASE_* env vars",
    );
    if (!supabase) return;

    const channel = supabase.channel("expenses-realtime");

    channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table: "expenses_expense" },
      (payload) => {
        console.log("Supabase realtime payload:", payload);
        if (typeof inactivityTimer !== "undefined")
          clearTimeout(inactivityTimer);
        if (!mounted) return;

        const type = payload.eventType;
        const newRecord = payload.new;
        const oldRecord = payload.old;

        setExpenses((prev) => {
          if (type === "INSERT") return [newRecord, ...prev];

          if (type === "UPDATE")
            return prev.map((r) => (r.id === newRecord.id ? newRecord : r));

          if (type === "DELETE")
            return prev.filter((r) => r.id !== oldRecord.id);

          return prev;
        });
      },
    );

    // subscribe and log status
    const sub = channel.subscribe((status) =>
      console.log("Realtime subscription status:", status),
    );

    console.log("Subscribed to Supabase realtime channel:", {
      topic: channel.topic,
      state: channel.state,
      sub,
    });

    // inactivity hint if no events arrive in 10s
    const inactivityTimer = setTimeout(
      () =>
        console.log(
          "No realtime events received within 10s — check Network WS & Supabase table policies",
        ),
      10000,
    );

    return () => {
      mounted = false;
      console.log("Unsubscribing Supabase realtime channel");
      if (typeof inactivityTimer !== "undefined") clearTimeout(inactivityTimer);
      supabase.removeChannel(channel);
    };
  }, []);

  // ================= FILTER =================
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (startDate && e.date < startDate) return false;
      if (endDate && e.date > endDate) return false;
      return true;
    });
  }, [expenses, startDate, endDate]);

  // ================= KPI CALCULATIONS =================
  const totalExpense = filteredExpenses.reduce(
    (sum, e) => sum + parseFloat(e.amount),
    0,
  );

  const avgExpense =
    filteredExpenses.length > 0 ? totalExpense / filteredExpenses.length : 0;

  const highestExpense =
    filteredExpenses.length > 0
      ? Math.max(...filteredExpenses.map((e) => parseFloat(e.amount)))
      : 0;

  // ================= CATEGORY BREAKDOWN =================
  const categoryData = Object.values(
    filteredExpenses.reduce((acc, curr) => {
      acc[curr.category] = acc[curr.category] || {
        name: curr.category,
        value: 0,
      };
      acc[curr.category].value += parseFloat(curr.amount);
      return acc;
    }, {}),
  );

  // ================= MONTHLY TREND =================
  const monthlyData = Object.values(
    filteredExpenses.reduce((acc, curr) => {
      const month = curr.date.slice(0, 7);
      acc[month] = acc[month] || { month, total: 0 };
      acc[month].total += parseFloat(curr.amount);
      return acc;
    }, {}),
  );

  // ================= DAILY TREND =================
  const dailyData = Object.values(
    filteredExpenses.reduce((acc, curr) => {
      acc[curr.date] = acc[curr.date] || { date: curr.date, total: 0 };
      acc[curr.date].total += parseFloat(curr.amount);
      return acc;
    }, {}),
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
      {/* ================= KPI GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricItem label="Transactions" value={filteredExpenses.length} />
        <MetricItem
          label="Highest Expense"
          value={formatCurrency(highestExpense)}
        />
        <MetricItem
          label="Average Expense"
          value={formatCurrency(avgExpense)}
        />
        <MetricItem
          label="Total Expense"
          value={formatCurrency(totalExpense)}
        />
      </div>

      {rate && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Currency Conversion
          </div>
          <div className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            1 USD = ₹{Number(rate).toFixed(2)}
          </div>
        </div>
      )}

      {/* ================= FILTER ================= */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">From</label>
          <input
            type="date"
            className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">To</label>
          <input
            type="date"
            className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
        >
          Reset
        </button>
      </div>

      {/* ================= CHARTS GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Category Distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={formatCurrency} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category Comparison">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip formatter={formatCurrency} />
              <Bar dataKey="value" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Trend">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip formatter={formatCurrency} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#06B6D4"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Daily Trend">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip formatter={formatCurrency} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#10B981"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

// ================= KPI COMPONENT =================
function MetricItem({ label, value }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition">
      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        {label}
      </div>
      <div className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="mt-4 h-1 w-12 bg-indigo-500 rounded-full"></div>
    </div>
  );
}

// ================= CHART CARD COMPONENT =================
function ChartCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="text-lg font-semibold mb-4">{title}</div>
      {children}
    </div>
  );
}
