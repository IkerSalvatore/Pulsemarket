export const DIAS_HISTORIAL = 30;
export const DIAS_ALERTA = 7;

/**
 * Calcula cuántos días alcanza el stock según el promedio de ventas diarias.
 * Devuelve null si no hubo ventas, porque no hay base para proyectar.
 */
export function calcularDiasDeStock(stock: number, unidadesVendidas: number, dias = DIAS_HISTORIAL): number | null {
  if (unidadesVendidas <= 0) return null;
  const ventaDiaria = unidadesVendidas / dias;
  return Math.floor(stock / ventaDiaria);
}

export function necesitaReabastecer(diasDeStock: number | null): boolean {
  return diasDeStock !== null && diasDeStock <= DIAS_ALERTA;
}
