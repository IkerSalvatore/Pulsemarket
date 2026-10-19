import { describe, it, expect } from "vitest";
import { productoSchema } from "@/lib/producto-schema";

const valido = { nombre: "Camisa", categoria: "Ropa", precio: 19900, stock: 5 };

describe("productoSchema", () => {
  it("acepta un producto válido", () => {
    expect(productoSchema.safeParse(valido).success).toBe(true);
  });

  it("recorta los espacios del nombre", () => {
    const resultado = productoSchema.safeParse({ ...valido, nombre: "  Camisa  " });
    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.nombre).toBe("Camisa");
    }
  });

  it("rechaza un nombre vacío", () => {
    expect(productoSchema.safeParse({ ...valido, nombre: "" }).success).toBe(false);
  });

  it("rechaza un nombre formado solo por espacios", () => {
    expect(productoSchema.safeParse({ ...valido, nombre: "   " }).success).toBe(false);
  });

  it("rechaza un precio con decimales, porque va en centavos enteros", () => {
    expect(productoSchema.safeParse({ ...valido, precio: 199.5 }).success).toBe(false);
  });

  it("rechaza un precio en cero o negativo", () => {
    expect(productoSchema.safeParse({ ...valido, precio: 0 }).success).toBe(false);
    expect(productoSchema.safeParse({ ...valido, precio: -100 }).success).toBe(false);
  });

  it("rechaza un stock negativo o con decimales", () => {
    expect(productoSchema.safeParse({ ...valido, stock: -1 }).success).toBe(false);
    expect(productoSchema.safeParse({ ...valido, stock: 2.5 }).success).toBe(false);
  });

  it("acepta stock en cero", () => {
    expect(productoSchema.safeParse({ ...valido, stock: 0 }).success).toBe(true);
  });

  it("rechaza un stock que no es número (campo vacío en el formulario)", () => {
    expect(productoSchema.safeParse({ ...valido, stock: Number.NaN }).success).toBe(false);
  });
});
