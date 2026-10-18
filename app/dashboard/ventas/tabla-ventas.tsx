import Link from "next/link";
import { Paginacion } from "@/components/paginacion";
import { formatearMoneda } from "@/lib/formato-moneda";
import { listarVentas } from "@/lib/ventas-consulta";
import { ESTADOS_VENTA } from "@/lib/ventas-params";

type TablaVentasProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const ORDENES = [
  { valor: "fecha_desc", etiqueta: "Más recientes" },
  { valor: "fecha_asc", etiqueta: "Más antiguas" },
  { valor: "total_desc", etiqueta: "Mayor total" },
  { valor: "total_asc", etiqueta: "Menor total" },
] as const;

export async function TablaVentas({ searchParams }: TablaVentasProps) {
  const datos = await listarVentas(await searchParams);

  function hrefCon(cambios: Record<string, string | undefined>): string {
    const base: Record<string, string | undefined> = {
      estado: datos.estado,
      orden: datos.orden,
      page: String(datos.page),
      ...cambios,
    };
    const query = new URLSearchParams();
    for (const [clave, valor] of Object.entries(base)) {
      if (valor) query.set(clave, valor);
    }
    return `/dashboard/ventas?${query.toString()}`;
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2 text-sm">
        <Link href={hrefCon({ estado: undefined, page: "1" })} className="underline">
          Todas
        </Link>
        {ESTADOS_VENTA.map((e) => (
          <Link
            key={e}
            href={hrefCon({ estado: e, page: "1" })}
            className={e === datos.estado ? "font-bold underline" : "underline"}
          >
            {e}
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
              <th className="py-2 pr-4">Cliente</th>
              <th className="py-2 pr-4">Producto</th>
              <th className="py-2 pr-4">Cant.</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Estado</th>
              <th className="py-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {datos.filas.map((v) => (
              <tr key={v.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="py-2 pr-4">{v.id}</td>
                <td className="py-2 pr-4">{v.cliente.nombre}</td>
                <td className="py-2 pr-4">{v.producto.nombre}</td>
                <td className="py-2 pr-4">{v.cantidad}</td>
                <td className="py-2 pr-4">{formatearMoneda(v.total)}</td>
                <td className="py-2 pr-4">{v.estado}</td>
                <td className="py-2">{v.fecha.toLocaleDateString("es-MX")}</td>
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
