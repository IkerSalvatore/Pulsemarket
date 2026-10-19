"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { ChangeEvent } from "react";
import type { EstadoFormulario } from "@/lib/productos-acciones";

type Accion = (
  estadoPrevio: EstadoFormulario,
  formData: FormData,
) => Promise<EstadoFormulario>;

type Valores = {
  nombre: string;
  categoria: string;
  precio: string;
  stock: string;
};

const VACIOS: Valores = { nombre: "", categoria: "", precio: "", stock: "0" };

type CampoProps = {
  id: keyof Valores;
  etiqueta: string;
  valor: string;
  ayuda?: string;
  error?: string;
  inputMode?: "text" | "decimal" | "numeric";
  alCambiar: (evento: ChangeEvent<HTMLInputElement>) => void;
};

function Campo({
  id,
  etiqueta,
  valor,
  ayuda,
  error,
  inputMode = "text",
  alCambiar,
}: CampoProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {etiqueta}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        inputMode={inputMode}
        value={valor}
        onChange={alCambiar}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? id + "-error" : undefined}
        className="mt-1 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
      />
      {ayuda && !error && (
        <p className="mt-1 text-xs text-zinc-500">{ayuda}</p>
      )}
      {error && (
        <p id={id + "-error"} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

type FormularioProductoProps = {
  accion: Accion;
  textoBoton: string;
  valoresIniciales?: Valores;
};

export function FormularioProducto({
  accion,
  textoBoton,
  valoresIniciales,
}: FormularioProductoProps) {
  const [estado, formAction, pendiente] = useActionState(accion, { ok: false });
  const [valores, setValores] = useState<Valores>(valoresIniciales ?? VACIOS);

  function alCambiar(campo: keyof Valores) {
    return (evento: ChangeEvent<HTMLInputElement>) => {
      setValores((anterior) => ({ ...anterior, [campo]: evento.target.value }));
    };
  }

  return (
    <form action={formAction} className="mt-4 max-w-md space-y-4">
      {estado.mensaje && (
        <p
          role={estado.ok ? "status" : "alert"}
          className={
            estado.ok
              ? "rounded-md border border-green-500 bg-green-50 p-3 text-sm text-green-800"
              : "rounded-md border border-red-500 bg-red-50 p-3 text-sm text-red-700"
          }
        >
          {estado.mensaje}
        </p>
      )}

      <Campo
        id="nombre"
        etiqueta="Nombre"
        valor={valores.nombre}
        error={estado.errores?.nombre?.[0]}
        alCambiar={alCambiar("nombre")}
      />
      <Campo
        id="categoria"
        etiqueta="Categoría"
        valor={valores.categoria}
        error={estado.errores?.categoria?.[0]}
        alCambiar={alCambiar("categoria")}
      />
      <Campo
        id="precio"
        etiqueta="Precio (en pesos)"
        valor={valores.precio}
        ayuda="Ejemplo: 199.50"
        inputMode="decimal"
        error={estado.errores?.precio?.[0]}
        alCambiar={alCambiar("precio")}
      />
      <Campo
        id="stock"
        etiqueta="Stock"
        valor={valores.stock}
        inputMode="numeric"
        error={estado.errores?.stock?.[0]}
        alCambiar={alCambiar("stock")}
      />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pendiente}
          className="rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {pendiente ? "Guardando..." : textoBoton}
        </button>
        <Link href="/dashboard/productos" className="text-sm underline">
          Volver a productos
        </Link>
      </div>
    </form>
  );
}
