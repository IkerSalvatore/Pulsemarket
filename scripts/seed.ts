import "dotenv/config";
import prisma from "@/lib/prisma";

const CATEGORIAS = ["Electrónica", "Hogar", "Ropa", "Deportes", "Libros", "Juguetes"];
const CIUDADES = ["CDMX", "Guadalajara", "Monterrey", "Puebla", "Querétaro", "Mérida", "Toluca", "Morelia"];
const ESTADOS = ["PENDIENTE", "PAGADA", "ENVIADA", "CANCELADA"] as const;

const NUM_PRODUCTOS = 500;
const NUM_CLIENTES = 2000;
const NUM_VENTAS = 8000;
const LOTE = 1000;

function aleatorio(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function elegir<T>(lista: readonly T[]): T {
  return lista[aleatorio(0, lista.length - 1)];
}

async function main() {
  console.log("Borrando datos anteriores...");
  await prisma.venta.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.producto.deleteMany();

  console.log("Creando productos...");
  const productos = Array.from({ length: NUM_PRODUCTOS }, (_, i) => ({
    nombre: `Producto ${i + 1}`,
    categoria: elegir(CATEGORIAS),
    precio: aleatorio(5_000, 500_000),
    stock: aleatorio(0, 200),
  }));
  await prisma.producto.createMany({ data: productos });

  console.log("Creando clientes...");
  const clientes = Array.from({ length: NUM_CLIENTES }, (_, i) => ({
    nombre: `Cliente ${i + 1}`,
    email: `cliente${i + 1}@ejemplo.com`,
    ciudad: elegir(CIUDADES),
  }));
  for (let i = 0; i < clientes.length; i += LOTE) {
    await prisma.cliente.createMany({ data: clientes.slice(i, i + LOTE) });
  }

  const idsProductos = await prisma.producto.findMany({ select: { id: true, precio: true } });
  const idsClientes = await prisma.cliente.findMany({ select: { id: true } });

  console.log("Creando ventas...");
  const ventas = Array.from({ length: NUM_VENTAS }, () => {
    const producto = elegir(idsProductos);
    const cantidad = aleatorio(1, 5);
    return {
      clienteId: elegir(idsClientes).id,
      productoId: producto.id,
      cantidad,
      total: producto.precio * cantidad,
      estado: elegir(ESTADOS),
      fecha: new Date(Date.now() - aleatorio(0, 365) * 24 * 60 * 60 * 1000),
    };
  });
  for (let i = 0; i < ventas.length; i += LOTE) {
    await prisma.venta.createMany({ data: ventas.slice(i, i + LOTE) });
  }

  const totalProductos = await prisma.producto.count();
  const totalClientes = await prisma.cliente.count();
  const totalVentas = await prisma.venta.count();
  console.log(
    `Listo. Productos: ${totalProductos}, clientes: ${totalClientes}, ventas: ${totalVentas}. Total: ${totalProductos + totalClientes + totalVentas}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());