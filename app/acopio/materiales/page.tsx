"use client";
import Link from "next/link";
import { fmt, L } from "@/lib/config";
import { useStore } from "@/lib/store";

export default function MisProductos() {
  const { yo, tiendas, productos, eliminarProducto } = useStore();
  const t = tiendas.find((x) => x.ownerId === yo.id);
  if (yo.rol !== "vendedor" || !t) return <p className="p-10">Necesitas ser {L.vendedor.toLowerCase()} con {L.tienda.toLowerCase()} registrada.</p>;
  const ps = productos.filter((p) => p.tiendaId === t.id);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mis {L.productos.toLowerCase()}</h1>
        <Link href="/vendedor/productos/nuevo" className="btn-primary">+ Nuevo {L.producto.toLowerCase()}</Link>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500"><tr><th className="p-3"></th><th>{L.producto}</th><th>Precio</th><th>Stock</th><th className="text-right pr-4">Acciones</th></tr></thead>
          <tbody>
            {ps.map((p) => (
              <tr key={p.id} className="border-t border-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <td className="p-3"><img src={p.img} alt="" className="h-12 w-12 rounded-lg object-cover" /></td>
                <td className="font-medium">{p.nombre}</td><td>{fmt(p.precio)}</td>
                <td>{p.stock === 0 ? <span className="text-red-600">Agotado</span> : p.stock}</td>
                <td className="space-x-2 pr-4 text-right">
                  <Link href={`/vendedor/productos/${p.id}`} className="btn-ghost py-1">Editar</Link>
                  <button className="btn py-1 text-red-600 hover:bg-red-50" onClick={() => confirm(`Eliminar ${p.nombre}?`) && eliminarProducto(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
