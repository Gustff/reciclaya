"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { fmt, L } from "@/lib/config";
import { useStore } from "@/lib/store";

export default function Pedir() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { productos, tiendas, yo, crearPedido } = useStore();
  const [cant, setCant] = useState(1);
  const [err, setErr] = useState("");
  const p = productos.find((x) => x.id === id);
  if (!p) return <p className="p-10">{L.producto} no encontrado.</p>;
  const t = tiendas.find((x) => x.id === p.tiendaId);
  const enviar = () => {
    const e = crearPedido(p.id, cant);
    if (e) setErr(e); else router.push("/mis-pedidos");
  };
  return (
    <div className="mx-auto grid max-w-4xl gap-8 px-4 py-10 md:grid-cols-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.img} alt={p.nombre} className="aspect-square w-full rounded-2xl object-cover" />
      <div>
        <p className="text-sm text-neutral-500">{t?.nombre}</p>
        <h1 className="text-3xl font-bold">{p.nombre}</h1>
        <p className="mt-3 text-neutral-600">{p.descripcion}</p>
        <p className="mt-4 text-2xl font-bold text-brand">{fmt(p.precio)}</p>
        <p className="text-sm text-neutral-500">Stock disponible: {p.stock}</p>
        <div className="card mt-6 space-y-4 p-5">
          <div>
            <label className="label" htmlFor="cant">Cantidad</label>
            <input id="cant" type="number" min={1} max={p.stock} className="input" value={cant} onChange={(e) => { setCant(Number(e.target.value)); setErr(""); }} />
          </div>
          <div className="flex justify-between text-sm"><span>Total</span><span className="font-bold">{fmt(p.precio * (cant || 0))}</span></div>
          {err && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
          <button onClick={enviar} disabled={p.stock === 0} className="btn-primary w-full disabled:opacity-50">Confirmar {L.pedido.toLowerCase()}</button>
        </div>
      </div>
    </div>
  );
}
