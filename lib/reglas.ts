// Reglas de negocio puras (sin React) -> faciles de probar con pruebas unitarias.
import type { Estado, Pedido, Producto, Rol, Tienda } from "./mock";

export function validarTienda(t: Tienda, existentes: Tienda[]): string | null {
  if (!t.nombre.trim() || !t.rubro.trim()) return "Nombre y rubro son obligatorios";
  if (existentes.some((x) => x.ownerId === t.ownerId && x.id !== t.id)) return "Este vendedor ya tiene una tienda registrada";
  return null;
}

export function validarProducto(p: Pick<Producto, "nombre" | "precio" | "stock">): string | null {
  if (!p.nombre.trim()) return "El nombre es obligatorio";
  if (!(p.precio > 0)) return "El precio debe ser mayor a 0";
  if (!Number.isInteger(p.stock) || p.stock < 0) return "El stock debe ser un entero mayor o igual a 0";
  return null;
}

export function validarPedido(p: Producto | undefined, cantidad: number, rol: Rol): string | null {
  if (rol !== "comprador") return "Solo un comprador puede crear pedidos";
  if (!p) return "Producto no encontrado";
  if (!Number.isInteger(cantidad) || cantidad < 1) return "La cantidad debe ser al menos 1";
  if (cantidad > p.stock) return `Stock insuficiente (disponible: ${p.stock})`;
  return null;
}

/** Cuanto cambia el stock al pasar un pedido de un estado a otro (rechazar devuelve stock). */
export function deltaStock(antes: Estado, despues: Estado, cantidad: number): number {
  const reservado = (e: Estado) => e !== "rechazado";
  if (reservado(antes) && !reservado(despues)) return cantidad;
  if (!reservado(antes) && reservado(despues)) return -cantidad;
  return 0;
}

export function totalVentas(pedidos: Pedido[]): number {
  return pedidos.filter((o) => o.estado !== "rechazado").reduce((s, o) => s + o.cantidad * o.precioUnitario, 0);
}
