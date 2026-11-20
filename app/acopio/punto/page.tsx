"use client";
import { useEffect, useState } from "react";
import { L } from "@/lib/config";
import { useStore } from "@/lib/store";
import type { Tienda } from "@/lib/mock";

export default function MiTienda() {
  const { yo, tiendas, guardarTienda } = useStore();
  const actual = tiendas.find((t) => t.ownerId === yo.id);
  const vacia: Tienda = { id: "", ownerId: yo.id, nombre: "", rubro: "", direccion: "", img: "" };
  const [f, setF] = useState<Tienda>(actual ?? vacia);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  useEffect(() => { setF(actual ?? { ...vacia, ownerId: yo.id }); setMsg(null); }, [yo.id]); // eslint-disable-line react-hooks/exhaustive-deps
  if (yo.rol !== "vendedor") return <p className="p-10">Solo para {L.vendedor.toLowerCase()}es.</p>;
  const save = () => { const e = guardarTienda(f); setMsg(e ? { ok: false, t: e } : { ok: true, t: `${L.tienda} guardada correctamente` }); };
  const campo = (k: keyof Tienda, label: string) => (
    <div><label className="label">{label}</label><input className="input" value={String(f[k] ?? "")} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></div>
  );
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">{actual ? `Editar mi ${L.tienda.toLowerCase()}` : `Registrar ${L.tienda.toLowerCase()}`}</h1>
      <div className="card space-y-4 p-6">
        {campo("nombre", "Nombre")}{campo("rubro", L.rubro)}{campo("direccion", "Direccion")}{campo("img", "URL de imagen")}
        {msg && <p className={`rounded-md px-3 py-2 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{msg.t}</p>}
        <button className="btn-primary w-full" onClick={save}>Guardar</button>
      </div>
    </div>
  );
}
