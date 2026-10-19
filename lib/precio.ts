export function pesosACentavos(texto: string): number | null {
  const limpio = texto.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(limpio)) return null;

  const [pesos, decimales = ""] = limpio.split(".");
  return Number(pesos) * 100 + Number(decimales.padEnd(2, "0"));
}

export function centavosAPesos(centavos: number): string {
  const pesos = Math.trunc(centavos / 100);
  const resto = Math.abs(centavos % 100);
  return pesos + "." + String(resto).padStart(2, "0");
}
