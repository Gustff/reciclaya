"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as M from "./mock";
import { isSupabaseOn } from "./supabase";
import { capacidadLiberada, fechaLocal, puedeGestionarMaterial, transicionValida, validarEliminarMaterial, validarPunto, validarSolicitud, validarTomarRecojo } from "./reglas";

interface DB { usuarios: M.Usuario[]; tiendas: M.Tienda[]; productos: M.Producto[]; pedidos: M.Pedido[] }
interface Ctx extends DB {
  yo: M.Usuario; setYo: (id: string) => void; listo: boolean; fuente: "mock" | "supabase";
  guardarTienda: (t: M.Tienda) => string | null;
  guardarProducto: (p: M.Producto) => string | null; eliminarProducto: (id: string) => string | null;
  crearPedido: (productoId: string, kg: number, direccion: string) => string | null;
  cambiarEstado: (pedidoId: string, e: M.Estado) => string | null;
  tomarRecojo: (pedidoId: string) => string | null;
  toggleSuspension: (tipo: "usuario" | "tienda", id: string) => void;
  reset: () => void;
}
const K = "reciclaya-db-v2", KU = "reciclaya-user";
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
      const as = new URLSearchParams(location.search).get("as"); // ?as=<id usuario> (capturas / demo)
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
      const err = validarPunto(t, db.tiendas); if (err) return err;
      set((d) => {
        const i = d.tiendas.findIndex((x) => x.id === t.id);
        const tt = { ...t, img: t.img || M.ph(t.nombre) };
        if (i >= 0) d.tiendas[i] = tt; else d.tiendas.push({ ...tt, id: uid("s") });
        return d;
      });
      return null;
    },
    guardarProducto: (p) => {
      const miPunto = db.tiendas.find((t) => t.ownerId === yo.id);
      const existente = db.productos.find((x) => x.id === p.id);
      if (yo.rol !== "vendedor" || !puedeGestionarMaterial(existente, miPunto)) return "No autorizado: el material pertenece a otro punto de acopio";
      set((d) => {
        const i = d.productos.findIndex((x) => x.id === p.id);
        const pp = { ...p, tiendaId: miPunto!.id, img: p.img || M.ph(p.nombre) };
        if (i >= 0) d.productos[i] = pp; else d.productos.push({ ...pp, id: uid("p") });
        return d;
      });
      return null;
    },
    eliminarProducto: (id) => {
      const miPunto = db.tiendas.find((t) => t.ownerId === yo.id);
      if (yo.rol !== "vendedor" || !puedeGestionarMaterial(db.productos.find((x) => x.id === id), miPunto)) return "No autorizado";
      const err = validarEliminarMaterial(id, db.pedidos); if (err) return err;
      set((d) => ({ ...d, productos: d.productos.filter((p) => p.id !== id) }));
      return null;
    },
    crearPedido: (productoId, kg, direccion) => {
      const p = db.productos.find((x) => x.id === productoId);
      const punto = db.tiendas.find((t) => t.id === p?.tiendaId);
      const err = validarSolicitud(p, kg, yo, direccion, punto); if (err || !p) return err;
      set((d) => {
        d.pedidos.unshift({ id: uid("o"), compradorId: yo.id, productoId, cantidad: kg, precioUnitario: p.precio, estado: "pendiente", fecha: fechaLocal(), direccion: direccion.trim() });
        d.productos.find((x) => x.id === productoId)!.stock -= kg;
        return d;
      });
      return null;
    },
    cambiarEstado: (pedidoId, e) => {
      const o = db.pedidos.find((x) => x.id === pedidoId);
      if (!o) return "Solicitud no encontrada";
      if (yo.suspendido) return "Tu cuenta está suspendida";
      if (!transicionValida(o.estado, e, yo.rol)) return "Cambio de estado no permitido";
      if (yo.rol === "recolector" && o.recolectorId !== yo.id) return "La solicitud no está asignada a ti";
      set((d) => {
        const x = d.pedidos.find((p) => p.id === pedidoId)!;
        const prod = d.productos.find((p) => p.id === x.productoId);
        if (prod) prod.stock += capacidadLiberada(x.estado, e, x.cantidad);
        x.estado = e; return d;
      });
      return null;
    },
    tomarRecojo: (pedidoId) => {
      const o = db.pedidos.find((x) => x.id === pedidoId);
      if (!o) return "Solicitud no encontrada";
      const err = validarTomarRecojo(o, yo); if (err) return err;
      set((d) => { const x = d.pedidos.find((p) => p.id === pedidoId)!; x.estado = "aceptado"; x.recolectorId = yo.id; return d; });
      return null;
    },
    toggleSuspension: (tipo, id) => set((d) => {
      if (tipo === "usuario") { const u = d.usuarios.find((x) => x.id === id)!; u.suspendido = !u.suspendido; }
      else { const t = d.tiendas.find((x) => x.id === id)!; t.suspendida = !t.suspendida; }
      return d;
    }),
    reset: () => { localStorage.removeItem(K); setDb(inicial()); },
  };
  // No se muestra nada hasta cargar los datos guardados: evita formularios con valores viejos del mock.
  if (!listo) return <C.Provider value={ctx}><div className="mx-auto max-w-7xl px-6 py-24 text-center text-neutral-400">Cargando…</div></C.Provider>;
  return <C.Provider value={ctx}>{children}</C.Provider>;
}
export const useStore = () => { const c = useContext(C); if (!c) throw new Error("StoreProvider"); return c; };
