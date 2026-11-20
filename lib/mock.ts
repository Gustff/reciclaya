// ===== DATOS DE PRUEBA (mock) — reemplazar por los del caso =====
export type Rol = "comprador" | "vendedor" | "admin";
export type Estado = "pendiente" | "aceptado" | "rechazado" | "entregado";
export interface Usuario { id: string; nombre: string; rol: Rol; suspendido?: boolean }
export interface Tienda { id: string; ownerId: string; nombre: string; rubro: string; direccion: string; img: string; suspendida?: boolean }
export interface Producto { id: string; tiendaId: string; nombre: string; descripcion: string; precio: number; stock: number; img: string }
export interface Pedido { id: string; compradorId: string; productoId: string; cantidad: number; precioUnitario: number; estado: Estado; fecha: string }

// Imagen placeholder local (SVG) -> nunca falla al cargar ni en capturas
const PAL = [["#fb923c", "#c2410c"], ["#38bdf8", "#0369a1"], ["#a78bfa", "#6d28d9"], ["#34d399", "#047857"], ["#f472b6", "#be185d"], ["#facc15", "#a16207"]];
export const ph = (texto: string) => {
  const h = [...texto].reduce((a, c) => a + c.charCodeAt(0), 0);
  const [a, b] = PAL[h % PAL.length];
  const words = texto.replace(/\(.*\)/, "").trim().split(/\s+/);
  const ini = words.slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="600" height="450" fill="url(#g)"/><circle cx="480" cy="90" r="140" fill="#fff" opacity=".08"/><circle cx="90" cy="400" r="110" fill="#fff" opacity=".08"/><text x="300" y="250" font-family="Helvetica,Arial" font-size="140" font-weight="700" fill="#fff" fill-opacity=".9" text-anchor="middle">${ini}</text><text x="300" y="330" font-family="Helvetica,Arial" font-size="30" fill="#fff" fill-opacity=".85" text-anchor="middle">${texto.replace(/&/g, "&amp;").replace(/</g, "")}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const usuarios: Usuario[] = [
  { id: "u-andrea", nombre: "Andrea Flores", rol: "comprador" },
  { id: "u-jorge", nombre: "Jorge Quispe", rol: "comprador" },
  { id: "u-rosa", nombre: "Rosa Huaman", rol: "vendedor" },
  { id: "u-luis", nombre: "Luis Mamani", rol: "vendedor" },
  { id: "u-carmen", nombre: "Carmen Rojas", rol: "vendedor" },
  { id: "u-admin", nombre: "Admin", rol: "admin" },
];
export const tiendas: Tienda[] = [
  { id: "s-textiles-rosa", ownerId: "u-rosa", nombre: "Textiles Rosa", rubro: "Telas", direccion: "Jr. Gamarra 650, Stand 12", img: ph("Textiles Rosa") },
  { id: "s-confecciones-luis", ownerId: "u-luis", nombre: "Confecciones Mamani", rubro: "Confecciones", direccion: "Av. Aviacion 820, Int. 104", img: ph("Confecciones Mamani") },
  { id: "s-tejidos-carmen", ownerId: "u-carmen", nombre: "Tejidos Carmen", rubro: "Tejidos", direccion: "Jr. Antonio Bazo 1020", img: ph("Tejidos Carmen") },
];
export const productos: Producto[] = [
  { id: "p-casimir-azul", tiendaId: "s-textiles-rosa", nombre: "Casimir azul marino (metro)", descripcion: "Casimir para sastreria, 1.50 m de ancho.", precio: 38.5, stock: 120, img: ph("Casimir azul marino (metro)") },
  { id: "p-polialgodon", tiendaId: "s-textiles-rosa", nombre: "Polialgodon gris jaspe (metro)", descripcion: "Ideal para polos y buzos.", precio: 11.5, stock: 300, img: ph("Polialgodon gris jaspe (metro)") },
  { id: "p-algodon-blanco", tiendaId: "s-textiles-rosa", nombre: "Algodon pima blanco (metro)", descripcion: "Algodon pima peruano 30/1.", precio: 19.9, stock: 0, img: ph("Algodon pima blanco (metro)") },
  { id: "p-polo-pima", tiendaId: "s-confecciones-luis", nombre: "Polo pima cuello redondo", descripcion: "Tallas S a XL. Precio por mayor desde 12 unidades.", precio: 18.5, stock: 240, img: ph("Polo pima cuello redondo") },
  { id: "p-jean-clasico", tiendaId: "s-confecciones-luis", nombre: "Jean clasico denim", descripcion: "Denim 12 oz, corte recto.", precio: 45, stock: 80, img: ph("Jean clasico denim") },
  { id: "p-casaca", tiendaId: "s-confecciones-luis", nombre: "Casaca cortaviento", descripcion: "Impermeable, con capucha.", precio: 65, stock: 35, img: ph("Casaca cortaviento") },
  { id: "p-chompa-alpaca", tiendaId: "s-tejidos-carmen", nombre: "Chompa de alpaca", descripcion: "Tejido a mano, 100% alpaca.", precio: 120, stock: 15, img: ph("Chompa de alpaca") },
  { id: "p-chalina", tiendaId: "s-tejidos-carmen", nombre: "Chalina tejida", descripcion: "Colores surtidos.", precio: 35, stock: 60, img: ph("Chalina tejida") },
];
export const pedidos: Pedido[] = [
  { id: "o-1", compradorId: "u-andrea", productoId: "p-casimir-azul", cantidad: 10, precioUnitario: 38.5, estado: "pendiente", fecha: "2026-06-20" },
  { id: "o-2", compradorId: "u-andrea", productoId: "p-polo-pima", cantidad: 24, precioUnitario: 18.5, estado: "aceptado", fecha: "2026-06-21" },
  { id: "o-3", compradorId: "u-jorge", productoId: "p-polialgodon", cantidad: 50, precioUnitario: 11.5, estado: "entregado", fecha: "2026-06-22" },
];
