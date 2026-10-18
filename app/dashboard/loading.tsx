import { Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Cargando contenido">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-4 h-4 w-80 max-w-full" />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    </div>
  );
}
