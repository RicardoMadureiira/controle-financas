import type { Transaction } from "../types";

const STORAGE_KEY = "finance.transactions.v2";

export function loadTransactions(): Transaction[] {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) as Transaction[] : [];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}
