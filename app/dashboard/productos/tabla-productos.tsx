import Link from "next/link";
import { Paginacion } from "@/components/paginacion";
import { formatearMoneda } from "@/lib/formato-moneda";
import { listarProductosPaginados } from "@/lib/productos-consulta";
import { CATEGORIAS } from "@/lib/productos-params";

type TablaProductosProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const ORDENES = [
  { valor: "nombre_asc", etiqueta: "Nombre" },
  { valor: "precio_asc", etiqueta: "Menor precio" },
  { valor: "precio_desc", etiqueta: "Mayor precio" },
] as const;

export async function TablaProductos({ searchParams }: TablaProductosProps) {
  const datos = await listarProductosPaginados(await searchParams);

  function hrefCon(cambios: Record<string, string | undefined>): string {
    const base: Record<string, string | undefined> = {
      categoria: datos.categoria,
      orden: datos.orden,
      page: String(datos.page),
      ...cambios,
    };
    const query = new URLSearchParams();
    for (const [clave, valor] of Object.entries(base)) {
      if (valor) query.set(clave, valor);
    }
    return `/dashboard/productos?${query.toString()}`;
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2 text-sm">
        <Link href={hrefCon({ categoria: undefined, page: "1" })} className="underline">
          Todas
        </Link>
        {CATEGORIAS.map((c) => (
          <Link
            key={c}
            href={hrefCon({ categoria: c, page: "1" })}
            className={c === datos.categoria ? "font-bold underline" : "underline"}
          >
            {c}
          </Link>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-sm">
        {ORDENES.map((o) => (
          <Link
            key={o.valor}
            href={hrefCon({ orden: o.valor, page: "1" })}
            className={o.valor === datos.orden ? "font-bold underline" : "underline"}
          >
            {o.etiqueta}
          </Link>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-2 pr-4">#</th>
              <th className="py-2 pr-4">Nombre</th>
              <th className="py-2 pr-4">Categoría</th>
              <th className="py-2 pr-4">Precio</th>
              <th className="py-2">Stock</th>
            </tr>
          </thead>
          <tbody>
            {datos.filas.map((p) => (
              <tr key={p.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="py-2 pr-4">{p.id}</td>
                <td className="py-2 pr-4">{p.nombre}</td>
                <td className="py-2 pr-4">{p.categoria}</td>
                <td className="py-2 pr-4">{formatearMoneda(p.precio)}</td>
                <td className="py-2">{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paginacion
        page={datos.page}
        totalPaginas={datos.totalPaginas}
        hrefPara={(p) => hrefCon({ page: String(p) })}
      />
    </div>
  );
}
