import "dotenv/config";
import prisma from "@/lib/prisma";
import { actualizarPreciosPorCategoria } from "@/lib/bulk-update";

async function main() {
  const muestra = await prisma.producto.findFirstOrThrow({
    where: { categoria: "Ropa", eliminadoEn: null },
  });
  console.log(`Antes: ${muestra.nombre} = ${muestra.precio} centavos`);

  const actualizados = await actualizarPreciosPorCategoria({ categoria: "Ropa", porcentaje: 10 });
  console.log(`Productos actualizados: ${actualizados}`);

  const despues = await prisma.producto.findUniqueOrThrow({ where: { id: muestra.id } });
  console.log(`Después: ${despues.nombre} = ${despues.precio} centavos`);

  try {
    await actualizarPreciosPorCategoria({ categoria: "Ropa", porcentaje: 1000 });
    console.log("ERROR: debió rechazar el porcentaje inválido");
  } catch {
    console.log("Validación correcta: se rechazó el porcentaje 1000");
  }

  await prisma.$disconnect();
}

main();