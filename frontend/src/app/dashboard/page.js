"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { getExpenses, getCurrencyRate } from "../../services/api";
import { getSupabaseClient } from "../../services/supabaseClient";
import { useTheme } from "../../context/ThemeContext";
import KpiCard from "../../components/KpiCard";
import ChartCard from "../../components/ChartCard";
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

// ── Chart colors adapt to theme ──────────────────────────────────────────────
const LIGHT_COLORS = [
  "#6366F1",
  "#06B6D4",
  "#F97316",
  "#10B981",
  "#EF4444",
  "#F59E0B",
];
const DARK_COLORS = [
  "#818CF8",
  "#22D3EE",
  "#FB923C",
  "#34D399",
  "#F87171",
  "#FBBF24",
];

const formatCurrency = (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;

const CATEGORY_ICONS = {
  Food: "🍔",
  Travel: "✈️",
  Bills: "💡",
  Shopping: "🛍️",
  Other: "📌",
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "var(--shadow-md)",
        fontSize: 13,
      }}
    >
      {label && (
        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: 4,
            fontWeight: 600,
          }}
        >
          {label}
        </p>
      )}
      {payload.map((p, i) => (
        <p
          key={i}
          style={{ color: p.color || "var(--text-primary)", fontWeight: 700 }}
        >
          {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "var(--shadow-md)",
        fontSize: 13,
      }}
    >
      <p
        style={{ color: "var(--text-muted)", marginBottom: 4, fontWeight: 600 }}
      >
        {p.name}
      </p>
      <p
        style={{ color: p.payload?.fill || "var(--primary)", fontWeight: 700 }}
      >
        {formatCurrency(p.value)}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { theme } = useTheme();
  const COLORS = theme === "dark" ? DARK_COLORS : LIGHT_COLORS;

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rate, setRate] = useState(null);

  const channelRef = useRef(null);

  const axisColor = theme === "dark" ? "#475569" : "#CBD5E1";
  const gridColor =
    theme === "dark" ? "rgba(71,85,105,0.25)" : "rgba(203,213,225,0.4)";
  const tickColor = theme === "dark" ? "#64748B" : "#94A3B8";

  useEffect(() => {
    let mounted = true;

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
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadInitial();

    const supabase = getSupabaseClient();
    if (!supabase) return;

    // Prevent double subscription in StrictMode
    if (channelRef.current) return;

    const channel = supabase.channel("expenses-realtime");
    channelRef.current = channel;

    channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table: "expenses_expense" },
      (payload) => {
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

    channel.subscribe((status) =>
      console.log("Realtime subscription status:", status),
    );

    return () => {
      mounted = false;
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, []);

  const filtered = useMemo(
    () =>
      expenses.filter((e) => {
        if (startDate && e.date < startDate) return false;
        if (endDate && e.date > endDate) return false;
        return true;
      }),
    [expenses, startDate, endDate],
  );

  const totalExpense = filtered.reduce((s, e) => s + parseFloat(e.amount), 0);
  const avgExpense = filtered.length > 0 ? totalExpense / filtered.length : 0;
  const highestExpense =
    filtered.length > 0
      ? Math.max(...filtered.map((e) => parseFloat(e.amount)))
      : 0;

  const topCategory = (() => {
    if (!filtered.length) return "—";
    const totals = filtered.reduce((acc, e) => {
      const cat = e.category || "Unknown";
      const amt = Number(e.amount);
      if (!Number.isFinite(amt)) return acc;
      acc[cat] = (acc[cat] || 0) + amt;
      return acc;
    }, {});
    const top = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : "—";
  })();

  const usdEquivalent = rate ? (totalExpense / rate).toFixed(2) : null;

  // ── Chart data ─────────────────────────────────────────────────────────────
  const categoryData = Object.values(
    filtered.reduce((acc, cur) => {
      acc[cur.category] = acc[cur.category] || { name: cur.category, value: 0 };
      acc[cur.category].value += parseFloat(cur.amount);
      return acc;
    }, {}),
  );

  const monthlyData = Object.values(
    filtered.reduce((acc, cur) => {
      const month = cur.date.slice(0, 7);
      acc[month] = acc[month] || { month, total: 0 };
      acc[month].total += parseFloat(cur.amount);
      return acc;
    }, {}),
  ).sort((a, b) => a.month.localeCompare(b.month));

  const dailyData = Object.values(
    filtered.reduce((acc, cur) => {
      acc[cur.date] = acc[cur.date] || { date: cur.date, total: 0 };
      acc[cur.date].total += parseFloat(cur.amount);
      return acc;
    }, {}),
  ).sort((a, b) => a.date.localeCompare(b.date));

  const KPI_LOADING = loading;

  return (
    <div className="page-container">
      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="text-h1">Analytics Dashboard</h1>
          <p className="text-sm text-muted" style={{ marginTop: 4 }}>
            Track and analyze your spending patterns
          </p>
        </div>
      </div>

      {/* ── KPI cards ──────────────────────────────────────────────────────── */}
      <div className="kpi-grid">
        <KpiCard
          label="Total Expenses"
          value={KPI_LOADING ? "" : formatCurrency(totalExpense)}
          icon="💰"
          iconBg="rgba(99,102,241,0.12)"
          loading={KPI_LOADING}
        />
        <KpiCard
          label="Highest Single"
          value={KPI_LOADING ? "" : formatCurrency(highestExpense)}
          icon="📈"
          iconBg="rgba(239,68,68,0.12)"
          loading={KPI_LOADING}
        />
        <KpiCard
          label="Top Category"
          value={
            KPI_LOADING
              ? ""
              : `${CATEGORY_ICONS[topCategory] || "📌"} ${topCategory}`
          }
          icon="🏆"
          iconBg="rgba(245,158,11,0.12)"
          loading={KPI_LOADING}
        />
        <KpiCard
          label={
            rate
              ? `USD Equivalent (₹${Number(rate).toFixed(0)}/USD)`
              : "Avg. Expense"
          }
          value={
            KPI_LOADING
              ? ""
              : usdEquivalent
                ? `$${Number(usdEquivalent).toLocaleString()}`
                : formatCurrency(avgExpense)
          }
          icon={usdEquivalent ? "💵" : "📊"}
          iconBg="rgba(16,185,129,0.12)"
          loading={KPI_LOADING}
        />
      </div>

      {/* ── Date filter ────────────────────────────────────────────────────── */}
      <div className="card section-gap">
        <div className="filter-panel">
          <div>
            <label className="form-label">From Date</label>
            <input
              type="date"
              className="input"
              style={{ width: "auto" }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">To Date</label>
            <input
              type="date"
              className="input"
              style={{ width: "auto" }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            disabled={!startDate && !endDate}
          >
            Reset Filter
          </button>
          <div
            style={{
              marginLeft: "auto",
              color: "var(--text-muted)",
              fontSize: 13,
            }}
          >
            Showing{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              {filtered.length}
            </strong>{" "}
            transactions
          </div>
        </div>
      </div>

      {/* ── Charts grid ────────────────────────────────────────────────────── */}
      <div className="charts-grid section-gap">
        <ChartCard
          title="Category Distribution"
          subtitle="Spending breakdown by category"
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                innerRadius={40}
                paddingAngle={3}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={{ strokeWidth: 1, stroke: tickColor }}
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span
                    style={{ color: "var(--text-secondary)", fontSize: 12 }}
                  >
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Category Comparison"
          subtitle="Bar comparison across categories"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData} barSize={28}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: tickColor }}
                axisLine={{ stroke: axisColor }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `₹${v / 1000}k`}
                tick={{ fontSize: 11, fill: tickColor }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "var(--surface-hover)" }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {categoryData.map((_, index) => (
                  <Cell
                    key={`bar-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Trend" subtitle="Total spending per month">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: tickColor }}
                axisLine={{ stroke: axisColor }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `₹${v / 1000}k`}
                tick={{ fontSize: 11, fill: tickColor }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="total"
                stroke={COLORS[0]}
                strokeWidth={2.5}
                dot={{ r: 4, fill: COLORS[0], strokeWidth: 0 }}
                activeDot={{
                  r: 6,
                  fill: COLORS[0],
                  stroke: "var(--surface)",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Daily Trend" subtitle="Daily spending over time">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={dailyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: tickColor }}
                axisLine={{ stroke: axisColor }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `₹${v / 1000}k`}
                tick={{ fontSize: 11, fill: tickColor }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="total"
                stroke={COLORS[3]}
                strokeWidth={2.5}
                dot={{ r: 3, fill: COLORS[3], strokeWidth: 0 }}
                activeDot={{
                  r: 5,
                  fill: COLORS[3],
                  stroke: "var(--surface)",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
