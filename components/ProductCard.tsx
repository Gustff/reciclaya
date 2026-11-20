import Link from "next/link";
import { fmt, L } from "@/lib/config";
import type { Producto } from "@/lib/mock";

export default function ProductCard({ p, tienda, puedePedir }: { p: Producto; tienda?: string; puedePedir?: boolean }) {
  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-[4/3] bg-neutral-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.img} alt={p.nombre} className="h-full w-full object-cover" />
        {p.stock === 0 && <span className="absolute left-2 top-2 rounded-full bg-neutral-900/80 px-2 py-0.5 text-xs text-white">Agotado</span>}
      </div>
      <div className="space-y-1 p-4">
        {tienda && <p className="text-xs text-neutral-500">{tienda}</p>}
        <h3 className="font-semibold leading-snug">{p.nombre}</h3>
        <div className="flex items-center justify-between pt-1">
          <span className="font-bold text-brand">{fmt(p.precio)}</span>
          <span className="text-xs text-neutral-500">Stock: {p.stock}</span>
        </div>
        {puedePedir && p.stock > 0 && <Link href={`/pedir/${p.id}`} className="btn-primary mt-2 w-full">{L.pedir}</Link>}
      </div>
    </div>
  );
}
