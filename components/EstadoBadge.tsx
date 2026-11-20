import type { Estado } from "@/lib/mock";
const c: Record<Estado, string> = {
  pendiente: "bg-amber-100 text-amber-800", aceptado: "bg-sky-100 text-sky-800",
  rechazado: "bg-red-100 text-red-800", entregado: "bg-emerald-100 text-emerald-800",
};
export default function EstadoBadge({ e }: { e: Estado }) {
  return <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${c[e]}`}>{e}</span>;
}
