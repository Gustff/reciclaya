// Reglas de negocio puras (sin React) -> probadas con Vitest en tests/reglas.test.ts
import type { Estado, Horario, Pedido as Solicitud, Producto as Material, Rol, Tienda as Punto, Usuario } from "./mock";

const min = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };

/** Un punto de acopio está abierto si el día está en su horario y la hora está en [abre, cierra). */
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

/** Registro o edición de un punto de acopio (HU H03 y H08). */
export function validarPunto(t: Punto, existentes: Punto[]): string | null {
  if (!t.nombre.trim() || !t.rubro.trim() || !t.direccion.trim()) return "Nombre, distrito y dirección son obligatorios";
  if (existentes.some((x) => x.ownerId === t.ownerId && x.id !== t.id)) return "Este operador ya tiene un punto de acopio registrado";
  return validarHorario(t.horario);
}

/** Material aceptado por un punto (HU H04). */
export function validarMaterial(p: Pick<Material, "nombre" | "precio" | "stock">): string | null {
  if (!p.nombre.trim()) return "El nombre del material es obligatorio";
  if (!(p.precio > 0)) return "El pago por kg debe ser mayor a 0";
  if (!Number.isInteger(p.stock) || p.stock < 0) return "La capacidad debe ser un entero mayor o igual a 0";
  return null;
}

/** Solo el operador dueño del punto puede editar o eliminar sus materiales. */
export function puedeGestionarMaterial(m: Material | undefined, puntoDelOperador: Punto | undefined): boolean {
  return Boolean(puntoDelOperador && (!m || m.tiendaId === puntoDelOperador.id));
}

/** Un material con solicitudes activas (pendientes o asignadas) no se puede eliminar. */
export function validarEliminarMaterial(materialId: string, solicitudes: Solicitud[]): string | null {
  const activas = solicitudes.filter((o) => o.productoId === materialId && (o.estado === "pendiente" || o.estado === "aceptado")).length;
  return activas ? `No se puede eliminar: tiene ${activas} solicitud(es) activa(s)` : null;
}

/** Solicitud de recojo (HU H09): vecino activo, punto activo, kg entero >= 1 dentro de la capacidad, con dirección. */
export function validarSolicitud(m: Material | undefined, kg: number, usuario: Pick<Usuario, "rol" | "suspendido">, direccion = "x", punto?: Pick<Punto, "suspendida">): string | null {
  if (usuario.rol !== "comprador") return "Solo un vecino puede crear solicitudes de recojo";
  if (usuario.suspendido) return "Tu cuenta está suspendida";
  if (!m) return "Material no encontrado";
  if (punto?.suspendida) return "El punto de acopio está suspendido";
  if (!Number.isFinite(kg) || kg < 1) return "La cantidad debe ser al menos 1 kg";
  if (!Number.isInteger(kg)) return "La cantidad debe ser un número entero de kg";
  if (kg > m.stock) return `Capacidad insuficiente en el punto de acopio (disponible: ${m.stock} kg)`;
  if (!direccion.trim()) return "Ingrese la dirección de recojo";
  return null;
}

/** Un recolector activo solo puede tomar solicitudes pendientes y sin recolector asignado (HU H12). */
export function validarTomarRecojo(o: Solicitud, usuario: Pick<Usuario, "rol" | "suspendido">): string | null {
  if (usuario.rol !== "recolector") return "Solo un recolector puede tomar recojos";
  if (usuario.suspendido) return "Tu cuenta está suspendida";
  if (o.estado !== "pendiente" || o.recolectorId) return "La solicitud ya no está disponible";
  return null;
}

/**
 * Transiciones de estado permitidas (HU H12 y H13). Entregada y Rechazada son estados finales.
 * - Recolector: Asignada -> Entregada (tomar el recojo se valida con validarTomarRecojo).
 * - Operador: Pendiente -> Rechazada; Asignada -> Entregada | Rechazada.
 */
export function transicionesPermitidas(desde: Estado, rol: Rol): Estado[] {
  if (rol === "recolector") return desde === "aceptado" ? ["entregado"] : [];
  if (rol === "vendedor") return desde === "pendiente" ? ["rechazado"] : desde === "aceptado" ? ["entregado", "rechazado"] : [];
  return [];
}
export const transicionValida = (desde: Estado, hasta: Estado, rol: Rol) => transicionesPermitidas(desde, rol).includes(hasta);

/** Capacidad que se libera al cambiar de estado: solo rechazar devuelve la reserva. */
export function capacidadLiberada(desde: Estado, hasta: Estado, kg: number): number {
  return desde !== "rechazado" && hasta === "rechazado" ? kg : 0;
}

/** Pago estimado a los vecinos (excluye solicitudes rechazadas). */
export function pagoEstimado(solicitudes: Solicitud[]): number {
  return solicitudes.filter((o) => o.estado !== "rechazado").reduce((s, o) => s + o.cantidad * o.precioUnitario, 0);
}

/** Kg reciclados (solo solicitudes entregadas en acopio): indicador de impacto (HU H15). */
export function kgReciclados(solicitudes: Solicitud[]): number {
  return solicitudes.filter((o) => o.estado === "entregado").reduce((s, o) => s + o.cantidad, 0);
}

/** Texto sin tildes ni mayúsculas, para búsquedas ("proceres" encuentra "Próceres"). */
export const normalizar = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** Fecha local AAAA-MM-DD (no UTC). */
export const fechaLocal = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// ---------- Autenticación del MVP (H01) ----------
export const MAX_INTENTOS = 5;
export const BLOQUEO_MS = 15 * 60 * 1000;

/** Registro de cuenta: nombre, correo válido y único, contraseña de 8+ caracteres con letras y números, rol permitido. */
export function validarRegistro(d: { nombre: string; correo: string; clave: string; rol: Rol }, usuarios: Pick<Usuario, "correo">[]): string | null {
  if (!d.nombre.trim()) return "Ingrese su nombre";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.correo.trim())) return "Correo inválido";
  if (usuarios.some((u) => u.correo?.toLowerCase() === d.correo.trim().toLowerCase())) return "Ya existe una cuenta con ese correo";
  if (d.clave.length < 8 || !/[a-zA-Z]/.test(d.clave) || !/\d/.test(d.clave)) return "La contraseña debe tener al menos 8 caracteres, con letras y números";
  if (!["comprador", "recolector", "vendedor"].includes(d.rol)) return "Rol no permitido para el registro";
  return null;
}

/**
 * Inicio de sesión con bloqueo: tras MAX_INTENTOS fallidos la cuenta se bloquea BLOQUEO_MS.
 * Devuelve el error (o null si ingresa) y el nuevo estado de intentos de la cuenta.
 */
export function evaluarIngreso(u: Usuario | undefined, claveCorrecta: boolean, ahora: number): { error: string | null; intentos: number; bloqueadoHasta?: number } {
  if (!u) return { error: "Correo o contraseña incorrectos", intentos: 0 };
  if (u.bloqueadoHasta && ahora < u.bloqueadoHasta) return { error: "Cuenta bloqueada temporalmente por intentos fallidos. Intente más tarde", intentos: u.intentos ?? MAX_INTENTOS, bloqueadoHasta: u.bloqueadoHasta };
  if (claveCorrecta) return { error: null, intentos: 0 };
  const intentos = (u.bloqueadoHasta ? 0 : u.intentos ?? 0) + 1;
  if (intentos >= MAX_INTENTOS) return { error: "Cuenta bloqueada por 15 minutos tras 5 intentos fallidos", intentos, bloqueadoHasta: ahora + BLOQUEO_MS };
  return { error: `Correo o contraseña incorrectos (le quedan ${MAX_INTENTOS - intentos} intentos)`, intentos };
}

/** Hash SHA-256 (hex) de correo + contraseña; la contraseña nunca se guarda en texto plano. */
export async function hashClave(correo: string, clave: string): Promise<string> {
  const datos = new TextEncoder().encode(`${correo.trim().toLowerCase()}:${clave}`);
  const h = await crypto.subtle.digest("SHA-256", datos);
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
