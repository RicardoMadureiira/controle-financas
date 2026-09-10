import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Trash2 } from "lucide-react";
import type { AuthUser } from "../auth/AuthContext";

export function ProfileHeader({ user, onLogout, onDelete }: { user: AuthUser; onLogout: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (!menuRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close);
  }, []);
  const initials = user.name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return <header className="max-w-5xl mx-auto px-4 pt-5 flex justify-end" ref={menuRef}><div className="relative"><button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-full py-2 pl-2 pr-4 text-left">
    {user.avatarUrl ? <img src={user.avatarUrl} referrerPolicy="no-referrer" alt="" className="w-9 h-9 rounded-full" /> : <span className="w-9 h-9 rounded-full bg-emerald-500 text-black font-black grid place-items-center">{initials}</span>}
    <span className="hidden sm:block"><strong className="block text-white text-sm max-w-40 truncate">{user.name}</strong><span className="block text-zinc-500 text-xs max-w-40 truncate">{user.email}</span></span><ChevronDown size={16} className="text-zinc-500" />
  </button>{open && <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl z-40"><button onClick={onLogout} className="w-full flex items-center gap-3 text-zinc-300 hover:bg-zinc-800 rounded-xl p-3 text-sm"><LogOut size={17} /> Sair</button><button onClick={onDelete} className="w-full flex items-center gap-3 text-rose-400 hover:bg-rose-500/10 rounded-xl p-3 text-sm"><Trash2 size={17} /> Excluir conta</button></div>}</div></header>;
}
