import "dotenv/config";
import prisma from "@/lib/prisma";
import { esEstado } from "@/lib/kanban-logica";

// Uso (solo para las pruebas E2E):
//   npx tsx scripts/e2e-venta.ts leer <id>
//   npx tsx scripts/e2e-venta.ts poner <id> <ESTADO>
async function main() {
  const [comando, idTexto, estadoTexto] = process.argv.slice(2);
  const id = Number(idTexto);
  if (!Number.isInteger(id) || id <= 0) throw new Error("id inválido");

  if (comando === "leer") {
    const venta = await prisma.venta.findUnique({ where: { id }, select: { estado: true } });
    console.log(venta?.estado ?? "NO_EXISTE");
  } else if (comando === "poner") {
    if (!esEstado(estadoTexto)) throw new Error("estado inválido");
    await prisma.venta.update({ where: { id }, data: { estado: estadoTexto } });
    console.log("OK");
  } else {
    throw new Error("comando desconocido");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
