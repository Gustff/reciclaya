"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { L } from "@/lib/config";
import { useStore } from "@/lib/store";
import type { Producto } from "@/lib/mock";
import { puedeGestionarMaterial, validarMaterial } from "@/lib/reglas";

export default function EditarMaterial() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { yo, tiendas, productos, guardarProducto } = useStore();
  const t = tiendas.find((x) => x.ownerId === yo.id);
  const existente = productos.find((p) => p.id === id);
  const [f, setF] = useState<Producto>(existente ?? { id: "", tiendaId: t?.id ?? "", nombre: "", descripcion: "", precio: 0, stock: 0, img: "" });
  const [err, setErr] = useState("");
  if (!t) return <p className="p-10">Necesitas un {L.tienda.toLowerCase()}.</p>;
  if (!puedeGestionarMaterial(existente, t)) return <p className="p-10">No autorizado: este material pertenece a otro punto de acopio.</p>;
  const save = () => {
    const e = validarMaterial(f); if (e) return setErr(e);
    const e2 = guardarProducto({ ...f, tiendaId: t.id }); if (e2) return setErr(e2); router.push("/acopio/materiales");
  };
  const num = (k: "precio" | "stock", label: string) => (
    <div><label className="label" htmlFor={k}>{label}</label><input id={k} type="number" className="input" value={f[k]} onChange={(e) => setF({ ...f, [k]: Number(e.target.value) })} /></div>
  );
  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <h1 className="mb-6 text-4xl font-black md:text-5xl">{existente ? "Editar" : "Crear"} {L.producto.toLowerCase()}</h1>
      <div className="card space-y-4 p-6">
        <div><label className="label" htmlFor="nombre">Nombre</label><input id="nombre" className="input" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} /></div>
        <div><label className="label" htmlFor="descripcion">Descripción</label><textarea id="descripcion" className="input" rows={3} value={f.descripcion} onChange={(e) => setF({ ...f, descripcion: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-4">{num("precio", "Pago por kg (S/)")}{num("stock", "Capacidad disponible (kg)")}</div>
        <div><label className="label" htmlFor="img">URL de foto (opcional)</label><input id="img" className="input" value={f.img} onChange={(e) => setF({ ...f, img: e.target.value })} /></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {f.img && <img src={f.img} alt="" className="h-40 w-full rounded-lg object-cover" />}
        {err && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
        <button className="btn-primary w-full" onClick={save}>Guardar</button>
      </div>
    </div>
  );
}
