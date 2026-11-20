import { describe, expect, it } from "vitest";
import {
  capacidadLiberada, estaAbierto, fechaLocal, kgReciclados, normalizar, pagoEstimado, puedeGestionarMaterial,
  transicionValida, validarEliminarMaterial, validarHorario, validarMaterial, validarPunto, validarSolicitud, validarTomarRecojo,
} from "@/lib/reglas";
import { pedidos, productos, tiendas } from "@/lib/mock";
import type { Pedido, Tienda } from "@/lib/mock";

const conCap = productos.find((p) => p.stock > 0)!;
const lleno = { ...conCap, stock: 0 };
const vecino = { rol: "comprador" as const };
const H = { dias: [1, 2, 3, 4, 5, 6], abre: "08:00", cierra: "18:00" }; // lunes a sábado, 08:00-18:00

describe("estaAbierto (H06: horario de atención)", () => {
  it("abierto un miércoles a las 10:00", () => expect(estaAbierto(H, new Date(2026, 10, 18, 10, 0))).toBe(true));
  it("cerrado un domingo", () => expect(estaAbierto(H, new Date(2026, 10, 22, 10, 0))).toBe(false));
  it("cerrado antes de abrir (07:59)", () => expect(estaAbierto(H, new Date(2026, 10, 18, 7, 59))).toBe(false));
  it("cerrado exactamente a la hora de cierre (18:00)", () => expect(estaAbierto(H, new Date(2026, 10, 18, 18, 0))).toBe(false));
});

describe("validarHorario (H03, H08)", () => {
  it("acepta un horario válido", () => expect(validarHorario(H)).toBeNull());
  it("exige al menos un día", () => expect(validarHorario({ ...H, dias: [] })).not.toBeNull());
  it("la apertura debe ser antes del cierre", () => expect(validarHorario({ ...H, abre: "19:00" })).toMatch(/apertura/));
});

describe("validarSolicitud (H09: solicitar recojo)", () => {
  it("acepta una solicitud válida de un vecino", () => expect(validarSolicitud(conCap, 5, vecino, "Jr. Lima 123")).toBeNull());
  it("rechaza kg mayores a la capacidad del punto", () => expect(validarSolicitud(conCap, conCap.stock + 1, vecino)).toMatch(/Capacidad insuficiente/));
  it("rechaza un material sin capacidad", () => expect(validarSolicitud(lleno, 1, vecino)).toMatch(/Capacidad insuficiente/));
  it("rechaza 0 kg y valores negativos", () => {
    expect(validarSolicitud(conCap, 0, vecino)).toMatch(/al menos 1 kg/);
    expect(validarSolicitud(conCap, -3, vecino)).toMatch(/al menos 1 kg/);
  });
  it("rechaza kg decimales con un mensaje claro", () => expect(validarSolicitud(conCap, 2.5, vecino)).toMatch(/entero/));
  it("exige la dirección de recojo", () => expect(validarSolicitud(conCap, 2, vecino, "  ")).toMatch(/dirección/));
  it("solo el rol vecino puede solicitar", () => {
    expect(validarSolicitud(conCap, 1, { rol: "recolector" })).not.toBeNull();
    expect(validarSolicitud(conCap, 1, { rol: "vendedor" })).not.toBeNull();
  });
  it("un vecino suspendido no puede solicitar (H14)", () => expect(validarSolicitud(conCap, 1, { ...vecino, suspendido: true })).toMatch(/suspendida/));
  it("no se puede solicitar a un punto suspendido (H14)", () => expect(validarSolicitud(conCap, 1, vecino, "x", { suspendida: true })).toMatch(/suspendido/));
});

describe("validarTomarRecojo (H12: el recolector toma solicitudes)", () => {
  const pend = pedidos.find((o) => o.estado === "pendiente" && !o.recolectorId)!;
  const rec = { rol: "recolector" as const };
  it("un recolector puede tomar una solicitud pendiente", () => expect(validarTomarRecojo(pend, rec)).toBeNull());
  it("no puede tomar una solicitud ya asignada", () => expect(validarTomarRecojo({ ...pend, estado: "aceptado", recolectorId: "u-x" }, rec)).toMatch(/no está disponible/));
  it("un vecino no puede tomar recojos", () => expect(validarTomarRecojo(pend, vecino)).not.toBeNull());
  it("un recolector suspendido no puede tomar recojos (H14)", () => expect(validarTomarRecojo(pend, { ...rec, suspendido: true })).toMatch(/suspendida/));
});

describe("transicionValida (H12, H13: estados de la solicitud)", () => {
  it("el recolector marca como entregada una solicitud asignada", () => expect(transicionValida("aceptado", "entregado", "recolector")).toBe(true));
  it("el operador puede rechazar una pendiente", () => expect(transicionValida("pendiente", "rechazado", "vendedor")).toBe(true));
  it("el operador no puede asignar sin recolector", () => expect(transicionValida("pendiente", "aceptado", "vendedor")).toBe(false));
  it("entregada y rechazada son estados finales", () => {
    expect(transicionValida("entregado", "rechazado", "vendedor")).toBe(false);
    expect(transicionValida("rechazado", "pendiente", "vendedor")).toBe(false);
  });
  it("un vecino no cambia estados", () => expect(transicionValida("pendiente", "rechazado", "comprador")).toBe(false));
});

describe("validarPunto (H03: registrar punto de acopio)", () => {
  const base = tiendas[0];
  it("permite editar su propio punto", () => expect(validarPunto({ ...base, nombre: "Nuevo" }, tiendas)).toBeNull());
  it("un operador no puede registrar dos puntos", () => expect(validarPunto({ ...base, id: "nuevo" } as Tienda, tiendas)).toMatch(/ya tiene/));
  it("exige nombre, distrito y dirección", () => expect(validarPunto({ ...base, direccion: "" }, tiendas)).not.toBeNull());
  it("valida el horario", () => expect(validarPunto({ ...base, horario: { ...H, dias: [] } }, tiendas)).not.toBeNull());
});

describe("materiales (H04: materiales aceptados)", () => {
  it("acepta datos válidos", () => expect(validarMaterial({ nombre: "Vidrio", precio: 0.1, stock: 100 })).toBeNull());
  it("el pago por kg debe ser mayor a 0", () => expect(validarMaterial({ nombre: "X", precio: 0, stock: 5 })).not.toBeNull());
  it("la capacidad no puede ser negativa", () => expect(validarMaterial({ nombre: "X", precio: 1, stock: -1 })).not.toBeNull());
  it("un operador no puede editar materiales de otro punto", () => expect(puedeGestionarMaterial(productos.find((p) => p.tiendaId === tiendas[0].id), tiendas[1])).toBe(false));
  it("no se elimina un material con solicitudes activas", () => expect(validarEliminarMaterial("p-pet-surco", pedidos)).toMatch(/activa/));
});

describe("capacidad e indicadores (H13, H15)", () => {
  it("rechazar libera la capacidad reservada", () => expect(capacidadLiberada("pendiente", "rechazado", 10)).toBe(10));
  it("entregar no cambia la capacidad", () => expect(capacidadLiberada("aceptado", "entregado", 10)).toBe(0));
  const ps: Pedido[] = [
    { ...pedidos[0], cantidad: 20, precioUnitario: 0.5, estado: "entregado" },
    { ...pedidos[0], cantidad: 10, precioUnitario: 0.5, estado: "rechazado" },
    { ...pedidos[0], cantidad: 4, precioUnitario: 0.5, estado: "pendiente" },
  ];
  it("el pago estimado excluye las rechazadas", () => expect(pagoEstimado(ps)).toBe(12));
  it("los kg reciclados cuentan solo lo entregado en acopio", () => expect(kgReciclados(ps)).toBe(20));
});

describe("utilidades", () => {
  it("la búsqueda ignora tildes", () => expect(normalizar("Av. Próceres")).toContain("proceres"));
  it("la fecha se guarda en hora local", () => expect(fechaLocal(new Date(2026, 10, 19, 22, 0))).toBe("2026-11-19"));
});
