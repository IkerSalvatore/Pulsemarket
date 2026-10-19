export function formatearMoneda(centavos: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(centavos / 100);
}
