import prisma from "@/lib/prisma";
import { ESTADOS, type Estado, type Tablero } from "@/lib/kanban-logica";

const POR_COLUMNA = 15;

export async function cargarTablero(): Promise<Tablero> {
  const columnas = await Promise.all(
    ESTADOS.map(async (estado: Estado) => {
      const ventas = await prisma.venta.findMany({
        where: { estado },
        orderBy: [{ fecha: "desc" }, { id: "desc" }],
        take: POR_COLUMNA,
        select: {
          id: true,
          cantidad: true,
          cliente: { select: { nombre: true } },
          producto: { select: { nombre: true } },
        },
      });
      return [
        estado,
        ventas.map((v) => ({
          id: v.id,
          titulo: `#${v.id} ${v.producto.nombre}`,
          detalle: `${v.cliente.nombre} · ${v.cantidad} u.`,
        })),
      ] as const;
    }),
  );
  return Object.fromEntries(columnas) as Tablero;
}
