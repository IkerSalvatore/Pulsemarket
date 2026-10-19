import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { centavosAPesos } from "@/lib/precio";
import { editarProducto } from "@/lib/productos-acciones";
import { AccionesProducto } from "../../acciones-producto";
import { FormularioProducto } from "../../formulario-producto";

async function CargarFormulario({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idNumero = Number(id);

  const producto =
    Number.isInteger(idNumero) && idNumero > 0
      ? await prisma.producto.findFirst({
          where: { id: idNumero, eliminadoEn: null },
        })
      : null;

  if (!producto) {
    return (
      <p role="alert" className="mt-4 text-sm text-red-700">
        El producto no existe o ya fue eliminado.
      </p>
    );
  }

  return (
    <>
      <FormularioProducto
        accion={editarProducto.bind(null, producto.id)}
        textoBoton="Guardar cambios"
        valoresIniciales={{
          nombre: producto.nombre,
          categoria: producto.categoria,
          precio: centavosAPesos(producto.precio),
          stock: String(producto.stock),
        }}
      />
      <div className="mt-8 border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <AccionesProducto
          id={producto.id}
          nombre={producto.nombre}
          mostrarEditar={false}
        />
      </div>
    </>
  );
}

export default function EditarProductoPage(
  props: PageProps<"/dashboard/productos/editar/[id]">,
) {
  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">Editar producto</h1>
      <Suspense fallback={<p className="mt-4 text-sm">Cargando...</p>}>
        <CargarFormulario params={props.params} />
      </Suspense>
    </section>
  );
}
