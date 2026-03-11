import { Trash2, X } from "lucide-react";

interface ModalDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export function ModalDelete({
  isOpen,
  onClose,
  onConfirm,
  title,
}: ModalDeleteProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay Escuro com Blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Conteúdo do Modal */}
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="bg-emerald-500/10 p-4 rounded-2xl mb-6">
            <Trash2 className="text-emerald-500 w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2">
            Excluir Transação
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            Tem certeza que deseja excluir{" "}
            <span className="text-white font-medium">"{title}"</span>? Esta ação
            não pode ser desfeita.
          </p>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all active:scale-95"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
