import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { TAMANO_PAGINA, ventasParamsSchema } from "@/lib/ventas-params";

const ORDEN: Record<string, Prisma.VentaOrderByWithRelationInput> = {
  fecha_desc: { fecha: "desc" },
  fecha_asc: { fecha: "asc" },
  total_desc: { total: "desc" },
  total_asc: { total: "asc" },
};

export async function listarVentas(input: unknown) {
  const { page, estado, orden } = ventasParamsSchema.parse(input);
  const where: Prisma.VentaWhereInput = estado ? { estado } : {};

  const [filas, total] = await Promise.all([
    prisma.venta.findMany({
      where,
      // El id al final hace estable el orden entre páginas.
      orderBy: [ORDEN[orden], { id: "desc" }],
      skip: (page - 1) * TAMANO_PAGINA,
      take: TAMANO_PAGINA,
      select: {
        id: true,
        cantidad: true,
        total: true,
        estado: true,
        fecha: true,
        cliente: { select: { nombre: true } },
        producto: { select: { nombre: true } },
      },
    }),
    prisma.venta.count({ where }),
  ]);

  return {
    filas,
    total,
    page,
    estado,
    orden,
    totalPaginas: Math.max(1, Math.ceil(total / TAMANO_PAGINA)),
  };
}
