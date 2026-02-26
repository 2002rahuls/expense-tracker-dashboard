"use client";

import { useState, useEffect } from "react";

const CATEGORIES = ["Food", "Travel", "Bills", "Shopping", "Other"];

export default function ExpenseForm({ onSubmit, initialData = {}, onCancel }) {
  const data = initialData || {};
  const isEditing = !!data.id;

  const [form, setForm] = useState({
    amount:   data.amount   || "",
    category: data.category || "Food",
    date:     data.date     || "",
    notes:    data.notes    || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  useEffect(() => {
    setForm({
      amount:   data.amount   || "",
      category: data.category || "Food",
      date:     data.date     || "",
      notes:    data.notes    || "",
    });
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const e = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = "Enter a valid amount greater than 0";
    if (!form.date)
      e.date = "Please select a date";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await onSubmit(form);
      if (!isEditing) {
        setForm({ amount: "", category: "Food", date: "", notes: "" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-pad">
      {/* Header */}
      <div className="flex items-center justify-between mb-16">
        <div>
          <h2 className="text-h3">{isEditing ? "Edit Expense" : "Add Expense"}</h2>
          <p className="text-sm text-muted" style={{ marginTop: 2 }}>
            {isEditing ? "Update the details below" : "Fill in the form to record an expense"}
          </p>
        </div>
        {isEditing && (
          <span style={{
            padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600,
            background: "var(--primary-muted)", color: "var(--primary)"
          }}>
            Editing
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Amount */}
        <div className="form-field">
          <label className="form-label" htmlFor="amount">Amount (₹)</label>
          <input
            id="amount"
            type="number"
            name="amount"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
            className={`input${errors.amount ? " error" : ""}`}
            required
            min="0"
            step="0.01"
          />
          {errors.amount && <span className="form-error">{errors.amount}</span>}
        </div>

        {/* Category + Date */}
        <div className="form-grid-2">
          <div className="form-field">
            <label className="form-label" htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="select"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={`input${errors.date ? " error" : ""}`}
              required
            />
            {errors.date && <span className="form-error">{errors.date}</span>}
          </div>
        </div>

        {/* Notes */}
        <div className="form-field">
          <label className="form-label" htmlFor="notes">Notes <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span></label>
          <textarea
            id="notes"
            name="notes"
            placeholder="What was this expense for?"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="textarea"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-8" style={{ marginTop: 8 }}>
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={loading}
          >
            {loading ? "Saving…" : isEditing ? "Update Expense" : "Save Expense"}
          </button>

          {isEditing && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onCancel}
              disabled={loading}
              style={{ minWidth: 100 }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
