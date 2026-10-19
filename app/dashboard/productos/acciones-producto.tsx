"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { eliminarProductoAccion } from "@/lib/productos-acciones";

type AccionesProductoProps = {
  id: number;
  nombre: string;
  mostrarEditar?: boolean;
};

export function AccionesProducto({
  id,
  nombre,
  mostrarEditar = true,
}: AccionesProductoProps) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function alEliminar() {
    const confirmado = window.confirm(
      `¿Eliminar "${nombre}"? Dejará de aparecer en el catálogo, pero se conserva en los reportes.`,
    );
    if (!confirmado) return;

    setError(null);
    iniciar(async () => {
      const resultado = await eliminarProductoAccion(id);
      if (!resultado.ok) {
        setError(resultado.mensaje ?? "No se pudo eliminar el producto.");
        return;
      }
      router.push("/dashboard/productos");
    });
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      {mostrarEditar && (
        <Link href={`/dashboard/productos/editar/${id}`} className="underline">
          Editar
        </Link>
      )}
      <button
        type="button"
        onClick={alEliminar}
        disabled={pendiente}
        className="text-red-700 underline disabled:opacity-50"
      >
        {pendiente ? "Eliminando..." : "Eliminar"}
      </button>
      {error && (
        <span role="alert" className="text-red-700">
          {error}
        </span>
      )}
    </div>
  );
}
