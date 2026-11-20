"use client";
import Link from "next/link";
import { APP, L } from "@/lib/config";
import { useStore } from "@/lib/store";
import { heroArt } from "@/lib/mock";
import { kgReciclados } from "@/lib/reglas";
import ProductCard from "@/components/ProductCard";
import Reveal, { Contador } from "@/components/Reveal";

const PASOS = [
  ["01", "Encuentra tu punto", "Filtra por material, distrito y horario. Sabrás al instante si el punto está abierto."],
  ["02", "Solicita el recojo", "Indica el material, los kilos aproximados y tu dirección. Sin llamadas ni esperas."],
  ["03", "Un recolector lo lleva", "Recolectores de tu zona toman la solicitud y la entregan en el punto de acopio."],
];

export default function Home() {
  const { yo, tiendas, productos, pedidos } = useStore();
  const activas = tiendas.filter((t) => !t.suspendida);
  const visibles = productos.filter((p) => activas.some((t) => t.id === p.tiendaId));
  const materiales = new Set(visibles.map((p) => p.nombre)).size;
  const nombreTienda = (id: string) => tiendas.find((t) => t.id === id)?.nombre;
  const cta = yo.rol === "vendedor" ? ["/acopio", "Ir a mi panel"] : yo.rol === "recolector" ? ["/recolector", "Ver recojos"] : ["/mis-solicitudes", L.misPedidos];
  return (
    <>
      <section className="bg-black text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-20 md:grid-cols-2 md:py-28">
          <div className="anim-fade-up">
            <p className="eyebrow flex items-center gap-2 text-brand"><span className="pulse-dot inline-block h-2 w-2 rounded-full bg-brand" />Hola, {yo.nombre}</p>
            <h1 className="mt-4 text-5xl font-black leading-[1.02] md:text-7xl">{APP.titulo}<br /><span className="text-shimmer bg-gradient-to-r from-emerald-300 via-brand to-emerald-300 bg-clip-text text-transparent">{APP.tituloAcento}</span></h1>
            <p className="mt-6 max-w-lg text-lg text-neutral-300">{APP.subtitulo}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/puntos" className="btn-light">Buscar puntos de acopio</Link>
              <Link href={cta[0]} className="btn-outline-light">{cta[1]}</Link>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={APP.heroImg || heroArt()} alt="Materiales reciclables conectados" className="anim-float w-full" />
        </div>
      </section>

      <section className="border-b border-neutral-200">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-neutral-200 px-6 md:grid-cols-4">
          {([[activas.length, L.tiendas, ""], [materiales, "Tipos de material", ""], [pedidos.length, L.pedidos, ""], [kgReciclados(pedidos), "Reciclados", " kg"]] as [number, string, string][]).map(([n, t, suf], i) => (
            <Reveal key={t} delay={i * 100} className="px-6 py-10 text-center"><div className="text-4xl font-black md:text-5xl"><Contador valor={n} sufijo={suf} /></div><div className="mt-1 text-sm font-semibold text-neutral-500">{t}</div></Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal><p className="eyebrow text-center text-brand">Cómo funciona</p>
        <h2 className="mt-3 text-center text-4xl font-black md:text-5xl">Reciclar nunca fue tan simple</h2></Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PASOS.map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 120} className="lift rounded-3xl bg-soft p-8">
              <p className="text-5xl font-black text-neutral-300">{n}</p>
              <h3 className="mt-6 text-xl font-bold">{t}</h3>
              <p className="mt-2 text-neutral-600">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-end justify-between">
          <div><p className="eyebrow text-brand">Materiales</p><h2 className="mt-2 text-4xl font-black">Lo que se recibe hoy</h2></div>
          <Link href="/puntos" className="btn-ghost">Ver todo</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibles.slice(0, 4).map((p, i) => <Reveal key={p.id} delay={i * 100}><ProductCard p={p} tienda={nombreTienda(p.tiendaId)} puedePedir={yo.rol === "comprador"} /></Reveal>)}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-6">
        <Reveal><div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-50 to-emerald-100 p-10 md:grid-cols-2 md:p-16">
          <div>
            <p className="eyebrow text-brand-dark">Para recolectores</p>
            <h2 className="mt-3 text-4xl font-black">Sabe dónde hay material antes de salir</h2>
            <p className="mt-4 text-neutral-700">Mira las solicitudes cercanas, toma las que te convienen y entrégalas en el punto de acopio. Menos recorridos a ciegas, más ingresos.</p>
            <Link href="/recolector?as=u-juan" className="btn-primary mt-8">Probar como recolector</Link>
          </div>
          <div className="anim-float text-center text-[160px] leading-none">🚲</div>
        </div></Reveal>
      </section>
    </>
  );
}
