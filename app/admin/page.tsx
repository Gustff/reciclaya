"use client";
import { L } from "@/lib/config";
import { useStore } from "@/lib/store";
import Acceso from "@/components/Acceso";
import { rolLabel } from "@/components/Nav";

export default function Admin() {
  const { yo, usuarios, tiendas, toggleSuspension, reset } = useStore();
  if (yo.rol !== "admin") return <Acceso rol={L.admin.toLowerCase()} />;
  const fila = (id: string, nombre: string, sub: string, susp: boolean | undefined, tipo: "usuario" | "tienda") => (
    <div key={id} className="flex items-center justify-between border-t border-neutral-200 px-4 py-3 text-sm">
      <div><p className="font-medium">{nombre}</p><p className="text-neutral-500">{sub}</p></div>
      <button onClick={() => toggleSuspension(tipo, id)} className={susp ? "btn-ghost py-1" : "btn py-1 text-red-600 hover:bg-red-50"}>{susp ? "Reactivar" : "Suspender"}</button>
    </div>
  );
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-2">
      <div className="card"><h2 className="p-4 text-lg font-semibold">Usuarios</h2>{usuarios.filter((u) => u.rol !== "admin").map((u) => fila(u.id, u.nombre, rolLabel[u.rol] + (u.suspendido ? " · suspendido" : ""), u.suspendido, "usuario"))}</div>
      <div className="card"><h2 className="p-4 text-lg font-semibold">{L.tiendas}</h2>{tiendas.map((t) => fila(t.id, t.nombre, t.rubro + (t.suspendida ? " · suspendido" : ""), t.suspendida, "tienda"))}</div>
      <button onClick={reset} className="btn-ghost md:col-span-2">Restaurar datos de prueba</button>
    </div>
  );
}
