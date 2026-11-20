// Configuracion del dominio: ReciclaYa (caso "Recolectores y reciclaje")
export const APP = {
  nombre: "Recicla",
  acento: "Ya",
  titulo: "Recicla cerca de ti,",
  tituloAcento: "sin que nada se pierda",
  subtitulo: "Encuentra puntos de acopio por material y horario, solicita el recojo de tus reciclables y conecta con recolectores de tu zona.",
  heroImg: "",
  moneda: "S/",
};
export const L = {
  tienda: "Punto de acopio", tiendas: "Puntos de acopio",
  producto: "Material", productos: "Materiales",
  pedido: "Solicitud", pedidos: "Solicitudes", misPedidos: "Mis solicitudes",
  rubro: "Distrito", rubros: "Distritos",
  comprador: "Vecino", vendedor: "Operador de acopio", recolector: "Recolector", admin: "Administrador",
  pedir: "Solicitar recojo",
  recibidos: "recibidas",
  ventas: "Pago estimado",
  unidad: "kg",
  capacidad: "Capacidad disponible",
  sinCapacidad: "Sin capacidad",
};
export const ESTADOS = ["pendiente", "aceptado", "entregado", "rechazado"] as const;
export const ESTADO_LABEL: Record<(typeof ESTADOS)[number], string> = {
  pendiente: "Pendiente", aceptado: "Asignada a recolector", entregado: "Entregada en acopio", rechazado: "Rechazada",
};
export const fmt = (n: number) => `${APP.moneda} ${n.toFixed(2)}`;
export const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
