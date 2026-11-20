"use client";
import { useEffect, useState } from "react";
import { DIAS, L } from "@/lib/config";
import { useStore } from "@/lib/store";
import type { Tienda } from "@/lib/mock";

export default function MiPunto() {
  const { yo, tiendas, guardarTienda } = useStore();
  const actual = tiendas.find((t) => t.ownerId === yo.id);
  const vacia: Tienda = { id: "", ownerId: yo.id, nombre: "", rubro: "", direccion: "", horario: { dias: [1, 2, 3, 4, 5, 6], abre: "08:00", cierra: "18:00" }, img: "" };
  const [f, setF] = useState<Tienda>(actual ?? vacia);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  useEffect(() => { setF(actual ?? { ...vacia, ownerId: yo.id }); setMsg(null); }, [yo.id]); // eslint-disable-line react-hooks/exhaustive-deps
  if (yo.rol !== "vendedor") return <p className="p-10">Solo para {L.vendedor.toLowerCase()}.</p>;
  const save = () => { const e = guardarTienda(f); setMsg(e ? { ok: false, t: e } : { ok: true, t: `${L.tienda} guardado correctamente` }); };
  const campo = (k: "nombre" | "rubro" | "direccion", label: string) => (
    <div><label className="label">{label}</label><input className="input" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></div>
  );
  const toggleDia = (d: number) => setF({ ...f, horario: { ...f.horario, dias: f.horario.dias.includes(d) ? f.horario.dias.filter((x) => x !== d) : [...f.horario.dias, d].sort() } });
  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <h1 className="mb-6 text-4xl font-black md:text-5xl">{actual ? "Editar mi punto de acopio" : "Registrar punto de acopio"}</h1>
      <div className="card space-y-4 p-6">
        {campo("nombre", "Nombre")}{campo("rubro", L.rubro)}{campo("direccion", "Dirección")}
        <div>
          <label className="label">Días de atención</label>
          <div className="flex flex-wrap gap-2">{DIAS.map((d, i) => (
            <button key={d} type="button" onClick={() => toggleDia(i)} className={`rounded-md border px-3 py-1 text-sm ${f.horario.dias.includes(i) ? "border-brand bg-emerald-50 text-brand" : "border-neutral-300"}`}>{d}</button>
          ))}</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Abre</label><input type="time" className="input" value={f.horario.abre} onChange={(e) => setF({ ...f, horario: { ...f.horario, abre: e.target.value } })} /></div>
          <div><label className="label">Cierra</label><input type="time" className="input" value={f.horario.cierra} onChange={(e) => setF({ ...f, horario: { ...f.horario, cierra: e.target.value } })} /></div>
        </div>
        {msg && <p role="alert" className={`rounded-md px-3 py-2 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{msg.t}</p>}
        <button className="btn-primary w-full" onClick={save}>Guardar</button>
      </div>
    </div>
  );
}
