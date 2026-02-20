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
    <div>
      <h1>Expense Tracker</h1>

      <ExpenseForm
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing}
      />

      <ExpenseList
        expenses={expenses}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
    </div>
  );
}
