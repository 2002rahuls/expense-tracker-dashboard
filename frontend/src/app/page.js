"use client";

import { useEffect, useState } from "react";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../services/api";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import DeleteModal from "../components/DeleteModal";
import KpiCard from "../components/KpiCard";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null); // expense object pending delete

  // ── Load expenses ──────────────────────────────────────────────────────────
  const fetchExpenses = async () => {
    try {
      const res = await getExpenses();
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ── CRUD handlers ──────────────────────────────────────────────────────────
  const handleCreate = async (data) => {
    await createExpense(data);
    fetchExpenses();
  };

  const handleUpdate = async (data) => {
    await updateExpense(editing.id, data);
    setEditing(null);
    fetchExpenses();
  };

  const handleRequestDelete = (expense) => setDeleteTarget(expense);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteExpense(deleteTarget.id);
    setDeleteTarget(null);
    fetchExpenses();
  };

  const handleCancelDelete = () => setDeleteTarget(null);

  // ── KPI summary values ─────────────────────────────────────────────────────
  const totalCount = expenses.length;
  const totalSpend = expenses.reduce(
    (s, e) => s + parseFloat(e.amount || 0),
    0,
  );
  const fmt = (v) => `₹${Number(v).toLocaleString("en-IN")}`;

  // this month total
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthTotal = expenses
    .filter((e) => e.date?.startsWith(thisMonth))
    .reduce((s, e) => s + parseFloat(e.amount || 0), 0);

  const topCategoryEntry = (() => {
    if (!expenses.length) return null;

    const m = {};

    expenses.forEach((e, i) => {
      console.log("Item", i, e.category);
      m[e.category] = (m[e.category] || 0) + 1;
      console.log("Map now:", m);
    });

    const sorted = Object.entries(m).sort((a, b) => b[1] - a[1]);
    console.log("Sorted:", sorted);

    return sorted[0];
  })();

  return (
    <div className="page-container">
      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="text-h1">Expenses</h1>
          <p className="text-sm text-muted" style={{ marginTop: 4 }}>
            Manage and track your personal expenses
          </p>
        </div>
      </div>

      {/* ── Mini KPI strip ───────────────────────────────────────────────────── */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <KpiCard
          label="Total Records"
          value={loading ? "" : `${totalCount}`}
          icon="📋"
          iconBg="rgba(99,102,241,0.10)"
          loading={loading}
        />
        <KpiCard
          label="Total Spent"
          value={loading ? "" : fmt(totalSpend)}
          icon="💰"
          iconBg="rgba(16,185,129,0.10)"
          loading={loading}
        />
        <KpiCard
          label="This Month"
          value={loading ? "" : fmt(monthTotal)}
          icon="📅"
          iconBg="rgba(6,182,212,0.10)"
          loading={loading}
        />
        <KpiCard
          label="Highest Count Category"
          value={loading ? "" : topCategoryEntry ? topCategoryEntry[0] : "—"}
          icon="🏷️"
          iconBg="rgba(245,158,11,0.10)"
          loading={loading}
        />
      </div>

      {/* ── Two-column layout: form + table ─────────────────────────────────── */}
      <div className="expenses-layout">
        <div>
          <ExpenseForm
            onSubmit={editing ? handleUpdate : handleCreate}
            initialData={editing}
            onCancel={() => setEditing(null)}
          />
        </div>

        <div>
          <ExpenseList
            expenses={expenses}
            onEdit={(expense) => {
              setEditing(expense);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onRequestDelete={handleRequestDelete}
          />
        </div>
      </div>

      {/* ── Delete confirmation modal ────────────────────────────────────────── */}
      {deleteTarget && (
        <DeleteModal
          itemDescription={`${deleteTarget.category} – ${fmt(deleteTarget.amount)}`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}
