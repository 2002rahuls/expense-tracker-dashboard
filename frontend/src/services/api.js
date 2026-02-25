import axios from "axios";

const API = axios.create({
  baseURL: "https://expense-backend-997106108659.asia-south1.run.app/api/",
});

export const getExpenses = () => API.get("expenses/");
export const createExpense = (data) => API.post("expenses/", data);
export const updateExpense = (id, data) => API.put(`expenses/${id}/`, data);
export const deleteExpense = (id) => API.delete(`expenses/${id}/`);
export const getCurrencyRate = () => API.get("currency-rate/");
export const getTopHeadlines = () => API.get("news/");
