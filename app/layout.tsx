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
          <footer className="mt-16 border-t border-neutral-200 py-6 text-center text-xs text-neutral-500">
            {APP.nombre}{APP.acento} · MVP con datos de prueba (mock)
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
