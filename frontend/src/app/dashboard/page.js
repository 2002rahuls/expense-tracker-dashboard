"use client";

import { useEffect, useState } from "react";
import { getExpenses } from "../../services/api";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    getExpenses().then((res) => setExpenses(res.data));
  }, []);

  // Category breakdown
  const categoryData = Object.values(
    expenses.reduce((acc, curr) => {
      acc[curr.category] = acc[curr.category] || {
        name: curr.category,
        value: 0,
      };
      acc[curr.category].value += parseFloat(curr.amount);
      return acc;
    }, {}),
  );

  // Monthly trend
  const monthlyData = Object.values(
    expenses.reduce((acc, curr) => {
      const month = curr.date.slice(0, 7); // YYYY-MM
      acc[month] = acc[month] || { month, total: 0 };
      acc[month].total += parseFloat(curr.amount);
      return acc;
    }, {}),
  );

  return (
    <div>
      <h2>Category Breakdown</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={categoryData}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
        />
        <Tooltip />
      </PieChart>

      <h2>Monthly Trend</h2>
      <BarChart width={500} height={300} data={monthlyData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" />
      </BarChart>
    </div>
  );
}
