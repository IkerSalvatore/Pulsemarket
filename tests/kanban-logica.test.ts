import { describe, it, expect } from "vitest";
import { contarTarjetas, esEstado, moverTarjeta, type Tablero } from "@/lib/kanban-logica";

function tableroDePrueba(): Tablero {
  return {
    PENDIENTE: [
      { id: 1, titulo: "A", detalle: "x" },
      { id: 2, titulo: "B", detalle: "y" },
    ],
    PAGADA: [],
    ENVIADA: [],
    CANCELADA: [],
  };
}

describe("moverTarjeta", () => {
  it("mueve la tarjeta a la columna destino", () => {
    const nuevo = moverTarjeta(tableroDePrueba(), 1, "PAGADA");
    expect(nuevo.PENDIENTE.map((t) => t.id)).toEqual([2]);
    expect(nuevo.PAGADA.map((t) => t.id)).toEqual([1]);
  });

  it("no muta el tablero original", () => {
    const original = tableroDePrueba();
    moverTarjeta(original, 1, "PAGADA");
    expect(original.PENDIENTE).toHaveLength(2);
  });

  it("devuelve el mismo tablero si el destino es la columna actual", () => {
    const original = tableroDePrueba();
    expect(moverTarjeta(original, 1, "PENDIENTE")).toBe(original);
  });

  it("devuelve el mismo tablero si la tarjeta no existe", () => {
    const original = tableroDePrueba();
    expect(moverTarjeta(original, 999, "PAGADA")).toBe(original);
  });

  it("conserva el total de tarjetas al mover", () => {
    const original = tableroDePrueba();
    expect(contarTarjetas(moverTarjeta(original, 2, "ENVIADA"))).toBe(contarTarjetas(original));
  });
});

describe("esEstado", () => {
  it("acepta estados válidos y rechaza el resto", () => {
    expect(esEstado("PAGADA")).toBe(true);
    expect(esEstado("OTRO")).toBe(false);
    expect(esEstado(5)).toBe(false);
  });
});
