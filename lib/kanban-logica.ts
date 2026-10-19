export const ESTADOS = ["PENDIENTE", "PAGADA", "ENVIADA", "CANCELADA"] as const;
export type Estado = (typeof ESTADOS)[number];

export type Tarjeta = { id: number; titulo: string; detalle: string };
export type Tablero = Record<Estado, Tarjeta[]>;

export function esEstado(valor: unknown): valor is Estado {
  return typeof valor === "string" && (ESTADOS as readonly string[]).includes(valor);
}

export function moverTarjeta(tablero: Tablero, id: number, destino: Estado): Tablero {
  const origen = ESTADOS.find((e) => tablero[e].some((t) => t.id === id));
  if (!origen || origen === destino) return tablero;

  const tarjeta = tablero[origen].find((t) => t.id === id);
  if (!tarjeta) return tablero;

  return {
    ...tablero,
    [origen]: tablero[origen].filter((t) => t.id !== id),
    [destino]: [tarjeta, ...tablero[destino]],
  };
}

export function contarTarjetas(tablero: Tablero): number {
  return ESTADOS.reduce((suma, e) => suma + tablero[e].length, 0);
}
