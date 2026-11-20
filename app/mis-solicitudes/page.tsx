"use client";
import { fmt, L } from "@/lib/config";
import { useStore } from "@/lib/store";
import EstadoBadge from "@/components/EstadoBadge";

export default function MisSolicitudes() {
  const { pedidos, productos, tiendas, usuarios, yo } = useStore();
  const mios = pedidos.filter((o) => o.compradorId === yo.id);
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="mb-6 text-4xl font-black md:text-5xl">{L.misPedidos}</h1>
      {mios.length === 0 && <p className="text-neutral-500">Aun no tienes {L.pedidos.toLowerCase()}.</p>}
      <div className="space-y-3">
        {mios.map((o) => {
          const p = productos.find((x) => x.id === o.productoId);
          const t = tiendas.find((x) => x.id === p?.tiendaId);
          const rec = usuarios.find((u) => u.id === o.recolectorId);
          return (
            <div key={o.id} className="card flex items-center justify-between p-5">
              <div>
                <p className="font-medium">{p?.nombre} · {o.cantidad} {L.unidad}</p>
                <p className="text-sm text-neutral-500">Destino: {t?.nombre} · Recojo en {o.direccion}</p>
                <p className="text-xs text-neutral-400">{o.fecha}{rec ? ` · Recolector: ${rec.nombre}` : ""}</p>
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
