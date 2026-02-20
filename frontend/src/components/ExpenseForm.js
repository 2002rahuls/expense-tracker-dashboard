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

    setForm({
      amount: "",
      category: "Food",
      date: "",
      notes: "",
    });
  };

  return (
    <div className="card" style={{ maxWidth: 720, margin: "0 auto" }}>
      <h2 className="title">
        {initialData?.id ? "Edit Expense" : "Add Expense"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-row">
          <label className="label">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={form.amount}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div className="form-grid">
          <div className="form-row">
            <label className="label">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="select"
            >
              <option>Food</option>
              <option>Travel</option>
              <option>Bills</option>
              <option>Shopping</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-row">
            <label className="label">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
        </div>

        <div className="form-row">
          <label className="label">Notes</label>
          <textarea
            name="notes"
            placeholder="Optional notes..."
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="textarea"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%" }}
        >
          {initialData?.id ? "Update Expense" : "Save Expense"}
        </button>
      </form>
    </div>
  );
}
