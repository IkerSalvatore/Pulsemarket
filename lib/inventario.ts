import prisma from "@/lib/prisma";
import {
  DIAS_HISTORIAL,
  calcularDiasDeStock,
  necesitaReabastecer,
} from "@/lib/inventario-logica";

export async function proyeccionDeInventario() {
  const desde = new Date(Date.now() - DIAS_HISTORIAL * 24 * 60 * 60 * 1000);

  // groupBy suma las unidades en la base, así no traemos miles de ventas al programa
  const ventas = await prisma.venta.groupBy({
    by: ["productoId"],
    where: { fecha: { gte: desde }, estado: { in: ["PAGADA", "ENVIADA"] } },
    _sum: { cantidad: true },
  });

  const productos = await prisma.producto.findMany({
    where: { eliminadoEn: null },
    select: { id: true, nombre: true, stock: true },
  });

  const unidadesPorProducto = new Map(
    ventas.map((v): [number, number] => [v.productoId, v._sum.cantidad ?? 0]),
  );

  return productos.map((producto) => {
    const diasDeStock = calcularDiasDeStock(
      producto.stock,
      unidadesPorProducto.get(producto.id) ?? 0,
    );
    return {
      id: producto.id,
      nombre: producto.nombre,
      stock: producto.stock,
      diasDeStock,
      alerta: necesitaReabastecer(diasDeStock),
    };
  });
}