"use client";

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="empty">
        <p className="muted">No expenses added yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ overflowX: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td style={{ fontWeight: 600 }}>{expense.category}</td>
                <td>₹{Number(expense.amount).toLocaleString("en-IN")}</td>
                <td style={{ textAlign: "right" }}>
                  <button
                    onClick={() => onEdit(expense)}
                    className="btn btn-ghost"
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(expense.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
