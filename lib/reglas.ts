// Reglas de negocio puras (sin React) -> probadas con Vitest en tests/reglas.test.ts
import type { Estado, Horario, Pedido, Producto, Rol, Tienda } from "./mock";

const min = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };

/** Un punto de acopio está abierto si el dia esta en su horario y la hora esta en [abre, cierra). */
export function estaAbierto(h: Horario, fecha: Date): boolean {
  if (!h.dias.includes(fecha.getDay())) return false;
  const ahora = fecha.getHours() * 60 + fecha.getMinutes();
  return ahora >= min(h.abre) && ahora < min(h.cierra);
}

export function validarHorario(h: Horario): string | null {
  if (h.dias.length === 0) return "Seleccione al menos un día de atención";
  if (!/^\d{2}:\d{2}$/.test(h.abre) || !/^\d{2}:\d{2}$/.test(h.cierra)) return "Formato de hora inválido (HH:MM)";
  if (min(h.abre) >= min(h.cierra)) return "La hora de apertura debe ser menor a la de cierre";
  return null;
}

export function validarTienda(t: Tienda, existentes: Tienda[]): string | null {
  if (!t.nombre.trim() || !t.rubro.trim() || !t.direccion.trim()) return "Nombre, distrito y dirección son obligatorios";
  if (existentes.some((x) => x.ownerId === t.ownerId && x.id !== t.id)) return "Este operador ya tiene un punto de acopio registrado";
  return validarHorario(t.horario);
}

export function validarProducto(p: Pick<Producto, "nombre" | "precio" | "stock">): string | null {
  if (!p.nombre.trim()) return "El nombre del material es obligatorio";
  if (!(p.precio > 0)) return "El pago por kg debe ser mayor a 0";
  if (!Number.isInteger(p.stock) || p.stock < 0) return "La capacidad debe ser un entero mayor o igual a 0";
  return null;
}

/** Solicitud de recojo: solo vecinos, kg entero >= 1, sin superar la capacidad del punto y con direccion. */
export function validarPedido(p: Producto | undefined, kg: number, rol: Rol, direccion = "x"): string | null {
  if (rol !== "comprador") return "Solo un vecino puede crear solicitudes de recojo";
  if (!p) return "Material no encontrado";
  if (!Number.isInteger(kg) || kg < 1) return "La cantidad debe ser al menos 1 kg";
  if (kg > p.stock) return `Capacidad insuficiente en el punto de acopio (disponible: ${p.stock} kg)`;
  if (!direccion.trim()) return "Ingrese la dirección de recojo";
  return null;
}

/** Un recolector solo puede tomar solicitudes pendientes y sin recolector asignado. */
export function validarTomarRecojo(o: Pedido, rol: Rol): string | null {
  if (rol !== "recolector") return "Solo un recolector puede tomar recojos";
  if (o.estado !== "pendiente" || o.recolectorId) return "La solicitud ya no está disponible";
  return null;
}

/** Cambio de capacidad al pasar de un estado a otro (rechazar libera la capacidad reservada). */
export function deltaStock(antes: Estado, despues: Estado, cantidad: number): number {
  const reservado = (e: Estado) => e !== "rechazado";
  if (reservado(antes) && !reservado(despues)) return cantidad;
  if (!reservado(antes) && reservado(despues)) return -cantidad;
  return 0;
}

export function totalVentas(pedidos: Pedido[]): number {
  return pedidos.filter((o) => o.estado !== "rechazado").reduce((s, o) => s + o.cantidad * o.precioUnitario, 0);
}

/** Kg reciclados (solo solicitudes entregadas en acopio): indicador de impacto. */
export function kgReciclados(pedidos: Pedido[]): number {
  return pedidos.filter((o) => o.estado === "entregado").reduce((s, o) => s + o.cantidad, 0);
}
