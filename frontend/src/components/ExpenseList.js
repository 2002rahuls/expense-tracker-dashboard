"use client";

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  return (
    <div>
      {expenses.map((expense) => (
        <div key={expense.id}>
          <p>
            {expense.category} - ₹{expense.amount}
          </p>
          <button onClick={() => onEdit(expense)}>Edit</button>
          <button onClick={() => onDelete(expense.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
