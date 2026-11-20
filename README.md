# ReciclaYa ♻

Plataforma que conecta a **vecinos** que generan residuos reciclables con **puntos de acopio** y **recolectores**.
Caso "Recolectores y reciclaje" — Practica Calificada 2, Proyecto Final de Carrera III.

**Demo:** ver enlace en la descripcion del repositorio.

## Funcionalidades del MVP
| Rol | Que puede hacer |
|---|---|
| Visitante | Ver el inicio y buscar puntos de acopio; ingresar o crear una cuenta |
| Vecino | Buscar puntos por material, distrito y horario (abierto ahora), solicitar recojo indicando kg y direccion, ver el estado de sus solicitudes |
| Recolector | Ver solicitudes disponibles, tomar recojos y marcarlos como entregados en el punto de acopio |
| Operador de acopio | Registrar su punto (horario y dias), gestionar materiales (pago por kg y capacidad), atender solicitudes |
| Administrador | Suspender o reactivar usuarios y puntos de acopio |

> MVP con datos de prueba en el navegador. **Cuentas de demostración** (contraseña `Recicla2026`): `lucia@reciclaya.pe` (vecino), `juan@reciclaya.pe` (recolector), `carlos@reciclaya.pe` (operador), `admin@reciclaya.pe` (administrador). También se puede crear una cuenta en `/ingresar`.
> Las contraseñas se guardan como hash SHA-256 y la cuenta se bloquea 15 minutos tras 5 intentos fallidos. En la fase 2 la autenticación pasa a Supabase Auth.

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
1. **Instalación** — dependencias con lockfile congelado.
2. **Test y build** — Vitest (reporte JUnit) y luego `next build`.
3. **Seguridad** — CodeQL (SAST), `pnpm audit` + Dependency Review (dependencias), Gitleaks (secretos en los commits nuevos y en todo el historial).
4. **Deploy** — Vercel publica cada push (integración Git); el job 4 espera ese deploy y verifica rutas y cabeceras de seguridad.

## Base de datos
Migraciones versionadas en `supabase/migrations/` (tablas `profiles`, `puntos_acopio`, `materiales`, `solicitudes` con Row Level Security) y datos de prueba en `supabase/seed.sql`.
