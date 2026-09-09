import { useEffect } from "react";
import { X } from "lucide-react";
import type { Transaction, TransactionDraft } from "../types";
import { TransactionForm } from "./TransactionForm";

interface EditTransactionModalProps {
  transaction: Transaction | null;
  onSave: (draft: TransactionDraft) => void;
  onClose: () => void;
}

export function EditTransactionModal({ transaction, onSave, onClose }: EditTransactionModalProps) {
  useEffect(() => {
    if (!transaction) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [transaction, onClose]);

  if (!transaction) return null;

  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <button type="button" aria-label="Fechar edição" className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
    <div role="dialog" aria-modal="true" aria-labelledby="edit-transaction-title" className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl">
      <h2 id="edit-transaction-title" className="sr-only">Editar movimentação</h2>
      <button type="button" aria-label="Fechar" onClick={onClose} className="absolute right-6 top-6 z-20 text-zinc-500 hover:text-white"><X size={20} /></button>
      <TransactionForm editing={transaction} onSave={onSave} onCancel={onClose} />
    </div>
  </div>;
}
