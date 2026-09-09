import type { Transaction } from "../types";
import { formatCurrency } from "../utils/format";

export function MonthlyChart({ transactions }: { transactions: Transaction[] }) {
  const monthly = new Map<string, { label: string; income: number; expense: number }>();
  transactions.forEach((item) => {
    const date = new Date(item.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const current = monthly.get(key) ?? { label: date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }), income: 0, expense: 0 };
    if (item.type === "entrada") current.income += item.value; else current.expense += item.value;
    monthly.set(key, current);
  });
  const points = [...monthly.values()].slice(-6);
  const max = Math.max(1, ...points.flatMap((item) => [item.income, item.expense]));
  return <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8">
    <h2 className="text-white font-bold mb-2">Entradas e saídas por mês</h2><p className="text-zinc-500 text-xs mb-6">Últimos seis meses com movimentações</p>
    {points.length === 0 ? <p className="text-zinc-500 text-sm py-8 text-center">O gráfico aparecerá quando houver movimentações.</p> : <div className="flex items-end gap-4 h-48 overflow-x-auto" role="img" aria-label="Gráfico mensal de entradas e saídas">
      {points.map((point) => <div key={point.label} className="flex-1 min-w-20 h-full flex flex-col justify-end items-center gap-2"><div className="h-36 flex items-end gap-2"><div title={`Entradas: ${formatCurrency(point.income)}`} className="w-6 bg-emerald-500 rounded-t" style={{ height: `${Math.max(3, point.income / max * 100)}%` }} /><div title={`Saídas: ${formatCurrency(point.expense)}`} className="w-6 bg-rose-500 rounded-t" style={{ height: `${Math.max(3, point.expense / max * 100)}%` }} /></div><span className="text-zinc-500 text-xs capitalize">{point.label}</span></div>)}
    </div>}
    <div className="flex gap-5 justify-center text-xs mt-4"><span className="text-emerald-400">● Entradas</span><span className="text-rose-400">● Saídas</span></div>
  </section>;
}
