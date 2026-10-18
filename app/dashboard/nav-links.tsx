"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ENLACES = [
  { href: "/dashboard", etiqueta: "Resumen" },
  { href: "/dashboard/productos", etiqueta: "Productos" },
  { href: "/dashboard/ventas", etiqueta: "Ventas" },
  { href: "/dashboard/kanban", etiqueta: "Kanban" },
] as const;

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegación del dashboard" className="flex flex-col gap-1">
      {ENLACES.map((enlace) => {
        const activo =
          enlace.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(enlace.href);

        return (
          <Link
            key={enlace.href}
            href={enlace.href}
            aria-current={activo ? "page" : undefined}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activo
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {enlace.etiqueta}
          </Link>
        );
      })}
    </nav>
  );
}
