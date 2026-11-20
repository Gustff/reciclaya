"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP, L } from "@/lib/config";
import { useStore } from "@/lib/store";

export const rolColor = { comprador: "bg-emerald-100 text-emerald-800", vendedor: "bg-sky-100 text-sky-800", recolector: "bg-amber-100 text-amber-800", admin: "bg-violet-100 text-violet-800" };
export const rolLabel = { comprador: L.comprador, vendedor: L.vendedor, recolector: L.recolector, admin: L.admin };

export default function Nav() {
  const { yo, setYo, usuarios } = useStore();
  const path = usePathname();
  const links =
    yo.rol === "vendedor" ? [["/", "Inicio"], ["/acopio", `${L.pedidos} ${L.recibidos}`], ["/acopio/materiales", L.productos], ["/acopio/punto", "Mi punto"]]
    : yo.rol === "recolector" ? [["/", "Inicio"], ["/recolector", "Recojos"], ["/puntos", L.tiendas]]
    : yo.rol === "admin" ? [["/", "Inicio"], ["/puntos", L.tiendas], ["/admin", "Moderacion"]]
    : [["/", "Inicio"], ["/puntos", L.tiendas], ["/mis-solicitudes", L.misPedidos]];
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-6">
        <Link href="/" className="text-xl font-black tracking-tight">{APP.nombre}<span className="text-brand">{APP.acento}</span></Link>
        <nav className="flex gap-1 text-sm font-semibold">
          {links.map(([h, t]) => (
            <Link key={h} href={h} className={`relative px-3 py-2 transition ${path === h ? "text-black after:absolute after:inset-x-3 after:-bottom-[13px] after:h-[2px] after:bg-black" : "text-neutral-500 hover:text-black"}`}>{t}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${rolColor[yo.rol]}`}>{rolLabel[yo.rol]}</span>
          <select aria-label="Usuario de prueba" className="w-60 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium outline-none focus:border-black" value={yo.id} onChange={(e) => setYo(e.target.value)}>
            {usuarios.map((u) => <option key={u.id} value={u.id}>{u.nombre} ({rolLabel[u.rol].toLowerCase()})</option>)}
          </select>
        </div>
      </div>
    </header>
  );
}
