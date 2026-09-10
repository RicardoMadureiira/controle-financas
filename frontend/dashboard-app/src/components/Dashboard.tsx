import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import type { AuthUser } from "../auth/AuthContext";
import { DEFAULT_CATEGORIES } from "../constants";
import { useTransactions } from "../hooks/useTransactions";
import { ModalDelete } from "../ModalDelete";
import type { Filters, Transaction, TransactionDraft } from "../types";
import { DashboardSummary } from "./DashboardSummary";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { EditTransactionModal } from "./EditTransactionModal";
import { FiltersPanel } from "./FiltersPanel";
import { MonthlyChart } from "./MonthlyChart";
import { ProfileHeader } from "./ProfileHeader";
import { SyncIndicator } from "./SyncIndicator";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";

const initialFilters: Filters = { period: "month", type: "all", category: "all", startDate: "", endDate: "" };

export function Dashboard({ user, onLogout, onDeleteAccount }: { user: AuthUser; onLogout: () => Promise<void>; onDeleteAccount: () => Promise<void> }) {
  const { transactions, add, update, remove, sync, isSyncing, lastSyncedAt } = useTransactions(user.id);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
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
  function save(draft: TransactionDraft) { if (editing) { update(editing.clientId, draft); setEditing(null); toast.success("Movimentação atualizada e salva localmente."); } else { add(draft); toast.success("Movimentação salva localmente."); } }

  async function logout() { try { if (pending > 0 && !await sync()) { toast.error("Sincronize as alterações pendentes antes de sair."); return; } await onLogout(); toast.success("Sessão encerrada."); } catch { toast.error("Conecte-se à internet para sair com segurança."); } }
  async function deleteAccount() { try { setDeletingAccount(true); await onDeleteAccount(); toast.success("Conta e dados excluídos."); } catch { toast.error("Não foi possível excluir a conta."); setDeletingAccount(false); } }

  return <><ProfileHeader user={user} onLogout={() => void logout()} onDelete={() => setDeleteAccountOpen(true)} /><main className="text-gray-800 max-w-5xl mx-auto py-8 px-4">
    <header className="text-center mb-12"><h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Organize suas <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Finanças</span></h1><p className="text-zinc-400 mt-4">Seus lançamentos disponíveis em todos os dispositivos.</p></header>
    <SyncIndicator pending={pending} isSyncing={isSyncing} lastSyncedAt={lastSyncedAt} onRetry={() => void sync()} /><DashboardSummary income={totals.income} expense={totals.expense} /><TransactionForm editing={null} onSave={save} /><FiltersPanel filters={filters} categories={categories} onChange={setFilters} /><MonthlyChart transactions={filtered} /><TransactionList transactions={filtered} onEdit={setEditing} onDelete={setDeleting} />
    <EditTransactionModal transaction={editing} onSave={save} onClose={() => setEditing(null)} /><ModalDelete isOpen={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={() => { if (deleting) { remove(deleting.clientId); toast.success("Exclusão salva localmente."); } setDeleting(null); }} title={deleting?.details ?? ""} /><DeleteAccountModal open={deleteAccountOpen} busy={deletingAccount} onClose={() => setDeleteAccountOpen(false)} onConfirm={() => void deleteAccount()} />
  </main></>;
}
