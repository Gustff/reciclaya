import { describe, expect, it } from "vitest";
import { deltaStock, estaAbierto, kgReciclados, totalVentas, validarHorario, validarPedido, validarProducto, validarTienda, validarTomarRecojo } from "@/lib/reglas";
import { pedidos, productos, tiendas } from "@/lib/mock";
import type { Pedido, Tienda } from "@/lib/mock";

const conCap = productos.find((p) => p.stock > 0)!;
const lleno = { ...conCap, stock: 0 };
const H = { dias: [1, 2, 3, 4, 5, 6], abre: "08:00", cierra: "18:00" }; // Lun-Sab 08:00-18:00

describe("estaAbierto (HU: ver horario de atencion del punto)", () => {
  it("abierto un miercoles a las 10:00", () => expect(estaAbierto(H, new Date(2026, 10, 18, 10, 0))).toBe(true));
  it("cerrado un domingo", () => expect(estaAbierto(H, new Date(2026, 10, 22, 10, 0))).toBe(false));
  it("cerrado antes de abrir (07:59)", () => expect(estaAbierto(H, new Date(2026, 10, 18, 7, 59))).toBe(false));
  it("cerrado exactamente a la hora de cierre (18:00)", () => expect(estaAbierto(H, new Date(2026, 10, 18, 18, 0))).toBe(false));
});

describe("validarHorario", () => {
  it("acepta un horario valido", () => expect(validarHorario(H)).toBeNull());
  it("exige al menos un dia", () => expect(validarHorario({ ...H, dias: [] })).not.toBeNull());
  it("apertura antes del cierre", () => expect(validarHorario({ ...H, abre: "19:00" })).toMatch(/apertura/));
});

describe("validarPedido (HU: solicitar recojo de reciclables)", () => {
  it("acepta solicitud valida de un vecino", () => expect(validarPedido(conCap, 5, "comprador", "Jr. Lima 123")).toBeNull());
  it("rechaza kg mayor a la capacidad del punto", () => expect(validarPedido(conCap, conCap.stock + 1, "comprador", "x")).toMatch(/Capacidad insuficiente/));
  it("rechaza punto sin capacidad para ese material", () => expect(validarPedido(lleno, 1, "comprador", "x")).toMatch(/Capacidad insuficiente/));
  it("rechaza 0 kg, negativos o decimales", () => {
    expect(validarPedido(conCap, 0, "comprador", "x")).not.toBeNull();
    expect(validarPedido(conCap, -3, "comprador", "x")).not.toBeNull();
    expect(validarPedido(conCap, 1.5, "comprador", "x")).not.toBeNull();
  });
  it("exige direccion de recojo", () => expect(validarPedido(conCap, 2, "comprador", "  ")).toMatch(/dirección/));
  it("solo el rol vecino puede solicitar", () => {
    expect(validarPedido(conCap, 1, "recolector", "x")).not.toBeNull();
    expect(validarPedido(conCap, 1, "vendedor", "x")).not.toBeNull();
  });
});

describe("validarTomarRecojo (HU: recolector toma solicitudes)", () => {
  const pend = pedidos.find((o) => o.estado === "pendiente" && !o.recolectorId)!;
  it("un recolector puede tomar una solicitud pendiente", () => expect(validarTomarRecojo(pend, "recolector")).toBeNull());
  it("no puede tomar una ya asignada", () => expect(validarTomarRecojo({ ...pend, estado: "aceptado", recolectorId: "u-x" }, "recolector")).toMatch(/no está disponible/));
  it("un vecino no puede tomar recojos", () => expect(validarTomarRecojo(pend, "comprador")).not.toBeNull());
});

describe("validarTienda (HU: registrar punto de acopio)", () => {
  const base = tiendas[0];
  it("permite editar su propio punto", () => expect(validarTienda({ ...base, nombre: "Nuevo" }, tiendas)).toBeNull());
  it("un operador no puede registrar dos puntos", () => expect(validarTienda({ ...base, id: "nuevo" } as Tienda, tiendas)).toMatch(/ya tiene/));
  it("exige nombre, distrito y direccion", () => expect(validarTienda({ ...base, direccion: "" }, tiendas)).not.toBeNull());
  it("valida el horario", () => expect(validarTienda({ ...base, horario: { ...H, dias: [] } }, tiendas)).not.toBeNull());
});

describe("validarProducto (HU: materiales aceptados)", () => {
  it("acepta datos validos", () => expect(validarProducto({ nombre: "Vidrio", precio: 0.1, stock: 100 })).toBeNull());
  it("pago por kg > 0", () => expect(validarProducto({ nombre: "X", precio: 0, stock: 5 })).not.toBeNull());
  it("capacidad no negativa", () => expect(validarProducto({ nombre: "X", precio: 1, stock: -1 })).not.toBeNull());
});

describe("capacidad e indicadores", () => {
  it("rechazar libera la capacidad reservada", () => expect(deltaStock("pendiente", "rechazado", 10)).toBe(10));
  it("reactivar una rechazada vuelve a reservar", () => expect(deltaStock("rechazado", "aceptado", 10)).toBe(-10));
  it("asignar no cambia la capacidad", () => expect(deltaStock("pendiente", "aceptado", 10)).toBe(0));
  const ps: Pedido[] = [
    { ...pedidos[0], cantidad: 20, precioUnitario: 0.5, estado: "entregado" },
    { ...pedidos[0], cantidad: 10, precioUnitario: 0.5, estado: "rechazado" },
    { ...pedidos[0], cantidad: 4, precioUnitario: 0.5, estado: "pendiente" },
  ];
  it("pago estimado excluye rechazadas", () => expect(totalVentas(ps)).toBe(12));
  it("kg reciclados cuenta solo entregadas en acopio", () => expect(kgReciclados(ps)).toBe(20));
});
