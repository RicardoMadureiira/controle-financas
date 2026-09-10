import { GoogleLogin } from "@react-oauth/google";
import { BarChart3, Cloud, ShieldCheck, WalletCards } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";

export function LandingPage() {
  const { login } = useAuth();
  const configured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
  return <main className="min-h-[calc(100vh-160px)] flex items-center px-4 py-14">
    <div className="max-w-5xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
      <section><div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest"><WalletCards size={16} /> Controle financeiro pessoal</div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mt-7 leading-tight">Organize suas <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Finanças</span></h1>
        <p className="text-zinc-400 text-lg mt-6 max-w-xl leading-relaxed">Registre entradas e saídas, acompanhe seu saldo e acesse suas movimentações com segurança no computador ou celular.</p>
        <div className="mt-8 min-h-11">{configured ? <GoogleLogin
          text="continue_with" shape="pill" size="large" theme="filled_black"
          onSuccess={async ({ credential }) => { try { if (!credential) throw new Error(); const migrated = await login(credential); toast.success(migrated ? `${migrated} movimentação(ões) vinculada(s) à sua conta.` : "Login realizado com sucesso."); } catch { toast.error("Não foi possível entrar com Google. Tente novamente."); } }}
          onError={() => toast.error("O login com Google foi cancelado ou falhou.")}
        /> : <p className="text-amber-400 text-sm">Login indisponível: configure VITE_GOOGLE_CLIENT_ID.</p>}</div>
        <p className="text-zinc-600 text-xs mt-4">Ao entrar, seus dados ficam vinculados à sua conta Google. Sua senha nunca é compartilhada conosco.</p>
      </section>
      <section className="grid gap-4">
        {[{ icon: Cloud, title: "Em todos os dispositivos", text: "Veja os mesmos dados no celular, computador ou tablet." }, { icon: ShieldCheck, title: "Acesso protegido", text: "Cada conta acessa somente as próprias movimentações." }, { icon: BarChart3, title: "Visão clara", text: "Filtros, categorias e resumos para acompanhar sua rotina." }].map(({ icon: Icon, title, text }) => <article key={title} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 flex gap-4"><div className="bg-emerald-500/10 text-emerald-400 rounded-xl p-3 h-fit"><Icon /></div><div><h2 className="text-white font-bold">{title}</h2><p className="text-zinc-500 mt-1 text-sm">{text}</p></div></article>)}
      </section>
    </div>
  </main>;
}
