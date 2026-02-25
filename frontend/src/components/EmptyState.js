"use client";

export default function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">📋</div>
      <p className="empty-state-title">{title || "No expenses yet"}</p>
      <p className="empty-state-desc">
        {description || "Add your first expense using the form above to get started."}
      </p>
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}
