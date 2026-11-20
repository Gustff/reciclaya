"use client";
import Link from "next/link";
import { ESTADOS, fmt, L } from "@/lib/config";
import { useStore } from "@/lib/store";
import type { Estado } from "@/lib/mock";
import EstadoBadge from "@/components/EstadoBadge";
import { totalVentas } from "@/lib/reglas";

export default function PanelVendedor() {
  const { yo, tiendas, productos, pedidos, usuarios, cambiarEstado } = useStore();
  if (yo.rol !== "vendedor") return <p className="p-10">Selecciona un usuario {L.vendedor.toLowerCase()} arriba a la derecha.</p>;
  const t = tiendas.find((x) => x.ownerId === yo.id);
  if (!t) return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Aun no tienes {L.tienda.toLowerCase()}</h1>
      <Link href="/vendedor/tienda" className="btn-primary mt-5">Registrar mi {L.tienda.toLowerCase()}</Link>
    </div>
  );
  const misP = productos.filter((p) => p.tiendaId === t.id);
  const recibidos = pedidos.filter((o) => misP.some((p) => p.id === o.productoId));
  const ventas = totalVentas(recibidos);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Panel de {L.vendedor.toLowerCase()} · {t.nombre}</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[[misP.length, L.productos], [recibidos.length, `${L.pedidos} ${L.recibidos}`], [recibidos.filter((o) => o.estado === "pendiente").length, "Pendientes"], [fmt(ventas), L.ventas]].map(([n, l]) => (
          <div key={String(l)} className="card p-5"><div className="text-2xl font-bold text-brand">{n}</div><div className="text-sm text-neutral-600">{l}</div></div>
        ))}
      </div>
      <h2 className="mt-10 mb-4 text-xl font-semibold">Bandeja de {L.pedidos.toLowerCase()}</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500"><tr><th className="p-3">{L.producto}</th><th>{L.comprador}</th><th>Cant.</th><th>Total</th><th>Fecha</th><th>Estado</th><th>Cambiar</th></tr></thead>
          <tbody>
            {recibidos.map((o) => (
              <tr key={o.id} className="border-t border-neutral-100">
                <td className="p-3 font-medium">{productos.find((p) => p.id === o.productoId)?.nombre}</td>
                <td>{usuarios.find((u) => u.id === o.compradorId)?.nombre}</td>
                <td>{o.cantidad}</td><td>{fmt(o.cantidad * o.precioUnitario)}</td><td>{o.fecha}</td>
                <td><EstadoBadge e={o.estado} /></td>
                <td><select className="input w-36 py-1" value={o.estado} onChange={(e) => cambiarEstado(o.id, e.target.value as Estado)}>{ESTADOS.map((s) => <option key={s}>{s}</option>)}</select></td>
              </tr>
            ))}
            {recibidos.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-neutral-500">Sin {L.pedidos.toLowerCase()} aun.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
