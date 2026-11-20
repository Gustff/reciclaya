// Datos de prueba (mock) del MVP ReciclaYa
export type Rol = "comprador" | "vendedor" | "recolector" | "admin"; // comprador=vecino, vendedor=operador de acopio
export type Estado = "pendiente" | "aceptado" | "rechazado" | "entregado";
export interface Horario { dias: number[]; abre: string; cierra: string } // dias: 0=Dom ... 6=Sab
export interface Usuario { id: string; nombre: string; rol: Rol; suspendido?: boolean }
export interface Tienda { id: string; ownerId: string; nombre: string; rubro: string; direccion: string; horario: Horario; img: string; suspendida?: boolean }
export interface Producto { id: string; tiendaId: string; nombre: string; descripcion: string; precio: number; stock: number; img: string }
export interface Pedido { id: string; compradorId: string; productoId: string; cantidad: number; precioUnitario: number; estado: Estado; fecha: string; direccion: string; recolectorId?: string }

// Imagenes de producto generadas (SVG local): fondo degradado suave + icono del material. Nunca fallan al cargar.
const ICONOS: [RegExp, string, string, string][] = [
  [/cart[oó]n|papel/i, "📦", "#f6efe4", "#e9dcc6"], [/pet|pl[aá]stico/i, "🧴", "#e6f3fb", "#cfe6f5"],
  [/vidrio/i, "🍾", "#e8f6ee", "#cdebd9"], [/metal|lata/i, "🥫", "#f1f1f4", "#dcdce3"],
  [/electr[oó]n|raee/i, "📱", "#ecebfb", "#d8d6f5"],
];
export const ph = (texto: string) => {
  const [, ico, a, b] = ICONOS.find(([r]) => r.test(texto)) ?? [/./, "♻️", "#e8f6ee", "#cdebd9"];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450"><defs><radialGradient id="g" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient></defs><rect width="600" height="450" fill="url(#g)"/><ellipse cx="300" cy="352" rx="120" ry="16" fill="#000" opacity=".07"/><text x="300" y="285" font-size="190" text-anchor="middle">${ico}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

/** Ilustración del hero: anillo luminoso con los materiales orbitando. */
export const heroArt = () => {
  const items = [["📦", 300, 70], ["🧴", 510, 230], ["🍾", 420, 420], ["🥫", 180, 420], ["📱", 90, 230]];
  const orb = items.map(([i, x, y]) => `<g><circle cx="${x}" cy="${y}" r="52" fill="#ffffff" fill-opacity=".07" stroke="#ffffff" stroke-opacity=".18"/><text x="${x}" y="${Number(y) + 20}" font-size="54" text-anchor="middle">${i}</text></g>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500"><defs><radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#00e08a" stop-opacity=".55"/><stop offset=".6" stop-color="#00a862" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient><linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7cffc4"/><stop offset="1" stop-color="#00a862"/></linearGradient></defs><rect width="600" height="500" fill="#000"/><circle cx="300" cy="250" r="240" fill="url(#glow)"/><circle cx="300" cy="250" r="180" fill="none" stroke="url(#ring)" stroke-width="3" stroke-dasharray="6 10" opacity=".6"/><circle cx="300" cy="250" r="105" fill="#0b0b0b" stroke="url(#ring)" stroke-width="6"/><text x="300" y="285" font-size="96" text-anchor="middle" fill="#7cffc4">♻</text>${orb}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const LUN_SAB = [1, 2, 3, 4, 5, 6];
export const usuarios: Usuario[] = [
  { id: "u-lucia", nombre: "Lucia Paredes", rol: "comprador" },
  { id: "u-bodega", nombre: "Bodega Don Pepe", rol: "comprador" },
  { id: "u-juan", nombre: "Juan Ccori", rol: "recolector" },
  { id: "u-maria", nombre: "Maria Quispe", rol: "recolector" },
  { id: "u-carlos", nombre: "Carlos Rivera", rol: "vendedor" },
  { id: "u-rosa", nombre: "Rosa Diaz", rol: "vendedor" },
  { id: "u-ana", nombre: "Ana Torres", rol: "vendedor" },
  { id: "u-admin", nombre: "Admin. Municipal", rol: "admin" },
];
export const tiendas: Tienda[] = [
  { id: "s-ecoacopio-surco", ownerId: "u-carlos", nombre: "EcoAcopio Surco", rubro: "Santiago de Surco", direccion: "Av. Caminos del Inca 1250", horario: { dias: LUN_SAB, abre: "08:00", cierra: "18:00" }, img: ph("EcoAcopio Surco") },
  { id: "s-recicla-miraflores", ownerId: "u-rosa", nombre: "Recicla Miraflores", rubro: "Miraflores", direccion: "Calle Schell 420", horario: { dias: [1, 2, 3, 4, 5], abre: "09:00", cierra: "17:00" }, img: ph("Recicla Miraflores") },
  { id: "s-punto-verde-sjl", ownerId: "u-ana", nombre: "Punto Verde SJL", rubro: "San Juan de Lurigancho", direccion: "Av. Próceres 3100", horario: { dias: [0, 1, 2, 3, 4, 5, 6], abre: "07:00", cierra: "20:00" }, img: ph("Punto Verde SJL") },
];
export const productos: Producto[] = [
  { id: "p-carton-surco", tiendaId: "s-ecoacopio-surco", nombre: "Papel y cartón", descripcion: "Cajas plegadas, periódicos y papel bond. Seco y sin grasa.", precio: 0.4, stock: 800, img: ph("Papel y cartón") },
  { id: "p-pet-surco", tiendaId: "s-ecoacopio-surco", nombre: "Plástico PET", descripcion: "Botellas de bebidas, enjuagadas y aplastadas.", precio: 0.8, stock: 500, img: ph("Plástico PET") },
  { id: "p-vidrio-surco", tiendaId: "s-ecoacopio-surco", nombre: "Vidrio", descripcion: "Botellas y frascos sin tapa. No se recibe vidrio plano.", precio: 0.1, stock: 0, img: ph("Vidrio") },
  { id: "p-latas-miraflores", tiendaId: "s-recicla-miraflores", nombre: "Metal y latas", descripcion: "Latas de aluminio y conservas limpias.", precio: 1.5, stock: 300, img: ph("Metal y latas") },
  { id: "p-raee-miraflores", tiendaId: "s-recicla-miraflores", nombre: "Electrónicos (RAEE)", descripcion: "Celulares, cargadores, laptops y pequeños electrodomésticos.", precio: 0.5, stock: 150, img: ph("Electronicos RAEE") },
  { id: "p-pet-sjl", tiendaId: "s-punto-verde-sjl", nombre: "Plástico PET", descripcion: "Botellas PET transparentes y de color.", precio: 0.7, stock: 1200, img: ph("Plástico PET SJL") },
  { id: "p-carton-sjl", tiendaId: "s-punto-verde-sjl", nombre: "Papel y cartón", descripcion: "Carton corrugado y papel mixto.", precio: 0.35, stock: 1500, img: ph("Papel y cartón SJL") },
];
export const pedidos: Pedido[] = [
  { id: "o-1", compradorId: "u-lucia", productoId: "p-pet-surco", cantidad: 12, precioUnitario: 0.8, estado: "pendiente", fecha: "2026-11-18", direccion: "Jr. Monte Rosa 145, Surco" },
  { id: "o-2", compradorId: "u-lucia", productoId: "p-carton-surco", cantidad: 25, precioUnitario: 0.4, estado: "aceptado", fecha: "2026-11-17", direccion: "Jr. Monte Rosa 145, Surco", recolectorId: "u-juan" },
  { id: "o-3", compradorId: "u-bodega", productoId: "p-carton-sjl", cantidad: 60, precioUnitario: 0.35, estado: "entregado", fecha: "2026-11-15", direccion: "Av. Wiesse 820, SJL", recolectorId: "u-maria" },
  { id: "o-4", compradorId: "u-bodega", productoId: "p-pet-sjl", cantidad: 30, precioUnitario: 0.7, estado: "pendiente", fecha: "2026-11-19", direccion: "Av. Wiesse 820, SJL" },
];
