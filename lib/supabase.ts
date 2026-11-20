import { createClient } from "@supabase/supabase-js";
// Si se definen las variables en Vercel (.env), el cliente queda listo para reemplazar el mock.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const isSupabaseOn = Boolean(url && key);
export const supabase = isSupabaseOn ? createClient(url!, key!) : null;
