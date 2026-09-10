import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../services/api";
import type { Transaction, TransactionDraft } from "../types";
import { loadTransactions, saveTransactions } from "../utils/storage";
import { buildSyncOperations, mergeAfterSync } from "../utils/sync";

interface ServerTransaction {
  id: string;
  clientId: string;
  details: string;
  value: number;
  type: "entrada" | "saida";
  category?: string;
  created_at?: string;
  updated_at?: string;
}

export function useTransactions(userId: string) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions(userId));
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const transactionsRef = useRef(transactions);
  const syncingRef = useRef(false);

  const commit = useCallback((next: Transaction[]) => {
    transactionsRef.current = next;
    saveTransactions(userId, next);
    setTransactions(next);
  }, [userId]);

  const sync = useCallback(async () => {
    if (!navigator.onLine || syncingRef.current) return false;
    syncingRef.current = true;
    setIsSyncing(true);
    const current = transactionsRef.current;
    const pending = current.filter((item) => item.pendingOperation);
    commit(current.map((item) => item.pendingOperation ? { ...item, syncStatus: "syncing" } : item));

    try {
      const operations = buildSyncOperations(pending);
      const response = await api.post<{ transactions: ServerTransaction[] }>("/transactions/sync", {
        operations,
      });
      const canonical = response.data.transactions.map((item): Transaction => ({
        id: item.id,
        clientId: item.clientId,
        details: item.details,
        value: item.value,
        type: item.type,
        category: item.category || "Outros",
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.updated_at || item.created_at || new Date().toISOString(),
        syncStatus: "synced",
        pendingOperation: null,
      }));
      commit(mergeAfterSync(pending, transactionsRef.current, canonical));
      setLastSyncedAt(new Date().toISOString());
      return true;
    } catch {
      commit(transactionsRef.current.map((item) => item.pendingOperation ? { ...item, syncStatus: "error" } : item));
      return false;
    } finally {
      syncingRef.current = false;
      setIsSyncing(false);
      if (navigator.onLine && transactionsRef.current.some((item) => item.syncStatus === "pending")) {
        setTimeout(() => void sync(), 0);
      }
    }
  }, [commit]);

  useEffect(() => {
    void sync();
  }, [sync]);

  useEffect(() => {
    const online = () => void sync();
    window.addEventListener("online", online);
    return () => window.removeEventListener("online", online);
  }, [sync]);

  const add = useCallback((draft: TransactionDraft) => {
    const now = new Date().toISOString();
    const next = [{ ...draft, clientId: crypto.randomUUID(), createdAt: now, updatedAt: now,
      syncStatus: "pending" as const, pendingOperation: "upsert" as const }, ...transactionsRef.current];
    commit(next);
    setTimeout(() => void sync(), 0);
  }, [commit, sync]);

  const update = useCallback((clientId: string, draft: TransactionDraft) => {
    const next = transactionsRef.current.map((item) => item.clientId === clientId
      ? { ...item, ...draft, updatedAt: new Date().toISOString(), syncStatus: "pending" as const, pendingOperation: "upsert" as const }
      : item);
    commit(next);
    setTimeout(() => void sync(), 0);
  }, [commit, sync]);

  const remove = useCallback((clientId: string) => {
    const item = transactionsRef.current.find((transaction) => transaction.clientId === clientId);
    const next = item?.pendingOperation === "upsert" && !item.id
      ? transactionsRef.current.filter((transaction) => transaction.clientId !== clientId)
      : transactionsRef.current.map((transaction) => transaction.clientId === clientId
          ? { ...transaction, deleted: true, updatedAt: new Date().toISOString(), syncStatus: "pending" as const, pendingOperation: "delete" as const }
          : transaction);
    commit(next);
    setTimeout(() => void sync(), 0);
  }, [commit, sync]);

  return { transactions, add, update, remove, sync, isSyncing, lastSyncedAt };
}
