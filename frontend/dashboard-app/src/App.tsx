import { Loader2 } from "lucide-react";
import { Flip, ToastContainer } from "react-toastify";
import { useAuth } from "./auth/AuthContext";
import { Dashboard } from "./components/Dashboard";
import { LandingPage } from "./components/LandingPage";

export function App() {
  const { user, status, logout, deleteAccount } = useAuth();
  return <>{status === "loading" ? <main className="min-h-[70vh] grid place-items-center text-zinc-400"><div className="flex items-center gap-3"><Loader2 className="animate-spin text-emerald-400" /> Verificando sua sessão...</div></main> : user ? <Dashboard user={user} onLogout={logout} onDeleteAccount={deleteAccount} /> : <LandingPage />}<ToastContainer position="bottom-right" autoClose={1800} theme="dark" transition={Flip} /></>;
}
