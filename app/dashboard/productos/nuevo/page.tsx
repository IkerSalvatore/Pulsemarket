import { crearProducto } from "@/lib/productos-acciones";
import { FormularioProducto } from "../formulario-producto";

export default function NuevoProductoPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">Nuevo producto</h1>
      <FormularioProducto accion={crearProducto} textoBoton="Crear producto" />
    </section>
  );
}
