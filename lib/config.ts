// ===== EDITAR ESTO PARA CADA CASO =====
export const APP = {
  nombre: "Gamarra",          // primera parte del logo
  acento: "Ya",               // segunda parte (color de marca)
  titulo: "El emporio de Gamarra,",
  tituloAcento: "en un solo lugar",
  subtitulo: "Telas, confecciones y tejidos al por mayor y menor. Busca, compara y pide directo al vendedor.",
  heroImg: "", // vacio = ilustracion generada; o pegar URL de foto
  moneda: "S/",
};
// Vocabulario del dominio (ej. Tienda->Clinica, Producto->Servicio, Pedido->Cita)
export const L = {
  tienda: "Tienda", tiendas: "Tiendas",
  producto: "Producto", productos: "Productos",
  pedido: "Pedido", pedidos: "Pedidos", misPedidos: "Mis pedidos",
  rubro: "Rubro", rubros: "Rubros",
  comprador: "Comprador", vendedor: "Vendedor", admin: "Administrador",
  pedir: "Pedir",
  recibidos: "recibidos",   // concordancia: Citas -> "recibidas"
  ventas: "Ventas",         // ej. "Ingresos"
};
export const ESTADOS = ["pendiente", "aceptado", "rechazado", "entregado"] as const;
export const fmt = (n: number) => `${APP.moneda} ${n.toFixed(2)}`;
