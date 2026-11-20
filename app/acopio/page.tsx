"use client";
import Link from "next/link";
import { useState } from "react";
import { ESTADO_LABEL, fmt, L } from "@/lib/config";
import { useStore } from "@/lib/store";
import type { Estado } from "@/lib/mock";
import EstadoBadge from "@/components/EstadoBadge";
import Acceso from "@/components/Acceso";
import { kgReciclados, pagoEstimado, transicionesPermitidas } from "@/lib/reglas";

export default function PanelAcopio() {
  const { yo, tiendas, productos, pedidos, usuarios, cambiarEstado } = useStore();
  const [msg, setMsg] = useState("");
  if (yo.rol !== "vendedor") return <Acceso rol={L.vendedor.toLowerCase()} />;
  const t = tiendas.find((x) => x.ownerId === yo.id);
  if (!t) return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Aún no registras tu {L.tienda.toLowerCase()}</h1>
      <Link href="/acopio/punto" className="btn-primary mt-5">Registrar punto de acopio</Link>
    </div>
  );
  const misP = productos.filter((p) => p.tiendaId === t.id);
  const recibidos = pedidos.filter((o) => misP.some((p) => p.id === o.productoId));
  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="text-4xl font-black md:text-5xl">Panel del {L.tienda.toLowerCase()} · {t.nombre}</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[[misP.length, L.productos], [recibidos.filter((o) => o.estado === "pendiente").length, "Pendientes"], [`${kgReciclados(recibidos)} kg`, "Recibidos en acopio"], [fmt(pagoEstimado(recibidos)), L.ventas]].map(([n, l]) => (
          <div key={String(l)} className="card p-5"><div className="text-3xl font-black">{n}</div><div className="text-sm text-neutral-600">{l}</div></div>
        ))}
      </div>
      {msg && <p role="alert" className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{msg}</p>}
      <h2 className="mt-10 mb-4 text-xl font-semibold">{L.pedidos} {L.recibidos}</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-neutral-500"><tr><th className="p-3">{L.producto}</th><th>{L.comprador}</th><th>Kg</th><th>Pago</th><th>Recolector</th><th>Estado</th><th>Cambiar</th></tr></thead>
          <tbody>
            {recibidos.map((o) => (
              <tr key={o.id} className="border-t border-neutral-200">
                <td className="p-3 font-medium">{productos.find((p) => p.id === o.productoId)?.nombre}</td>
                <td>{usuarios.find((u) => u.id === o.compradorId)?.nombre}</td>
                <td>{o.cantidad}</td><td>{fmt(o.cantidad * o.precioUnitario)}</td>
                <td>{usuarios.find((u) => u.id === o.recolectorId)?.nombre ?? "—"}</td>
                <td><EstadoBadge e={o.estado} /></td>
                <td>{transicionesPermitidas(o.estado, yo.rol).length ? <select aria-label="Cambiar estado" className="input w-44 py-1" value="" onChange={(e) => setMsg(cambiarEstado(o.id, e.target.value as Estado) ?? "")}><option value="" disabled>Cambiar a…</option>{transicionesPermitidas(o.estado, yo.rol).map((s) => <option key={s} value={s}>{ESTADO_LABEL[s]}</option>)}</select> : <span className="text-xs text-neutral-400">Estado final</span>}</td>
              </tr>
            ))}
            {recibidos.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-neutral-500">Sin {L.pedidos.toLowerCase()} aún.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
