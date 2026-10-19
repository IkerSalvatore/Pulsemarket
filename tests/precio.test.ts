import { describe, it, expect } from "vitest";
import { centavosAPesos, pesosACentavos } from "@/lib/precio";

describe("pesosACentavos", () => {
  it("convierte pesos con centavos a un entero", () => {
    expect(pesosACentavos("199.50")).toBe(19950);
  });

  it("convierte pesos sin decimales", () => {
    expect(pesosACentavos("199")).toBe(19900);
  });

  it("completa un solo decimal (10.5 son 1050 centavos)", () => {
    expect(pesosACentavos("10.5")).toBe(1050);
  });

  it("rechaza más de dos decimales", () => {
    expect(pesosACentavos("10.999")).toBeNull();
    expect(pesosACentavos("1.005")).toBeNull();
  });

  it("rechaza texto, vacío y números negativos", () => {
    expect(pesosACentavos("abc")).toBeNull();
    expect(pesosACentavos("")).toBeNull();
    expect(pesosACentavos("-5")).toBeNull();
  });
});

describe("centavosAPesos", () => {
  it("muestra siempre dos decimales", () => {
    expect(centavosAPesos(1050)).toBe("10.50");
    expect(centavosAPesos(0)).toBe("0.00");
  });

  it("conserva los centavos menores a diez", () => {
    expect(centavosAPesos(7)).toBe("0.07");
  });

  it("al convertir de ida y vuelta no se pierde nada", () => {
    expect(centavosAPesos(1275)).toBe("12.75");
    expect(pesosACentavos(centavosAPesos(1275))).toBe(1275);
  });
});
