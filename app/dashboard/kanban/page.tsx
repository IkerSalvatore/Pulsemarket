import { Suspense } from "react";
import { Skeleton } from "@/components/skeleton";
import { KanbanServidor } from "./kanban-servidor";

export default function KanbanPage() {
  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">Kanban de órdenes</h1>
      <Suspense
        fallback={
          <div role="status" aria-label="Cargando tablero" className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        }
      >
        <KanbanServidor />
      </Suspense>
    </section>
  );
}
