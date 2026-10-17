import { describe, it, expect } from "vitest";
import { calcularDiasDeStock, necesitaReabastecer } from "@/lib/inventario-logica";

describe("calcularDiasDeStock", () => {
  it("devuelve null si no hubo ventas", () => {
    expect(calcularDiasDeStock(10, 0)).toBeNull();
  });

  it("calcula los días según el promedio diario", () => {
    // 30 vendidas en 30 días = 1 por día. Con 10 en stock, quedan 10 días.
    expect(calcularDiasDeStock(10, 30)).toBe(10);
  });

  it("redondea hacia abajo", () => {
    // 4 vendidas en 30 días = 0.13 por día. Con 1 en stock, son 7.5 días, se redondea a 7.
    expect(calcularDiasDeStock(1, 4)).toBe(7);
  });

  it("con stock en cero da cero días", () => {
    expect(calcularDiasDeStock(0, 30)).toBe(0);
  });
});

describe("necesitaReabastecer", () => {
  it("activa la alerta con 7 días o menos", () => {
    expect(necesitaReabastecer(7)).toBe(true);
  });

  it("no activa la alerta con más de 7 días", () => {
    expect(necesitaReabastecer(8)).toBe(false);
  });

  it("no activa la alerta si no hay datos", () => {
    expect(necesitaReabastecer(null)).toBe(false);
  });
});