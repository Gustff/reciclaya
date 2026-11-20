"use client";
import { useParams } from "next/navigation";
import { L } from "@/lib/config";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";
import Horario from "@/components/Horario";

export default function PuntoDetalle() {
  const { id } = useParams<{ id: string }>();
  const { tiendas, productos, usuarios, yo } = useStore();
  const t = tiendas.find((x) => x.id === id);
  if (!t || t.suspendida) return <p className="p-10">{L.tienda} no disponible.</p>;
  const ps = productos.filter((p) => p.tiendaId === t.id);
  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="card flex items-center gap-6 p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={t.img} alt="" className="h-24 w-24 rounded-xl object-cover" />
        <div className="space-y-1">
          <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white">{t.rubro}</span>
          <h1 className="text-4xl font-black md:text-5xl">{t.nombre}</h1>
          <p className="text-sm text-neutral-500">{t.direccion} · Operador: {usuarios.find((u) => u.id === t.ownerId)?.nombre}</p>
          <Horario h={t.horario} />
        </div>
      </div>
      <h2 className="mt-8 mb-4 text-xl font-semibold">{L.productos} que recibe ({ps.length})</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{ps.map((p) => <ProductCard key={p.id} p={p} puedePedir={yo.rol === "comprador"} />)}</div>
    </div>
  );
}
