export const formatCurrency = (value: number) => value.toLocaleString("pt-BR", {
  style: "currency", currency: "BRL",
});

export function formatRelativeDate(value: string) {
  const date = new Date(value);
  const today = new Date();
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.round((startToday.getTime() - startDate.getTime()) / 86_400_000);
  if (days === 0) return "Hoje";
  if (days === 1) return "Ontem";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined });
}
