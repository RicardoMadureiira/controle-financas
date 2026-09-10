import { useMemo, useState } from "react";
import { Flip, ToastContainer, toast } from "react-toastify";
import { DashboardSummary } from "./components/DashboardSummary";
import { EditTransactionModal } from "./components/EditTransactionModal";
import { FiltersPanel } from "./components/FiltersPanel";
import { MonthlyChart } from "./components/MonthlyChart";
import { SyncIndicator } from "./components/SyncIndicator";
import { TransactionForm } from "./components/TransactionForm";
import { TransactionList } from "./components/TransactionList";
import { DEFAULT_CATEGORIES } from "./constants";
import { useTransactions } from "./hooks/useTransactions";
import { ModalDelete } from "./ModalDelete";
import type { Filters, Transaction, TransactionDraft } from "./types";

const initialFilters: Filters = { period: "month", type: "all", category: "all", startDate: "", endDate: "" };

export function App() {
  const { transactions, add, update, remove, sync, isSyncing, lastSyncedAt } = useTransactions();
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState(initialFilters);
  const visible = transactions.filter((item) => !item.deleted);
  const filtered = useMemo(() => {
    const now = new Date();
    return visible.filter((item) => {
      const date = new Date(item.createdAt);
      let periodMatches = true;
      if (filters.period === "month") periodMatches = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      if (filters.period === "30days") periodMatches = date >= new Date(now.getTime() - 30 * 86_400_000);
      if (filters.period === "custom") {
        const start = filters.startDate ? new Date(`${filters.startDate}T00:00:00`) : null;
        const end = filters.endDate ? new Date(`${filters.endDate}T23:59:59`) : null;
        periodMatches = (!start || date >= start) && (!end || date <= end);
      }
      return periodMatches && (filters.type === "all" || item.type === filters.type) && (filters.category === "all" || item.category === filters.category);
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [visible, filters]);
  const totals = filtered.reduce((result, item) => { if (item.type === "entrada") result.income += item.value; else result.expense += item.value; return result; }, { income: 0, expense: 0 });
  const categories = [...new Set([...DEFAULT_CATEGORIES, ...visible.map((item) => item.category)])].sort();
  const pending = transactions.filter((item) => item.pendingOperation).length;

  function save(draft: TransactionDraft) {
    if (editing) { update(editing.clientId, draft); setEditing(null); toast.success("Movimentação atualizada e salva localmente."); }
    else { add(draft); toast.success("Movimentação salva localmente."); }
  }

  return <main className="text-gray-800 max-w-5xl mx-auto py-10 px-4">
    <header className="text-center mb-12"><h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Organize suas <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Finanças</span></h1><p className="text-zinc-400 mt-4">Seus lançamentos disponíveis mesmo sem internet.</p></header>
    <SyncIndicator pending={pending} isSyncing={isSyncing} lastSyncedAt={lastSyncedAt} onRetry={() => void sync()} />
    <DashboardSummary income={totals.income} expense={totals.expense} />
    <TransactionForm editing={null} onSave={save} />
    <FiltersPanel filters={filters} categories={categories} onChange={setFilters} />
    <MonthlyChart transactions={filtered} />
    <TransactionList transactions={filtered} onEdit={setEditing} onDelete={setDeleting} />
    <EditTransactionModal transaction={editing} onSave={save} onClose={() => setEditing(null)} />
    <ModalDelete isOpen={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={() => { if (deleting) { remove(deleting.clientId); toast.success("Exclusão salva localmente."); } setDeleting(null); }} title={deleting?.details ?? ""} />
    <ToastContainer position="bottom-right" autoClose={1800} theme="dark" transition={Flip} />
  </main>;
}
