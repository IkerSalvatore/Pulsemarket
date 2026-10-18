import "dotenv/config";
import prisma from "@/lib/prisma";
import { listarVentas } from "@/lib/ventas-consulta";

async function medir(nombre: string, consulta: () => Promise<unknown>) {
  await consulta(); // calentamiento: la primera llamada incluye abrir la conexión
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
  await medir("Ventas, página 1", () => listarVentas({}));
  await medir("Ventas, página 100", () => listarVentas({ page: "100" }));
  await medir("Ventas PAGADA por total", () =>
    listarVentas({ estado: "PAGADA", orden: "total_desc" }),
  );

  await prisma.$disconnect();
}

main();
