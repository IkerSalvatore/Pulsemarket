"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { eliminarProducto } from "@/lib/productos";
import { pesosACentavos } from "@/lib/precio";
import { productoSchema, type ProductoEntrada } from "@/lib/producto-schema";
import { requerirUsuario } from "@/lib/sesion";

export type EstadoFormulario = {
  ok: boolean;
  mensaje?: string;
  errores?: Record<string, string[] | undefined>;
};

type LecturaFormulario =
  | { ok: true; datos: ProductoEntrada }
  | { ok: false; errores: Record<string, string[] | undefined> };

function leerFormulario(formData: FormData): LecturaFormulario {
  const precio = pesosACentavos(String(formData.get("precio") ?? ""));
  if (precio === null) {
    return {
      ok: false,
      errores: { precio: ["Escribe un precio válido, por ejemplo 199.50"] },
    };
  }

  const stockTexto = String(formData.get("stock") ?? "").trim();

  const resultado = productoSchema.safeParse({
    nombre: formData.get("nombre"),
    categoria: formData.get("categoria"),
    precio,
    stock: stockTexto === "" ? Number.NaN : Number(stockTexto),
  });

  if (!resultado.success) {
    return { ok: false, errores: z.flattenError(resultado.error).fieldErrors };
  }
  return { ok: true, datos: resultado.data };
}

const idSchema = z.number().int().positive();

export async function crearProducto(
  _estadoPrevio: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const usuario = await requerirUsuario();
  if (!usuario) {
    return { ok: false, mensaje: "Debes iniciar sesión para hacer esto." };
  }

  const lectura = leerFormulario(formData);
  if (!lectura.ok) return { ok: false, errores: lectura.errores };

  await prisma.producto.create({ data: lectura.datos });
  revalidatePath("/dashboard/productos");

  return { ok: true, mensaje: "Producto creado correctamente." };
}

export async function editarProducto(
  id: number,
  _estadoPrevio: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const usuario = await requerirUsuario();
  if (!usuario) {
    return { ok: false, mensaje: "Debes iniciar sesión para hacer esto." };
  }

  const idValido = idSchema.safeParse(id);
  if (!idValido.success) {
    return { ok: false, mensaje: "Identificador de producto inválido." };
  }

  const existente = await prisma.producto.findFirst({
    where: { id: idValido.data, eliminadoEn: null },
    select: { id: true },
  });
  if (!existente) {
    return { ok: false, mensaje: "El producto no existe o ya fue eliminado." };
  }

  const lectura = leerFormulario(formData);
  if (!lectura.ok) return { ok: false, errores: lectura.errores };

  await prisma.producto.update({
    where: { id: idValido.data },
    data: lectura.datos,
  });
  revalidatePath("/dashboard/productos");

  return { ok: true, mensaje: "Producto actualizado correctamente." };
}

export async function eliminarProductoAccion(
  id: number,
): Promise<EstadoFormulario> {
  const usuario = await requerirUsuario();
  if (!usuario) {
    return { ok: false, mensaje: "Debes iniciar sesión para hacer esto." };
  }

  const idValido = idSchema.safeParse(id);
  if (!idValido.success) {
    return { ok: false, mensaje: "Identificador de producto inválido." };
  }

  const existente = await prisma.producto.findFirst({
    where: { id: idValido.data, eliminadoEn: null },
    select: { id: true },
  });
  if (!existente) {
    return { ok: false, mensaje: "El producto no existe o ya fue eliminado." };
  }

  await eliminarProducto(idValido.data);
  revalidatePath("/dashboard/productos");

  return { ok: true, mensaje: "Producto eliminado." };
}
