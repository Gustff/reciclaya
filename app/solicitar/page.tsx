import { redirect } from "next/navigation";

// /solicitar sin material: el vecino primero elige un punto y un material.
export default function SolicitarIndice() {
  redirect("/puntos");
}
