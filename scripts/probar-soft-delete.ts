import "dotenv/config";
import prisma from "@/lib/prisma";
import { eliminarProducto, restaurarProducto, listarProductosActivos } from "@/lib/productos";

async function main() {
  const producto = await prisma.producto.findFirstOrThrow({
    where: { eliminadoEn: null },
  });
  console.log(`Producto de prueba: ${producto.id} - ${producto.nombre}`);

  await eliminarProducto(producto.id);

  const enBD = await prisma.producto.findUnique({ where: { id: producto.id } });
  console.log("Sigue en la base:", enBD !== null);
  console.log("Tiene fecha de eliminación:", enBD?.eliminadoEn !== null);

  const activos = await listarProductosActivos(1000);
  console.log("¿Aparece en activos?", activos.some((p) => p.id === producto.id));

  await restaurarProducto(producto.id);
  console.log("Restaurado.");

  await prisma.$disconnect();
}

main();