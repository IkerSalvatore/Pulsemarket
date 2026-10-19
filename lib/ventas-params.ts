import { z } from "zod";

export const TAMANO_PAGINA = 20;
export const ESTADOS_VENTA = ["PENDIENTE", "PAGADA", "ENVIADA", "CANCELADA"] as const;
export const ORDENES_VENTA = ["fecha_desc", "fecha_asc", "total_desc", "total_asc"] as const;

// .catch() devuelve un valor seguro si el parámetro de la URL es inválido.
export const ventasParamsSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  estado: z.enum(ESTADOS_VENTA).optional().catch(undefined),
  orden: z.enum(ORDENES_VENTA).catch("fecha_desc"),
});

export type VentasParams = z.infer<typeof ventasParamsSchema>;
