import "dotenv/config";
import prisma from "@/lib/prisma";

async function medir(nombre: string, consulta: () => Promise<unknown>) {
  const tiempos: number[] = [];
  for (let i = 0; i < 5; i++) {
    const inicio = performance.now();
    await consulta();
    tiempos.push(performance.now() - inicio);
  }
  const promedio = tiempos.reduce((a, b) => a + b, 0) / tiempos.length;
  const peor = Math.max(...tiempos);
  console.log(`${nombre}: promedio ${promedio.toFixed(0)} ms, peor ${peor.toFixed(0)} ms`);
}

async function main() {
  await medir("Ventas pagadas, página 1 (20 filas)", () =>
    prisma.venta.findMany({
      where: { estado: "PAGADA" },
      orderBy: { fecha: "desc" },
      skip: 0,
      take: 20,
      include: { cliente: true, producto: true },
    }),
  );

  await medir("Ventas pagadas, página 100 (20 filas)", () =>
    prisma.venta.findMany({
      where: { estado: "PAGADA" },
      orderBy: { fecha: "desc" },
      skip: 1980,
      take: 20,
      include: { cliente: true, producto: true },
    }),
  );

  await medir("Productos de una categoría, activos", () =>
    prisma.producto.findMany({
      where: { categoria: "Electrónica", eliminadoEn: null },
      orderBy: { precio: "asc" },
      take: 20,
    }),
  );

  await prisma.$disconnect();
}

main();