"use client";
import { fmt, L } from "@/lib/config";
import { useStore } from "@/lib/store";
import EstadoBadge from "@/components/EstadoBadge";

export default function MisPedidos() {
  const { pedidos, productos, tiendas, yo } = useStore();
  const mios = pedidos.filter((o) => o.compradorId === yo.id);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">{L.misPedidos}</h1>
      {mios.length === 0 && <p className="text-neutral-500">Aun no tienes {L.pedidos.toLowerCase()}.</p>}
      <div className="space-y-3">
        {mios.map((o) => {
          const p = productos.find((x) => x.id === o.productoId);
          const t = tiendas.find((x) => x.id === p?.tiendaId);
          return (
            <div key={o.id} className="card flex items-center justify-between p-5">
              <div>
                <p className="font-medium">{p?.nombre}</p>
                <p className="text-sm text-neutral-500">{t?.nombre} · {o.cantidad} x {fmt(o.precioUnitario)}</p>
                <p className="text-xs text-neutral-400">{o.fecha}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{fmt(o.cantidad * o.precioUnitario)}</p>
                <EstadoBadge e={o.estado} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
