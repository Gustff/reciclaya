"use client";
import Link from "next/link";
import { useState } from "react";
import { L } from "@/lib/config";
import { useStore } from "@/lib/store";
import { estaAbierto, normalizar } from "@/lib/reglas";
import Horario from "@/components/Horario";

export default function Puntos() {
  const { tiendas, productos } = useStore();
  const [q, setQ] = useState("");
  const [distrito, setDistrito] = useState("");
  const [material, setMaterial] = useState("");
  const [soloAbiertos, setSoloAbiertos] = useState(false);
  const activas = tiendas.filter((t) => !t.suspendida);
  const distritos = [...new Set(activas.map((t) => t.rubro))];
  const materiales = [...new Set(productos.filter((p) => activas.some((t) => t.id === p.tiendaId)).map((p) => p.nombre))].sort();
  const s = normalizar(q);
  const mats = (id: string) => productos.filter((p) => p.tiendaId === id);
  const ts = activas.filter((t) =>
    (!distrito || t.rubro === distrito) &&
    (!material || mats(t.id).some((p) => p.nombre === material && p.stock > 0)) &&
    (!soloAbiertos || estaAbierto(t.horario, new Date())) &&
    (!s || normalizar(t.nombre).includes(s) || normalizar(t.direccion).includes(s)));
  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="text-4xl font-black md:text-5xl">Buscar {L.tiendas.toLowerCase()}</h1>
      <p className="mt-1 text-neutral-600">Filtra por material, distrito y horario para saber dónde llevar tus reciclables.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <input aria-label="Buscar por nombre o dirección" className="input" placeholder="Nombre o dirección..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select aria-label="Material" className="input" value={material} onChange={(e) => setMaterial(e.target.value)}>
          <option value="">Todos los materiales</option>{materiales.map((m) => <option key={m}>{m}</option>)}
        </select>
        <select aria-label="Distrito" className="input" value={distrito} onChange={(e) => setDistrito(e.target.value)}>
          <option value="">Todos los distritos</option>{distritos.map((r) => <option key={r}>{r}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={soloAbiertos} onChange={(e) => setSoloAbiertos(e.target.checked)} /> Solo abiertos ahora</label>
      </div>
      <h2 className="mt-8 mb-3 text-lg font-semibold">{ts.length} resultado(s)</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ts.map((t) => (
          <Link key={t.id} href={`/puntos/${t.id}`} className="lift group overflow-hidden rounded-3xl bg-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.img} alt={t.nombre} className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="space-y-2 p-6">
              <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white">{t.rubro}</span>
              <h3 className="text-xl font-bold">{t.nombre}</h3>
              <p className="text-sm text-neutral-500">{t.direccion}</p>
              <Horario h={t.horario} />
              <div className="flex flex-wrap gap-1 pt-1">
                {mats(t.id).map((p) => <span key={p.id} className={`rounded-full px-3 py-1 text-xs font-semibold ${p.stock > 0 ? "bg-white" : "bg-white text-neutral-400 line-through"}`}>{p.nombre}</span>)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
