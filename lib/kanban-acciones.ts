"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { ESTADOS } from "@/lib/kanban-logica";

const moverSchema = z.object({
  id: z.number().int().positive(),
  estado: z.enum(ESTADOS),
});

export type ResultadoMover = { ok: true } | { ok: false; error: string };

export async function moverVenta(input: unknown): Promise<ResultadoMover> {
  // TODO(Persona 2): una Server Action es un endpoint público. Cuando se mezcle
  // la rama `auth`, validar aquí la sesión con el helper de lib/sesion.ts
  // (devuelve el usuario o corta la acción). No importar @/auth directamente.

  const datos = moverSchema.safeParse(input);
  if (!datos.success) return { ok: false, error: "Datos inválidos." };

  try {
    await prisma.venta.update({
      where: { id: datos.data.id },
      data: { estado: datos.data.estado },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo guardar el cambio. Inténtalo de nuevo." };
  }
}
