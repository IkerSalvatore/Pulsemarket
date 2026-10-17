import { z } from "zod";
import prisma from "@/lib/prisma";

export const bulkUpdateSchema = z.object({
  categoria: z.string().min(1),
  porcentaje: z.number().min(-90).max(300),
});

export async function actualizarPreciosPorCategoria(input: unknown): Promise<number> {
  const { categoria, porcentaje } = bulkUpdateSchema.parse(input);
  const factor = 1 + porcentaje / 100;

  const filasActualizadas = await prisma.$executeRaw`
    UPDATE "Producto"
    SET precio = ROUND(precio * ${factor}::double precision)::int
    WHERE categoria = ${categoria} AND "eliminadoEn" IS NULL
  `;

  return filasActualizadas;
}