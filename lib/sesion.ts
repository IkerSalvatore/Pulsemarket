import { auth } from "@/auth";

export async function requerirUsuario() {
  const session = await auth();
  return session?.user ?? null;
}
