import prisma from "@/lib/prisma";

export async function eliminarProducto(id: number) {
  return prisma.producto.update({
    where: { id },
    data: { eliminadoEn: new Date() },
  });
}

export async function restaurarProducto(id: number) {
  return prisma.producto.update({
    where: { id },
    data: { eliminadoEn: null },
  });
}

export async function listarProductosActivos(take = 20) {
  return prisma.producto.findMany({
    where: { eliminadoEn: null },
    orderBy: { nombre: "asc" },
    take,
  });
}