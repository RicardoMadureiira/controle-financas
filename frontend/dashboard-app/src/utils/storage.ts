import type { Transaction } from "../types";

const LEGACY_STORAGE_KEY = "finance.transactions.v2";
const storageKey = (userId: string) => `finance.transactions.v3.${userId}`;

export function loadTransactions(userId: string): Transaction[] {
  try {
    const value = localStorage.getItem(storageKey(userId));
    return value ? JSON.parse(value) as Transaction[] : [];
  } catch {
    return [];
  }
}

export function saveTransactions(userId: string, transactions: Transaction[]) {
  localStorage.setItem(storageKey(userId), JSON.stringify(transactions));
}

export function migrateAnonymousCache(userId: string) {
  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!legacy) return;
  try {
    const current = loadTransactions(userId);
    const anonymous = JSON.parse(legacy) as Transaction[];
    const merged = new Map(current.map((item) => [item.clientId, item]));
    anonymous.forEach((item) => merged.set(item.clientId, item));
    saveTransactions(userId, [...merged.values()]);
  } catch {
    // Um cache legado inválido não deve impedir o login.
  }
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}

export function clearUserCache(userId: string) {
  localStorage.removeItem(storageKey(userId));
}
