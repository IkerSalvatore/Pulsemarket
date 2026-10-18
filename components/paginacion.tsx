import Link from "next/link";

type PaginacionProps = {
  page: number;
  totalPaginas: number;
  hrefPara: (page: number) => string;
};

export function Paginacion({ page, totalPaginas, hrefPara }: PaginacionProps) {
  const base = "rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700";
  const inactivo = `${base} pointer-events-none opacity-40`;

  return (
    <nav aria-label="Paginación" className="mt-4 flex items-center gap-3">
      {page > 1 ? (
        <Link className={base} href={hrefPara(page - 1)}>Anterior</Link>
      ) : (
        <span className={inactivo}>Anterior</span>
      )}
      <span className="text-sm text-zinc-600 dark:text-zinc-400">
        Página {page} de {totalPaginas}
      </span>
      {page < totalPaginas ? (
        <Link className={base} href={hrefPara(page + 1)}>Siguiente</Link>
      ) : (
        <span className={inactivo}>Siguiente</span>
      )}
    </nav>
  );
}
