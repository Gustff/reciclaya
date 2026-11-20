"use client";
import Link from "next/link";
import { useState } from "react";
import { L } from "@/lib/config";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

export default function Tiendas() {
  const { tiendas, productos, yo } = useStore();
  const [q, setQ] = useState("");
  const [rubro, setRubro] = useState("");
  const activas = tiendas.filter((t) => !t.suspendida);
  const rubros = [...new Set(activas.map((t) => t.rubro))];
  const s = q.toLowerCase();
  const ts = activas.filter((t) => (!rubro || t.rubro === rubro) && (!s || t.nombre.toLowerCase().includes(s)));
  const ps = q ? productos.filter((p) => p.nombre.toLowerCase().includes(s) && activas.some((t) => t.id === p.tiendaId)) : [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Buscar {L.productos.toLowerCase()} y {L.tiendas.toLowerCase()}</h1>
      <div className="mt-5 flex gap-3">
        <input className="input" placeholder={`Buscar por nombre de ${L.producto.toLowerCase()} o ${L.tienda.toLowerCase()}...`} value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input w-48" value={rubro} onChange={(e) => setRubro(e.target.value)}>
          <option value="">Todos los {L.rubros.toLowerCase()}</option>
          {rubros.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>
      {ps.length > 0 && (<>
        <h2 className="mt-8 mb-3 text-lg font-semibold">{L.productos} ({ps.length})</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{ps.map((p) => <ProductCard key={p.id} p={p} tienda={tiendas.find((t) => t.id === p.tiendaId)?.nombre} puedePedir={yo.rol === "comprador"} />)}</div>
      </>)}
      <h2 className="mt-8 mb-3 text-lg font-semibold">{L.tiendas} ({ts.length})</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ts.map((t) => (
          <Link key={t.id} href={`/tiendas/${t.id}`} className="card overflow-hidden transition hover:shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.img} alt={t.nombre} className="aspect-[16/9] w-full object-cover" />
            <div className="p-4">
              <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs text-brand">{t.rubro}</span>
              <h3 className="mt-2 font-semibold">{t.nombre}</h3>
              <p className="text-sm text-neutral-500">{t.direccion}</p>
              <p className="mt-1 text-xs text-neutral-500">{productos.filter((p) => p.tiendaId === t.id).length} {L.productos.toLowerCase()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
