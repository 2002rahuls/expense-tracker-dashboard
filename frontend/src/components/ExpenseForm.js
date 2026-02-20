"use client";

import { useState, useEffect } from "react";

export default function ExpenseForm({ onSubmit, initialData = {}, onCancel }) {
  const data = initialData || {};

  const [form, setForm] = useState({
    amount: data.amount || "",
    category: data.category || "Food",
    date: data.date || "",
    notes: data.notes || "",
  });

  useEffect(() => {
    setForm({
      amount: data.amount || "",
      category: data.category || "Food",
      date: data.date || "",
      notes: data.notes || "",
    });
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(form);

    // After creating, clear the form. When editing, parent will clear initialData.
    if (!initialData?.id) {
      setForm({ amount: "", category: "Food", date: "", notes: "" });
    }
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

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            {initialData?.id ? "Update Expense" : "Save Expense"}
          </button>

          {initialData?.id && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                if (onCancel) onCancel();
              }}
              style={{ minWidth: 110 }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
