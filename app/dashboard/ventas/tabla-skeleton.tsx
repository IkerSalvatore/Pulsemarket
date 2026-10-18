import { Skeleton } from "@/components/skeleton";

export function TablaSkeleton() {
  return (
    <div role="status" aria-label="Cargando ventas" className="mt-6 space-y-2">
      <Skeleton className="h-9 w-full" />
      {Array.from({ length: 10 }, (_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  );
}
