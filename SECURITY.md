# Politica de seguridad
- Reporta vulnerabilidades abriendo un issue privado (Security > Advisories).
- Controles automaticos: CodeQL (SAST), `pnpm audit` + Dependency Review (dependencias), Gitleaks (secretos), Dependabot (actualizaciones).
- Los secretos (claves de Supabase) solo se configuran como variables de entorno en Vercel; nunca en el repositorio (`.env*.local` esta en `.gitignore`).
- Base de datos con Row Level Security: cada rol solo accede a sus filas.
