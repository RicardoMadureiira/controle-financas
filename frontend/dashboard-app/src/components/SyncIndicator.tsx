import { Cloud, CloudOff, Loader2, RefreshCw } from "lucide-react";

export function SyncIndicator({ pending, isSyncing, lastSyncedAt, onRetry }: { pending: number; isSyncing: boolean; lastSyncedAt: string | null; onRetry: () => void }) {
  const offline = !navigator.onLine;
  return <div className="flex flex-wrap items-center justify-center gap-3 bg-zinc-900/70 border border-zinc-800 rounded-2xl px-4 py-3 mb-7 text-xs text-zinc-400" role="status" aria-live="polite">
    {isSyncing ? <Loader2 className="animate-spin text-cyan-400" size={16} /> : offline ? <CloudOff className="text-amber-400" size={16} /> : <Cloud className="text-emerald-400" size={16} />}
    <span>{offline ? `Offline · ${pending} alteração(ões) aguardando` : isSyncing ? "Sincronizando..." : pending ? `${pending} alteração(ões) pendente(s)` : "Dados sincronizados"}</span>
    {lastSyncedAt && !pending && <span className="text-zinc-600">Última sincronização {new Date(lastSyncedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>}
    {(pending > 0 || offline) && <button type="button" disabled={offline || isSyncing} onClick={onRetry} className="flex items-center gap-1 text-white disabled:text-zinc-600"><RefreshCw size={13} /> Tentar novamente</button>}
  </div>;
}
