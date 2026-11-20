"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP, L } from "@/lib/config";
import { useStore } from "@/lib/store";

const rolColor = { comprador: "bg-emerald-100 text-emerald-800", vendedor: "bg-sky-100 text-sky-800", admin: "bg-violet-100 text-violet-800" };
const rolLabel = { comprador: L.comprador, vendedor: L.vendedor, admin: L.admin };

export default function Nav() {
  const { yo, setYo, usuarios } = useStore();
  const path = usePathname();
  const links =
    yo.rol === "vendedor" ? [["/", "Inicio"], ["/vendedor", `${L.pedidos} ${L.recibidos}`], ["/vendedor/productos", L.productos], ["/vendedor/tienda", `Mi ${L.tienda.toLowerCase()}`]]
    : yo.rol === "admin" ? [["/", "Inicio"], ["/tiendas", L.tiendas], ["/admin", "Moderacion"]]
    : [["/", "Inicio"], ["/tiendas", L.tiendas], ["/mis-pedidos", L.misPedidos]];
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">{APP.nombre}<span className="text-brand">{APP.acento}</span></Link>
        <nav className="flex gap-1 text-sm">
          {links.map(([h, t]) => (
            <Link key={h} href={h} className={`rounded-md px-3 py-1.5 ${path === h ? "bg-neutral-100 font-medium" : "text-neutral-600 hover:text-neutral-900"}`}>{t}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${rolColor[yo.rol]}`}>{rolLabel[yo.rol]}</span>
          <select aria-label="Usuario de prueba" className="input w-56 py-1.5" value={yo.id} onChange={(e) => setYo(e.target.value)}>
            {usuarios.map((u) => <option key={u.id} value={u.id}>{u.nombre} ({rolLabel[u.rol].toLowerCase()})</option>)}
          </select>
        </div>
      </div>
    </header>
  );
}
