import Link from "next/link";
import { fmt, L } from "@/lib/config";
import type { Producto } from "@/lib/mock";

export default function ProductCard({ p, tienda, puedePedir }: { p: Producto; tienda?: string; puedePedir?: boolean }) {
  return (
    <div className="lift group flex h-full flex-col overflow-hidden rounded-3xl bg-soft">
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.img} alt={p.nombre} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {p.stock === 0 && <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-xs font-bold text-white">{L.sinCapacidad}</span>}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-6">
        {tienda && <p className="eyebrow text-neutral-500">{tienda}</p>}
        <h3 className="text-lg font-bold leading-snug">{p.nombre}</h3>
        <p className="text-2xl font-black">{fmt(p.precio)}<span className="text-sm font-semibold text-neutral-500"> / {L.unidad}</span></p>
        <p className="text-xs text-neutral-500">{p.stock} {L.unidad} de capacidad disponible</p>
        {puedePedir && p.stock > 0 && <Link href={`/solicitar/${p.id}`} className="btn-primary mt-4 self-start">{L.pedir}</Link>}
      </div>
    </div>
  );
}
