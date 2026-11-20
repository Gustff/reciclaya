import Link from "next/link";

/** Aviso cuando la página requiere un rol que el usuario actual no tiene. */
export default function Acceso({ rol }: { rol: string }) {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="eyebrow text-brand">Acceso restringido</p>
      <h1 className="mt-3 text-3xl font-black">Ingresa con una cuenta de {rol}</h1>
      <p className="mt-3 text-neutral-600">Esta sección solo está disponible para el rol {rol}.</p>
      <Link href="/ingresar" className="btn-primary mt-8">Ingresar</Link>
    </div>
  );
}
