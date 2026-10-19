import { z } from "zod";

export const productoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(120, "El nombre es demasiado largo"),
  categoria: z
    .string()
    .trim()
    .min(1, "La categoría es obligatoria")
    .max(60, "La categoría es demasiado larga"),
  precio: z
    .number()
    .int("El precio debe ser un entero en centavos")
    .positive("El precio debe ser mayor que cero"),
  stock: z
    .number()
    .int("El stock debe ser un entero")
    .nonnegative("El stock no puede ser negativo"),
});

export type ProductoEntrada = z.infer<typeof productoSchema>;
