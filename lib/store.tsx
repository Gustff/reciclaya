"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as M from "./mock";
import { isSupabaseOn } from "./supabase";
import { deltaStock, validarPedido, validarTienda } from "./reglas";

interface DB { usuarios: M.Usuario[]; tiendas: M.Tienda[]; productos: M.Producto[]; pedidos: M.Pedido[] }
interface Ctx extends DB {
  yo: M.Usuario; setYo: (id: string) => void; listo: boolean; fuente: "mock" | "supabase";
  guardarTienda: (t: M.Tienda) => string | null;
  guardarProducto: (p: M.Producto) => void; eliminarProducto: (id: string) => void;
  crearPedido: (productoId: string, cantidad: number) => string | null;
  cambiarEstado: (pedidoId: string, e: M.Estado) => void;
  toggleSuspension: (tipo: "usuario" | "tienda", id: string) => void;
  reset: () => void;
}
const K = "mvp-db-v2", KU = "mvp-user";
const inicial = (): DB => ({ usuarios: M.usuarios, tiendas: M.tiendas, productos: M.productos, pedidos: M.pedidos });
const C = createContext<Ctx | null>(null);
const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(inicial);
  const [yoId, setYoId] = useState(M.usuarios[0].id);
  const [listo, setListo] = useState(false);
  useEffect(() => {
    try {
      const s = localStorage.getItem(K); if (s) setDb(JSON.parse(s));
      const as = new URLSearchParams(location.search).get("as"); // ?as=<id usuario> para capturas
      const u = as ?? localStorage.getItem(KU); if (u) { setYoId(u); localStorage.setItem(KU, u); }
    } catch {}
    setListo(true);
  }, []);
  useEffect(() => { if (listo) localStorage.setItem(K, JSON.stringify(db)); }, [db, listo]);
  const yo = db.usuarios.find((u) => u.id === yoId) ?? db.usuarios[0];
  const set = (f: (d: DB) => DB) => setDb((d) => f(structuredClone(d)));

  const ctx: Ctx = {
    ...db, yo, listo, fuente: isSupabaseOn ? "supabase" : "mock",
    setYo: (id) => { setYoId(id); localStorage.setItem(KU, id); },
    guardarTienda: (t) => {
      const err = validarTienda(t, db.tiendas); if (err) return err;
      set((d) => {
        const i = d.tiendas.findIndex((x) => x.id === t.id);
        const tt = { ...t, img: t.img || M.ph(t.nombre) };
        if (i >= 0) d.tiendas[i] = tt; else d.tiendas.push({ ...tt, id: t.id || uid("s") });
        return d;
      });
      return null;
    },
    guardarProducto: (p) => set((d) => {
      const i = d.productos.findIndex((x) => x.id === p.id);
      const pp = { ...p, img: p.img || M.ph(p.nombre) };
      if (i >= 0) d.productos[i] = pp; else d.productos.push({ ...pp, id: uid("p") });
      return d;
    }),
    eliminarProducto: (id) => set((d) => ({ ...d, productos: d.productos.filter((p) => p.id !== id) })),
    crearPedido: (productoId, cantidad) => {
      const p = db.productos.find((x) => x.id === productoId);
      const err = validarPedido(p, cantidad, yo.rol); if (err || !p) return err;
      set((d) => {
        d.pedidos.unshift({ id: uid("o"), compradorId: yo.id, productoId, cantidad, precioUnitario: p.precio, estado: "pendiente", fecha: new Date().toISOString().slice(0, 10) });
        d.productos.find((x) => x.id === productoId)!.stock -= cantidad;
        return d;
      });
      return null;
    },
    cambiarEstado: (pedidoId, e) => set((d) => {
      const o = d.pedidos.find((x) => x.id === pedidoId)!;
      const prod = d.productos.find((x) => x.id === o.productoId);
      if (prod) prod.stock = Math.max(0, prod.stock + deltaStock(o.estado, e, o.cantidad));
      o.estado = e; return d;
    }),
    toggleSuspension: (tipo, id) => set((d) => {
      if (tipo === "usuario") { const u = d.usuarios.find((x) => x.id === id)!; u.suspendido = !u.suspendido; }
      else { const t = d.tiendas.find((x) => x.id === id)!; t.suspendida = !t.suspendida; }
      return d;
    }),
    reset: () => { localStorage.removeItem(K); setDb(inicial()); },
  };
  return <C.Provider value={ctx}>{children}</C.Provider>;
}
export const useStore = () => { const c = useContext(C); if (!c) throw new Error("StoreProvider"); return c; };
