import { Suspense } from "react";
import { TablaProductos } from "./tabla-productos";
import { TablaSkeleton } from "./tabla-skeleton";

export default function ProductosPage(props: PageProps<"/dashboard/productos">) {
  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">Productos</h1>
      <Suspense fallback={<TablaSkeleton />}>
        <TablaProductos searchParams={props.searchParams} />
      </Suspense>
    </section>
  );
}
