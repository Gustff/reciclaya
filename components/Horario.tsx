"use client";
import { useEffect, useState } from "react";
import { DIAS } from "@/lib/config";
import type { Horario as H } from "@/lib/mock";
import { estaAbierto } from "@/lib/reglas";

export const textoHorario = (h: H) => `${h.dias.map((d) => DIAS[d]).join(", ")} · ${h.abre}–${h.cierra}`;

export default function Horario({ h }: { h: H }) {
  const [abierto, setAbierto] = useState<boolean | null>(null);
  useEffect(() => setAbierto(estaAbierto(h, new Date())), [h]);
  return (
    <span className="inline-flex items-center gap-2 text-sm text-neutral-600">
      {abierto !== null && <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${abierto ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-700"}`}>{abierto ? "Abierto ahora" : "Cerrado"}</span>}
      {textoHorario(h)}
    </span>
  );
}
