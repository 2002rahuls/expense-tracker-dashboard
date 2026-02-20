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

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchExpenses = async () => {
    const res = await getExpenses();
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleCreate = async (data) => {
    await createExpense(data);
    fetchExpenses();
  };

  const handleUpdate = async (data) => {
    await updateExpense(editing.id, data);
    setEditing(null);
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
    fetchExpenses();
  };

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Expense Tracker</h1>
        <div className="muted">Manage your expenses</div>
      </div>

      <div className="row">
        <div className="col" style={{ maxWidth: 520 }}>
          <ExpenseForm
            onSubmit={editing ? handleUpdate : handleCreate}
            initialData={editing}
            onCancel={() => setEditing(null)}
          />
        </div>

        <div className="col">
          <ExpenseList
            expenses={expenses}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
