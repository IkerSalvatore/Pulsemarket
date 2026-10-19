import { z } from "zod";

export { TAMANO_PAGINA } from "@/lib/ventas-params";

export const CATEGORIAS = ["Electrónica", "Hogar", "Ropa", "Deportes", "Libros", "Juguetes"] as const;
export const ORDENES_PRODUCTO = ["nombre_asc", "precio_asc", "precio_desc"] as const;

// .catch() devuelve un valor seguro si el parámetro de la URL es inválido.
export const productosParamsSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  categoria: z.enum(CATEGORIAS).optional().catch(undefined),
  orden: z.enum(ORDENES_PRODUCTO).catch("nombre_asc"),
});

export type ProductosParams = z.infer<typeof productosParamsSchema>;
