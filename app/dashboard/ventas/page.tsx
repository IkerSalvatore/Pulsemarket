import { Suspense } from "react";
import { TablaVentas } from "./tabla-ventas";
import { TablaSkeleton } from "./tabla-skeleton";

export default function VentasPage(props: PageProps<"/dashboard/ventas">) {
  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">Ventas</h1>
      <Suspense fallback={<TablaSkeleton />}>
        <TablaVentas searchParams={props.searchParams} />
      </Suspense>
    </section>
  );
}
