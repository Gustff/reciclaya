import { describe, expect, it } from "vitest";
import { deltaStock, totalVentas, validarPedido, validarProducto, validarTienda } from "@/lib/reglas";
import { pedidos, productos, tiendas } from "@/lib/mock";
import type { Pedido, Tienda } from "@/lib/mock";

const conStock = productos.find((p) => p.stock > 0)!;
const agotado = { ...conStock, stock: 0 };

describe("validarPedido (criterio: crear pedido validando stock)", () => {
  it("acepta un pedido valido de un comprador", () => expect(validarPedido(conStock, 1, "comprador")).toBeNull());
  it("rechaza cantidad mayor al stock", () => expect(validarPedido(conStock, conStock.stock + 1, "comprador")).toMatch(/Stock insuficiente/));
  it("rechaza producto agotado", () => expect(validarPedido(agotado, 1, "comprador")).toMatch(/Stock insuficiente/));
  it("rechaza cantidad 0, negativa o decimal", () => {
    expect(validarPedido(conStock, 0, "comprador")).not.toBeNull();
    expect(validarPedido(conStock, -2, "comprador")).not.toBeNull();
    expect(validarPedido(conStock, 1.5, "comprador")).not.toBeNull();
  });
  it("solo el rol comprador puede pedir", () => {
    expect(validarPedido(conStock, 1, "vendedor")).not.toBeNull();
    expect(validarPedido(conStock, 1, "admin")).not.toBeNull();
  });
  it("producto inexistente", () => expect(validarPedido(undefined, 1, "comprador")).toMatch(/no encontrado/));
});

describe("validarTienda (criterio: un vendedor no puede tener dos tiendas)", () => {
  const base = tiendas[0];
  it("permite editar su propia tienda", () => expect(validarTienda({ ...base, nombre: "Nuevo" }, tiendas)).toBeNull());
  it("bloquea una segunda tienda del mismo vendedor", () => {
    const otra: Tienda = { ...base, id: "nueva" };
    expect(validarTienda(otra, tiendas)).toMatch(/ya tiene/);
  });
  it("exige nombre y rubro", () => expect(validarTienda({ ...base, nombre: " " }, tiendas)).not.toBeNull());
});

describe("validarProducto", () => {
  it("acepta datos validos", () => expect(validarProducto({ nombre: "X", precio: 10, stock: 5 })).toBeNull());
  it("precio debe ser > 0", () => expect(validarProducto({ nombre: "X", precio: 0, stock: 5 })).not.toBeNull());
  it("stock no negativo", () => expect(validarProducto({ nombre: "X", precio: 1, stock: -1 })).not.toBeNull());
  it("nombre obligatorio", () => expect(validarProducto({ nombre: "", precio: 1, stock: 1 })).not.toBeNull());
});

describe("deltaStock (rechazar devuelve stock)", () => {
  it("pendiente -> rechazado devuelve", () => expect(deltaStock("pendiente", "rechazado", 3)).toBe(3));
  it("rechazado -> aceptado vuelve a descontar", () => expect(deltaStock("rechazado", "aceptado", 3)).toBe(-3));
  it("pendiente -> aceptado no cambia", () => expect(deltaStock("pendiente", "aceptado", 3)).toBe(0));
});

describe("totalVentas", () => {
  it("no suma pedidos rechazados", () => {
    const ps: Pedido[] = [
      { ...pedidos[0], cantidad: 2, precioUnitario: 10, estado: "aceptado" },
      { ...pedidos[0], cantidad: 5, precioUnitario: 10, estado: "rechazado" },
    ];
    expect(totalVentas(ps)).toBe(20);
  });
});
