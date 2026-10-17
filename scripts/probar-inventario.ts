import "dotenv/config";
import prisma from "@/lib/prisma";
import { proyeccionDeInventario } from "@/lib/inventario";

async function main() {
  const proyeccion = await proyeccionDeInventario();
  const enAlerta = proyeccion.filter((p) => p.alerta);

  console.log(`Productos revisados: ${proyeccion.length}`);
  console.log(`En alerta de reabastecimiento: ${enAlerta.length}`);
  console.table(enAlerta.slice(0, 5));

  await prisma.$disconnect();
}

main();