import { ArrowBigDown, ArrowBigUp, DollarSign } from "lucide-react";
import { formatCurrency } from "../utils/format";

export function DashboardSummary({ income, expense }: { income: number; expense: number }) {
  const balance = income - expense;
  const cards = [
    { label: "Entradas", value: income, color: "emerald", icon: ArrowBigUp },
    { label: "Saídas", value: expense, color: "rose", icon: ArrowBigDown },
  ];
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
    <section className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
      <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-20 ${balance < 0 ? "bg-rose-500" : "bg-emerald-500"}`} />
      <div className="relative flex items-center justify-between mb-5"><div><span className="text-zinc-500 text-xs font-bold uppercase tracking-[.3em]">Balanço geral</span><h2 className="text-2xl text-white font-black mt-1">Saldo total</h2></div><DollarSign className={balance < 0 ? "text-rose-500" : "text-emerald-500"} size={36} /></div>
      <p className={`relative text-4xl md:text-6xl font-black tracking-tighter ${balance < 0 ? "text-rose-500" : "text-emerald-400"}`}>{formatCurrency(balance)}</p>
    </section>
    {cards.map(({ label, value, color, icon: Icon }) => <section key={label} className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-7">
      <div className="flex items-center justify-between"><span className="text-zinc-500 text-xs font-bold uppercase tracking-[.2em]">{label}</span><Icon className={color === "emerald" ? "text-emerald-500" : "text-rose-500"} /></div>
      <p className="text-3xl text-white font-black mt-4 tracking-tight">{formatCurrency(value)}</p>
    </section>)}
  </div>;
}
