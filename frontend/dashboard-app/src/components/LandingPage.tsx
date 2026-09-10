import { GoogleLogin } from "@react-oauth/google";
import { BarChart3, Cloud, WalletCards } from "lucide-react";
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
        <div className="mt-9 max-w-sm">
          <p className="text-white font-bold text-lg mb-3">Comece a organizar suas finanças</p>
          <div className="min-h-11 w-full overflow-hidden rounded-full">{configured ? <GoogleLogin
          text="continue_with" shape="pill" size="large" theme="filled_black" width="384"
          onSuccess={async ({ credential }) => { try { if (!credential) throw new Error(); const migrated = await login(credential); toast.success(migrated ? `${migrated} movimentação(ões) vinculada(s) à sua conta.` : "Login realizado com sucesso."); } catch { toast.error("Não foi possível entrar com Google. Tente novamente."); } }}
          onError={() => toast.error("O login com Google foi cancelado ou falhou.")}
        /> : <p className="text-amber-400 text-sm">Login indisponível: configure VITE_GOOGLE_CLIENT_ID.</p>}</div>
        <p className="text-zinc-600 text-xs mt-4 leading-relaxed">Ao entrar, seus dados ficam vinculados à sua conta Google. Sua senha nunca é compartilhada conosco.</p>
        </div>
      </section>
      <section className="grid gap-4">
        {[{ icon: WalletCards, title: "Controle sem complicação", text: "Registre suas movimentações e acompanhe para onde seu dinheiro está indo." }, { icon: Cloud, title: "Sua rotina em qualquer lugar", text: "Continue de onde parou no celular, computador ou tablet." }, { icon: BarChart3, title: "Decisões mais conscientes", text: "Use filtros, categorias e resumos para entender melhor seus hábitos financeiros." }].map(({ icon: Icon, title, text }) => <article key={title} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 flex gap-4"><div className="bg-emerald-500/10 text-emerald-400 rounded-xl p-3 h-fit"><Icon /></div><div><h2 className="text-white font-bold">{title}</h2><p className="text-zinc-500 mt-1 text-sm">{text}</p></div></article>)}
      </section>
    </div>
  </main>;
}
