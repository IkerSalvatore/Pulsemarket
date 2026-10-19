import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { TAMANO_PAGINA, productosParamsSchema } from "@/lib/productos-params";

const ORDEN: Record<string, Prisma.ProductoOrderByWithRelationInput> = {
  nombre_asc: { nombre: "asc" },
  precio_asc: { precio: "asc" },
  precio_desc: { precio: "desc" },
};

export async function listarProductosPaginados(input: unknown) {
  const { page, categoria, orden } = productosParamsSchema.parse(input);

  // Los productos eliminados (soft delete) nunca se muestran.
  const where: Prisma.ProductoWhereInput = {
    eliminadoEn: null,
    ...(categoria ? { categoria } : {}),
  };

  const [filas, total] = await Promise.all([
    prisma.producto.findMany({
      where,
      // El id al final hace estable el orden entre páginas.
      orderBy: [ORDEN[orden], { id: "asc" }],
      skip: (page - 1) * TAMANO_PAGINA,
      take: TAMANO_PAGINA,
      select: {
        id: true,
        nombre: true,
        categoria: true,
        precio: true,
        stock: true,
      },
    }),
    prisma.producto.count({ where }),
  ]);

  return {
    filas,
    total,
    page,
    categoria,
    orden,
    totalPaginas: Math.max(1, Math.ceil(total / TAMANO_PAGINA)),
  };
}
