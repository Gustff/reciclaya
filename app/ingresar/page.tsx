"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { L } from "@/lib/config";
import { CLAVE_DEMO, type Rol } from "@/lib/mock";
import { useStore } from "@/lib/store";

const DESTINO: Record<string, string> = { comprador: "/puntos", recolector: "/recolector", vendedor: "/acopio", admin: "/admin" };

export default function Ingresar() {
  const router = useRouter();
  const { ingresar, registrar, usuarios } = useStore();
  const [modo, setModo] = useState<"ingresar" | "registro">("ingresar");
  const [f, setF] = useState({ nombre: "", correo: "", clave: "", rol: "comprador" as Rol });
  const [err, setErr] = useState("");
  const [cargando, setCargando] = useState(false);
  const enviar = async (e: React.FormEvent) => {
    e.preventDefault(); setCargando(true); setErr("");
    const r = modo === "ingresar" ? await ingresar(f.correo, f.clave) : await registrar(f);
    setCargando(false);
    if (r) return setErr(r);
    const u = usuarios.find((x) => x.correo === f.correo.trim().toLowerCase());
    router.push(DESTINO[u?.rol ?? f.rol] ?? "/");
  };
  const demo = usuarios.filter((u) => u.correo && ["u-lucia", "u-juan", "u-carlos", "u-admin"].includes(u.id));
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-6 py-14 md:grid-cols-2">
      <div>
        <h1 className="text-4xl font-black md:text-5xl">{modo === "ingresar" ? "Ingresar" : "Crear cuenta"}</h1>
        <div className="mt-6 inline-flex rounded-full bg-soft p-1 text-sm font-semibold">
          {(["ingresar", "registro"] as const).map((m) => (
            <button key={m} type="button" onClick={() => { setModo(m); setErr(""); }} className={`rounded-full px-5 py-2 ${modo === m ? "bg-black text-white" : "text-neutral-600"}`}>{m === "ingresar" ? "Ingresar" : "Crear cuenta"}</button>
          ))}
        </div>
        <form onSubmit={enviar} className="card mt-6 space-y-4 p-6">
          {modo === "registro" && (
            <div><label className="label" htmlFor="nombre">Nombre</label><input id="nombre" className="input" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} /></div>
          )}
          <div><label className="label" htmlFor="correo">Correo</label><input id="correo" type="email" autoComplete="username" className="input" value={f.correo} onChange={(e) => setF({ ...f, correo: e.target.value })} /></div>
          <div><label className="label" htmlFor="clave">Contraseña</label><input id="clave" type="password" autoComplete={modo === "ingresar" ? "current-password" : "new-password"} className="input" value={f.clave} onChange={(e) => setF({ ...f, clave: e.target.value })} /></div>
          {modo === "registro" && (
            <div><label className="label" htmlFor="rol">Rol</label>
              <select id="rol" className="input" value={f.rol} onChange={(e) => setF({ ...f, rol: e.target.value as Rol })}>
                <option value="comprador">{L.comprador}</option><option value="recolector">{L.recolector}</option><option value="vendedor">{L.vendedor}</option>
              </select>
            </div>
          )}
          {err && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
          <button disabled={cargando} className="btn-primary w-full disabled:opacity-50">{modo === "ingresar" ? "Ingresar" : "Crear cuenta"}</button>
        </form>
      </div>
      <div className="card self-start p-6">
        <p className="eyebrow text-brand">Cuentas de demostración</p>
        <p className="mt-2 text-sm text-neutral-600">Datos de prueba del MVP. Contraseña de todas: <code>{CLAVE_DEMO}</code></p>
        <ul className="mt-4 space-y-2 text-sm">
          {demo.map((u) => (
            <li key={u.id}><button type="button" className="text-left hover:underline" onClick={() => { setModo("ingresar"); setF({ ...f, correo: u.correo!, clave: CLAVE_DEMO }); }}><b>{u.correo}</b> · {u.nombre}</button></li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-neutral-500">Tras 5 intentos fallidos, la cuenta se bloquea 15 minutos. Las contraseñas se guardan como hash SHA-256.</p>
      </div>
    </div>
  );
}
