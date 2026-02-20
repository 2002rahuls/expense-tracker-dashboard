"use client";

import { useState } from "react";

export default function ExpenseForm({ onSubmit, initialData = {} }) {
  const data = initialData || {};
  const [form, setForm] = useState({
    amount: data.amount || "",
    category: data.category || "Food",
    date: data.date || "",
    notes: data.notes || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ amount: "", category: "Food", date: "", notes: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
      />
      <select name="category" value={form.category} onChange={handleChange}>
        <option>Food</option>
        <option>Travel</option>
        <option>Bills</option>
        <option>Shopping</option>
        <option>Other</option>
      </select>
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
      />
      <input
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
      />
      <button type="submit">Save</button>
    </form>
  );
}
