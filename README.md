# MVP

Next.js + TypeScript + Tailwind. Datos de prueba (mock) persistidos en localStorage; esquema listo para Supabase.

| Comando | Que hace |
|---|---|
| `pnpm dev` | servidor local en http://localhost:3000 |
| `pnpm test` | pruebas unitarias (Vitest) de las reglas de negocio |
| `pnpm build` | build de produccion (el mismo que corre Vercel) |

- **Ramas:** `main` (produccion) · `develop` (integracion) · `feature/<nombre>` (una por historia). Todo entra por Pull Request.
- **CI:** `.github/workflows/ci.yml` corre pruebas + build en cada push/PR.
- **CD:** Vercel despliega automaticamente `main` (produccion) y cada PR (preview).
- **BD:** migraciones versionadas en `supabase/migrations/`, datos de prueba en `supabase/seed.sql`.
- **Usuario de prueba:** selector arriba a la derecha (o `?as=<id>` en la URL).
