"use client";
import Link from "next/link";
import { APP, L } from "@/lib/config";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";
import { ph } from "@/lib/mock";

export default function Home() {
  const { yo, tiendas, productos } = useStore();
  const activas = tiendas.filter((t) => !t.suspendida);
  const rubros = new Set(activas.map((t) => t.rubro)).size;
  const nombreTienda = (id: string) => tiendas.find((t) => t.id === id)?.nombre;
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-medium text-brand">Hola, {yo.nombre}</p>
          <h1 className="text-5xl font-bold leading-tight tracking-tight">{APP.titulo}<br /><span className="text-brand">{APP.tituloAcento}</span></h1>
          <p className="mt-5 max-w-md text-neutral-600">{APP.subtitulo}</p>
          <div className="mt-7 flex gap-3">
            <Link href="/tiendas" className="btn-primary">Explorar {L.tiendas.toLowerCase()}</Link>
            {yo.rol === "vendedor" ? <Link href="/vendedor" className="btn-ghost">Mi panel</Link> : <Link href="/mis-pedidos" className="btn-ghost">{L.misPedidos}</Link>}
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={APP.heroImg || ph(`${APP.nombre}${APP.acento}`)} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" />
      </section>
      <section className="border-t border-neutral-200 bg-neutral-100/60 py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-4 px-4">
          {[[activas.length, L.tiendas], [productos.length, L.productos], [rubros, L.rubros]].map(([n, t]) => (
            <div key={t} className="card py-6 text-center"><div className="text-3xl font-bold text-brand">{n}</div><div className="text-sm text-neutral-600">{t}</div></div>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-6xl px-4">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-2xl font-bold">{L.productos} destacados</h2>
            <Link href="/tiendas" className="text-sm text-brand">Ver todo</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productos.slice(0, 4).map((p) => <ProductCard key={p.id} p={p} tienda={nombreTienda(p.tiendaId)} puedePedir={yo.rol === "comprador"} />)}
          </div>
        </div>
      </section>
    </>
  );
}
