"use client";

import EmptyState from "./EmptyState";

// ── SVG icon helpers ──────────────────────────────────────────────────────────
function EditIcon() {
  return (
    <svg className="icon-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="icon-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

// ── Category badge ────────────────────────────────────────────────────────────
const BADGE_CLASS = {
  Food: "badge-food",
  Travel: "badge-travel",
  Bills: "badge-bills",
  Shopping: "badge-shopping",
  Other: "badge-other",
};

const CATEGORY_ICON = {
  Food: "🍔", Travel: "✈️", Bills: "💡", Shopping: "🛍️", Other: "📌",
};

function CategoryBadge({ category }) {
  return (
    <span className={`badge ${BADGE_CLASS[category] || "badge-other"}`}>
      {CATEGORY_ICON[category] || "📌"} {category}
    </span>
  );
}

export default function ExpenseList({ expenses, onEdit, onRequestDelete }) {
  const fmt = (v) => `₹${Number(v).toLocaleString("en-IN")}`;

  if (!expenses || expenses.length === 0) {
    return (
      <div className="card">
        <EmptyState
          title="No expenses recorded"
          description="Once you add expenses, they'll appear here in a table."
        />
      </div>
    );
  }

  return (
    <div className="card">
      {/* Desktop table */}
      <div className="table-container desktop-expense-table">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Notes</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="text-sm text-muted">
                  {expense.date
                    ? new Date(expense.date + "T00:00:00").toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })
                    : "—"}
                </td>
                <td>
                  <CategoryBadge category={expense.category} />
                </td>
                <td style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                  {fmt(expense.amount)}
                </td>
                <td className="text-sm text-muted" style={{ maxWidth: 200 }}>
                  <span className="truncate" style={{ display: "block", maxWidth: 200 }}>
                    {expense.notes || <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>—</span>}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn btn-icon"
                      onClick={() => onEdit(expense)}
                      title="Edit"
                      aria-label="Edit expense"
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="btn btn-icon btn-icon-danger"
                      onClick={() => onRequestDelete(expense)}
                      title="Delete"
                      aria-label="Delete expense"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="mobile-expense-cards">
        {expenses.map((expense) => (
          <div key={expense.id} className="card expense-mobile-card" style={{ border: "1px solid var(--border)", boxShadow: "none" }}>
            <div className="expense-mobile-card-row">
              <CategoryBadge category={expense.category} />
              <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>
                {fmt(expense.amount)}
              </span>
            </div>
            <div className="expense-mobile-card-row">
              <span className="text-sm text-muted">
                {expense.date
                  ? new Date(expense.date + "T00:00:00").toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric",
                    })
                  : "—"}
              </span>
              <div className="flex gap-8">
                <button
                  className="btn btn-icon"
                  onClick={() => onEdit(expense)}
                  aria-label="Edit expense"
                >
                  <EditIcon />
                </button>
                <button
                  className="btn btn-icon btn-icon-danger"
                  onClick={() => onRequestDelete(expense)}
                  aria-label="Delete expense"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
            {expense.notes && (
              <span className="text-sm text-muted" style={{ display: "block" }}>
                {expense.notes}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
