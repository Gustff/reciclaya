"use client";
import { useState } from "react";
import { fmt, L } from "@/lib/config";
import { useStore } from "@/lib/store";
import EstadoBadge from "@/components/EstadoBadge";
import Acceso from "@/components/Acceso";
import type { Pedido } from "@/lib/mock";

export default function Recolector() {
  const { yo, pedidos, productos, tiendas, usuarios, tomarRecojo, cambiarEstado } = useStore();
  const [msg, setMsg] = useState("");
  if (yo.rol !== "recolector") return <Acceso rol={L.recolector.toLowerCase()} />;
  const info = (o: Pedido) => {
    const p = productos.find((x) => x.id === o.productoId);
    return { p, t: tiendas.find((x) => x.id === p?.tiendaId), v: usuarios.find((u) => u.id === o.compradorId) };
  };
  const disponibles = pedidos.filter((o) => o.estado === "pendiente" && !o.recolectorId);
  const mios = pedidos.filter((o) => o.recolectorId === yo.id);
  const fila = (o: Pedido, accion: React.ReactNode) => {
    const { p, t, v } = info(o);
    return (
      <div key={o.id} className="flex items-center justify-between border-t border-neutral-200 px-5 py-4">
        <div>
          <p className="font-medium">{p?.nombre} · {o.cantidad} {L.unidad} <span className="text-neutral-400">({fmt(o.cantidad * o.precioUnitario)})</span></p>
          <p className="text-sm text-neutral-500">Recoger en: {o.direccion} ({v?.nombre})</p>
          <p className="text-sm text-neutral-500">Llevar a: {t?.nombre} — {t?.direccion}</p>
        </div>
        <div className="flex items-center gap-3"><EstadoBadge e={o.estado} />{accion}</div>
      </div>
    );
  };
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-14">
      <h1 className="text-4xl font-black md:text-5xl">Recojos · {yo.nombre}</h1>
      {msg && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{msg}</p>}
      <div className="card">
        <h2 className="p-5 text-lg font-semibold">Solicitudes disponibles ({disponibles.length})</h2>
        {disponibles.map((o) => fila(o, <button className="btn-primary py-1" onClick={() => setMsg(tomarRecojo(o.id) ?? "")}>Tomar recojo</button>))}
        {disponibles.length === 0 && <p className="border-t border-neutral-200 p-5 text-sm text-neutral-500">No hay solicitudes pendientes.</p>}
      </div>
      <div className="card">
        <h2 className="p-5 text-lg font-semibold">Mis recojos ({mios.length})</h2>
        {mios.map((o) => fila(o, o.estado === "aceptado" ? <button className="btn-ghost py-1" onClick={() => setMsg(cambiarEstado(o.id, "entregado") ?? "")}>Marcar entregado</button> : null))}
      </div>
    </div>
  );
}
