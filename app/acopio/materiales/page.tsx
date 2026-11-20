"use client";
import Link from "next/link";
import { useState } from "react";
import { fmt, L } from "@/lib/config";
import { useStore } from "@/lib/store";

export default function MisMateriales() {
  const { yo, tiendas, productos, eliminarProducto } = useStore();
  const [msg, setMsg] = useState("");
  const t = tiendas.find((x) => x.ownerId === yo.id);
  if (yo.rol !== "vendedor" || !t) return <p className="p-10">Necesitas ser {L.vendedor.toLowerCase()} con {L.tienda.toLowerCase()} registrado.</p>;
  const ps = productos.filter((p) => p.tiendaId === t.id);
  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-black md:text-5xl">Mis {L.productos.toLowerCase()}</h1>
        <Link href="/acopio/materiales/nuevo" className="btn-primary">+ Nuevo material</Link>
      </div>
      {msg && <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{msg}</p>}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-neutral-500"><tr><th className="p-3"></th><th>{L.producto}</th><th>Pago por kg</th><th>Capacidad (kg)</th><th className="text-right pr-4">Acciones</th></tr></thead>
          <tbody>
            {ps.map((p) => (
              <tr key={p.id} className="border-t border-neutral-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <td className="p-3"><img src={p.img} alt="" className="h-12 w-12 rounded-lg object-cover" /></td>
                <td className="font-medium">{p.nombre}</td><td>{fmt(p.precio)}</td>
                <td>{p.stock === 0 ? <span className="text-red-600">{L.sinCapacidad}</span> : p.stock}</td>
                <td className="space-x-2 pr-4 text-right">
                  <Link href={`/acopio/materiales/${p.id}`} className="btn-ghost py-1">Editar</Link>
                  <button className="btn py-1 text-red-600 hover:bg-red-50" onClick={() => confirm(`¿Eliminar ${p.nombre}?`) && setMsg(eliminarProducto(p.id) ?? "")}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
