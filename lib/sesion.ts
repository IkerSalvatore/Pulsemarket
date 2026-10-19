// TODO (importante): este helper es PROVISIONAL y deja pasar a cualquiera.
// Cuando el PR de auth esté mezclado en main, reemplazar por:
//   import { auth } from "@/auth";
//   const session = await auth();
//   return session?.user ?? null;
export type UsuarioSesion = { name?: string | null };

export async function requerirUsuario(): Promise<UsuarioSesion | null> {
  return { name: "pendiente-auth" };
}
