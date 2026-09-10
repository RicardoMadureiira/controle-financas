import { FormEvent, useEffect, useState } from "react";
import { DEFAULT_CATEGORIES } from "../constants";
import type { Transaction, TransactionDraft, TransactionType } from "../types";

const emptyDraft: TransactionDraft = { details: "", value: 0, type: "saida", category: "Outros" };

export function TransactionForm({ editing, onSave, onCancel }: { editing: Transaction | null; onSave: (draft: TransactionDraft) => void; onCancel: () => void }) {
  const [draft, setDraft] = useState<TransactionDraft>(emptyDraft);
  const [customCategory, setCustomCategory] = useState("");
  const isCustom = !DEFAULT_CATEGORIES.includes(draft.category);
  useEffect(() => { setDraft(editing ? { details: editing.details, value: editing.value, type: editing.type, category: editing.category } : emptyDraft); setCustomCategory(editing && !DEFAULT_CATEGORIES.includes(editing.category) ? editing.category : ""); }, [editing]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const category = isCustom ? customCategory.trim() : draft.category;
    if (!draft.details.trim() || draft.value <= 0 || !category) return;
    onSave({ ...draft, details: draft.details.trim(), category });
    setDraft(emptyDraft); setCustomCategory("");
  }

  const field = "bg-black/40 border border-zinc-800 px-4 py-3 rounded-xl outline-none focus:border-emerald-500 text-white";
  return <form onSubmit={submit} className="bg-zinc-900/60 border border-zinc-800 rounded-[2rem] p-6 md:p-8 mb-8">
    <div className="flex justify-between items-center mb-5"><h2 className="text-white font-bold">{editing ? "Editar movimentação" : "Nova movimentação"}</h2>{editing && <button type="button" onClick={onCancel} className="text-sm text-zinc-400 hover:text-white">Cancelar edição</button>}</div>
    <div className="grid md:grid-cols-2 gap-4">
      <input className={field} maxLength={60} required placeholder="Descrição" value={draft.details} onChange={(e) => setDraft({ ...draft, details: e.target.value })} />
      <input className={field} required min="0.01" step="0.01" type="number" placeholder="Valor" value={draft.value || ""} onChange={(e) => setDraft({ ...draft, value: Number(e.target.value) })} />
      <select className={field} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>{DEFAULT_CATEGORIES.map((category) => <option key={category}>{category}</option>)}<option value="personalizada">Nova categoria...</option></select>
      {isCustom && <input className={field} maxLength={30} required placeholder="Nome da categoria" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} />}
      <div className="flex gap-3">{(["entrada", "saida"] as TransactionType[]).map((type) => <button key={type} type="button" onClick={() => setDraft({ ...draft, type })} className={`flex-1 rounded-xl py-3 font-bold ${draft.type === type ? type === "entrada" ? "bg-emerald-500 text-black" : "bg-rose-500 text-white" : "bg-zinc-800 text-zinc-400"}`}>{type === "entrada" ? "Entrada" : "Saída"}</button>)}</div>
      <button className="rounded-xl py-3 bg-white hover:bg-emerald-400 text-black uppercase tracking-wider font-black">{editing ? "Salvar alterações" : "Confirmar lançamento"}</button>
    </div>
  </form>;
}
