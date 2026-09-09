import type { Filters } from "../types";

export function FiltersPanel({ filters, categories, onChange }: { filters: Filters; categories: string[]; onChange: (filters: Filters) => void }) {
  const select = "bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-sm";
  return <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 mb-6">
    <div className="flex flex-wrap gap-3">
      <select aria-label="Período" className={select} value={filters.period} onChange={(e) => onChange({ ...filters, period: e.target.value as Filters["period"] })}><option value="month">Mês atual</option><option value="30days">Últimos 30 dias</option><option value="all">Todo o período</option><option value="custom">Personalizado</option></select>
      <select aria-label="Tipo" className={select} value={filters.type} onChange={(e) => onChange({ ...filters, type: e.target.value as Filters["type"] })}><option value="all">Entradas e saídas</option><option value="entrada">Entradas</option><option value="saida">Saídas</option></select>
      <select aria-label="Categoria" className={select} value={filters.category} onChange={(e) => onChange({ ...filters, category: e.target.value })}><option value="all">Todas as categorias</option>{categories.map((category) => <option key={category}>{category}</option>)}</select>
      {filters.period === "custom" && <><input aria-label="Data inicial" className={select} type="date" value={filters.startDate} onChange={(e) => onChange({ ...filters, startDate: e.target.value })} /><input aria-label="Data final" className={select} type="date" value={filters.endDate} onChange={(e) => onChange({ ...filters, endDate: e.target.value })} /></>}
    </div>
  </section>;
}
