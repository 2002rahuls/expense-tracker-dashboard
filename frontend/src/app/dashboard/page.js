"use client";

import { useEffect, useState } from "react";
import { getExpenses } from "../../services/api";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    getExpenses().then((res) => setExpenses(res.data));
  }, []);

  // apply date filter (client-side). expense.date expected as YYYY-MM-DD
  const filteredExpenses = expenses.filter((e) => {
    if (startDate && e.date < startDate) return false;
    if (endDate && e.date > endDate) return false;
    return true;
  });

  // Category breakdown (from filtered data)
  const categoryData = Object.values(
    filteredExpenses.reduce((acc, curr) => {
      acc[curr.category] = acc[curr.category] || { name: curr.category, value: 0 };
      acc[curr.category].value += parseFloat(curr.amount);
      return acc;
    }, {}),
  );

  // Monthly trend (from filtered data)
  const monthlyData = Object.values(
    filteredExpenses.reduce((acc, curr) => {
      const month = curr.date.slice(0, 7); // YYYY-MM
      acc[month] = acc[month] || { month, total: 0 };
      acc[month].total += parseFloat(curr.amount);
      return acc;
    }, {}),
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-end", marginBottom: 12 }}>
        <div className="card" style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ minWidth: 60 }} className="muted">From</div>
          <input className="input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <div style={{ minWidth: 40 }} className="muted">To</div>
          <input className="input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <button className="btn btn-ghost" onClick={() => { setStartDate(""); setEndDate(""); }}>
            Reset
          </button>
        </div>
        <div style={{ alignSelf: "center" }} className="muted">Showing {filteredExpenses.length} of {expenses.length} items</div>
      </div>

      <div className="charts">
        <div className="card chart-card">
          <div className="title">Category Breakdown</div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={80} fill="#8884d8">
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <div className="title">Monthly Trend</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData} margin={{ left: -12 }}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const COLORS = [
  "#6366F1",
  "#06B6D4",
  "#F97316",
  "#10B981",
  "#EF4444",
  "#F59E0B",
];
