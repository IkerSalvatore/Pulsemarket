import { execFileSync } from "node:child_process";
import path from "node:path";
import { test, expect, type Locator, type Page } from "@playwright/test";

// TODO(Persona 2): cuando exista tests/e2e/auth.setup.ts, activar el estado de
// sesión guardado con la ruta que ella indique, por ejemplo:
// test.use({ storageState: "tests/e2e/.auth/usuario.json" });

// Playwright no puede cargar el cliente de Prisma 7 (usa import.meta), así que
// la base se consulta con un script de tsx, que sí lo carga.
const TSX = path.join(process.cwd(), "node_modules", "tsx", "dist", "cli.mjs");
const SCRIPT = path.join(process.cwd(), "scripts", "e2e-venta.ts");

function scriptVenta(...args: string[]): string {
  const salida = execFileSync(process.execPath, [TSX, SCRIPT, ...args], {
    encoding: "utf8",
  });
  const lineas = salida.trim().split(/\r?\n/);
  return lineas[lineas.length - 1] ?? "";
}

async function arrastrar(page: Page, tarjeta: Locator, destino: Locator) {
  const a = await tarjeta.boundingBox();
  const b = await destino.boundingBox();
  if (!a || !b) throw new Error("No se pudo medir el arrastre");

  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 20 });
  await page.mouse.up();
}

test.describe("Flujo 3: Kanban (interactividad)", () => {
  let ventaId: number | null = null;

  // La base es compartida: pase lo que pase, la venta vuelve a PENDIENTE.
  test.afterEach(() => {
    if (ventaId !== null) {
      scriptVenta("poner", String(ventaId), "PENDIENTE");
    }
  });

  test("arrastrar una tarjeta, recargar y verificar que el cambio persiste", async ({ page }) => {
    test.setTimeout(120_000);

    await page.goto("/dashboard/kanban");

    const origen = page.getByTestId("columna-PENDIENTE");
    const destino = page.getByTestId("columna-PAGADA");
    const tarjeta = origen.locator('[data-testid^="tarjeta-"]').first();
    await expect(tarjeta).toBeVisible();

    const testId = await tarjeta.getAttribute("data-testid");
    if (!testId) throw new Error("La tarjeta no tiene data-testid");
    const id = Number(testId.replace("tarjeta-", ""));
    ventaId = id;

    await arrastrar(page, tarjeta, destino);

    // 1. La interfaz refleja el cambio al instante.
    await expect(destino.getByTestId(testId)).toBeVisible();

    // 2. Se guardó en la base de datos (espera a que termine la Server Action).
    await expect
      .poll(() => scriptVenta("leer", String(id)), {
        timeout: 40_000,
        intervals: [2_000],
      })
      .toBe("PAGADA");

    // 3. Tras recargar, la tarjeta ya no está en su columna de origen.
    await page.reload();
    await expect(page.getByTestId("columna-PENDIENTE").getByTestId(testId)).toHaveCount(0);
  });
});
