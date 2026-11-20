"use client";
import { useParams } from "next/navigation";
import { L } from "@/lib/config";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

export default function TiendaDetalle() {
  const { id } = useParams<{ id: string }>();
  const { tiendas, productos, usuarios, yo } = useStore();
  const t = tiendas.find((x) => x.id === id);
  if (!t) return <p className="p-10">{L.tienda} no encontrada.</p>;
  const ps = productos.filter((p) => p.tiendaId === t.id);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="card flex items-center gap-6 p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={t.img} alt="" className="h-24 w-24 rounded-xl object-cover" />
        <div>
          <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs text-brand">{t.rubro}</span>
          <h1 className="mt-1 text-3xl font-bold">{t.nombre}</h1>
          <p className="text-sm text-neutral-500">{t.direccion} · {usuarios.find((u) => u.id === t.ownerId)?.nombre}</p>
        </div>
      </div>
      <h2 className="mt-8 mb-4 text-xl font-semibold">Catalogo ({ps.length})</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{ps.map((p) => <ProductCard key={p.id} p={p} puedePedir={yo.rol === "comprador"} />)}</div>
    </div>
  );
}
