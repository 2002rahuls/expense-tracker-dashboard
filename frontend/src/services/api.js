import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

export const getExpenses = () => API.get("expenses/");
export const createExpense = (data) => API.post("expenses/", data);
export const updateExpense = (id, data) => API.put(`expenses/${id}/`, data);
export const deleteExpense = (id) => API.delete(`expenses/${id}/`);
