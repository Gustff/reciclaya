import type { Metadata } from "next";
import "./globals.css";
import { APP } from "@/lib/config";
import { StoreProvider } from "@/lib/store";
import Nav from "@/components/Nav";

export const metadata: Metadata = { title: `${APP.nombre}${APP.acento}`, description: APP.subtitulo };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <StoreProvider>
          <Nav />
          <main>{children}</main>
          <footer className="mt-24 bg-neutral-950 text-neutral-400">
            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 text-sm md:grid-cols-4">
              <div><p className="text-xl font-black text-white">{APP.nombre}<span className="text-brand">{APP.acento}</span></p><p className="mt-3 max-w-xs">Conectamos vecinos, recolectores y puntos de acopio para que ningun reciclable termine en la basura comun.</p></div>
              <div><p className="mb-3 font-bold text-white">Recicla</p><ul className="space-y-2"><li>Puntos de acopio</li><li>Materiales aceptados</li><li>Solicitar recojo</li></ul></div>
              <div><p className="mb-3 font-bold text-white">Recolectores</p><ul className="space-y-2"><li>Recojos disponibles</li><li>Mis recojos</li><li>Formalizacion</li></ul></div>
              <div><p className="mb-3 font-bold text-white">Proyecto</p><ul className="space-y-2"><li>MVP con datos de prueba</li><li>Next.js · Supabase · Vercel</li><li>Practica Calificada 2 · PFC III</li></ul></div>
            </div>
            <div className="border-t border-neutral-800 py-5 text-center text-xs">© 2026 {APP.nombre}{APP.acento}. Proyecto academico.</div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
