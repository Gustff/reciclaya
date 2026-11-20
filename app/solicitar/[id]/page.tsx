"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { fmt, L } from "@/lib/config";
import { useStore } from "@/lib/store";
import Horario from "@/components/Horario";

export default function Solicitar() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { productos, tiendas, crearPedido } = useStore();
  const [kg, setKg] = useState(1);
  const [dir, setDir] = useState("");
  const [err, setErr] = useState("");
  const p = productos.find((x) => x.id === id);
  if (!p) return <p className="p-10">{L.producto} no encontrado.</p>;
  const t = tiendas.find((x) => x.id === p.tiendaId);
  const enviar = () => { const e = crearPedido(p.id, kg, dir); if (e) setErr(e); else router.push("/mis-solicitudes"); };
  return (
    <div className="mx-auto grid max-w-4xl gap-8 px-4 py-10 md:grid-cols-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.img} alt={p.nombre} className="aspect-square w-full rounded-3xl object-cover" />
      <div>
        <p className="text-sm text-neutral-500">{t?.nombre} · {t?.rubro}</p>
        <h1 className="text-4xl font-black md:text-5xl">{p.nombre}</h1>
        <p className="mt-3 text-neutral-600">{p.descripcion}</p>
        {t && <div className="mt-2"><Horario h={t.horario} /></div>}
        <p className="mt-4 text-3xl font-black">{fmt(p.precio)} / {L.unidad}</p>
        <p className="text-sm text-neutral-500">{L.capacidad}: {p.stock} {L.unidad}</p>
        <div className="card mt-6 space-y-4 p-5">
          <div>
            <label className="label" htmlFor="kg">Cantidad aproximada ({L.unidad})</label>
            <input id="kg" type="number" min={1} max={p.stock} className="input" value={kg} onChange={(e) => { setKg(Number(e.target.value)); setErr(""); }} />
          </div>
          <div>
            <label className="label" htmlFor="dir">Direccion de recojo</label>
            <input id="dir" className="input" placeholder="Calle, numero y distrito" value={dir} onChange={(e) => { setDir(e.target.value); setErr(""); }} />
          </div>
          <div className="flex justify-between text-sm"><span>{L.ventas}</span><span className="font-bold">{fmt(p.precio * (kg || 0))}</span></div>
          {err && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
          <button onClick={enviar} disabled={p.stock === 0} className="btn-primary w-full disabled:opacity-50">Confirmar {L.pedido.toLowerCase()}</button>
        </div>
      </div>
    </div>
  );
}
