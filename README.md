# ReciclaYa ♻

Plataforma que conecta a **vecinos** que generan residuos reciclables con **puntos de acopio** y **recolectores**.
Caso "Recolectores y reciclaje" — Practica Calificada 2, Proyecto Final de Carrera III.

**Demo:** ver enlace en la descripcion del repositorio.

## Funcionalidades del MVP
| Rol | Que puede hacer |
|---|---|
| Vecino | Buscar puntos por material, distrito y horario (abierto ahora), solicitar recojo indicando kg y direccion, ver el estado de sus solicitudes |
| Recolector | Ver solicitudes disponibles, tomar recojos y marcarlos como entregados en el punto de acopio |
| Operador de acopio | Registrar su punto (horario y dias), gestionar materiales (pago por kg y capacidad), atender solicitudes |
| Administrador | Suspender o reactivar usuarios y puntos de acopio |

> MVP con datos de prueba (mock). Usa el selector de usuario (arriba a la derecha) para cambiar de rol, o `?as=<id>` en la URL.

## Stack
Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Vitest · Supabase (PostgreSQL + Auth + RLS) · Vercel · GitHub Actions

## Comandos
| Comando | Que hace |
|---|---|
| `pnpm dev` | Servidor local en http://localhost:3000 |
| `pnpm test` | Pruebas unitarias de las reglas de negocio |
| `pnpm build` | Build de produccion |

## Ramas y flujo
- `main`: produccion (deploy automatico en Vercel).
- `test`: integracion y pruebas (deploy de preview en Vercel).
- Todo cambio entra a `main` por Pull Request con el pipeline en verde.

## Pipeline CI/CD DevSecOps (`.github/workflows/ci.yml`)
1. **Build** — instalacion con lockfile congelado y `next build`.
2. **Test** — Vitest con reporte JUnit y resumen en la ejecucion.
3. **Seguridad** — CodeQL (SAST), `pnpm audit` + Dependency Review (dependencias), Gitleaks (secretos).
4. **Deploy** — Vercel (integracion Git) + smoke test de la URL publica y cabeceras de seguridad.

## Base de datos
Migraciones versionadas en `supabase/migrations/` (tablas `profiles`, `puntos_acopio`, `materiales`, `solicitudes` con Row Level Security) y datos de prueba en `supabase/seed.sql`.
