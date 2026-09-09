import { ArrowBigDown, ArrowBigUp, CloudOff, Pencil, Trash2 } from "lucide-react";
import type { Transaction } from "../types";
import { formatCurrency, formatRelativeDate } from "../utils/format";

export function TransactionList({ transactions, onEdit, onDelete }: { transactions: Transaction[]; onEdit: (transaction: Transaction) => void; onDelete: (transaction: Transaction) => void }) {
  return <section><h2 className="text-white font-bold text-xl mb-5">Últimas movimentações</h2>
    {transactions.length === 0 ? <div className="border border-dashed border-zinc-800 rounded-2xl p-10 text-center text-zinc-500">Nenhuma movimentação encontrada para estes filtros.</div> : <div className="grid gap-3">{transactions.map((item) => <article key={item.clientId} className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl flex flex-wrap md:flex-nowrap items-center gap-4">
      <div className={`p-3 rounded-xl ${item.type === "entrada" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>{item.type === "entrada" ? <ArrowBigUp size={20} /> : <ArrowBigDown size={20} />}</div>
      <div className="min-w-0 flex-1"><p className="text-white font-semibold truncate">{item.details}</p><p className="text-zinc-500 text-xs">{item.category} · {formatRelativeDate(item.createdAt)}</p></div>
      {item.syncStatus !== "synced" && <span title="Alteração ainda não sincronizada" className={item.syncStatus === "error" ? "text-rose-400" : "text-amber-400"}><CloudOff size={16} /></span>}
      <p className={`font-bold ${item.type === "entrada" ? "text-emerald-400" : "text-rose-400"}`}>{item.type === "entrada" ? "+" : "−"} {formatCurrency(item.value)}</p>
      <div className="flex gap-1"><button aria-label={`Editar ${item.details}`} onClick={() => onEdit(item)} className="p-2 text-zinc-500 hover:text-cyan-400"><Pencil size={17} /></button><button aria-label={`Excluir ${item.details}`} onClick={() => onDelete(item)} className="p-2 text-zinc-500 hover:text-rose-400"><Trash2 size={17} /></button></div>
    </article>)}</div>}
  </section>;
}
