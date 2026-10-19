"use client";

import { useState, useTransition } from "react";
import { DndContext, type DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { moverVenta } from "@/lib/kanban-acciones";
import {
  ESTADOS,
  esEstado,
  moverTarjeta,
  type Estado,
  type Tablero,
  type Tarjeta,
} from "@/lib/kanban-logica";

function TarjetaVista({ tarjeta }: { tarjeta: Tarjeta }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: tarjeta.id,
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      data-testid={`tarjeta-${tarjeta.id}`}
      className={`touch-none cursor-grab rounded-md border border-zinc-200 bg-white p-3 text-sm shadow-sm dark:border-zinc-700 dark:bg-zinc-900 ${
        isDragging ? "opacity-70" : ""
      }`}
    >
      <p className="font-medium">{tarjeta.titulo}</p>
      <p className="text-zinc-600 dark:text-zinc-400">{tarjeta.detalle}</p>
    </div>
  );
}

function Columna({ estado, tarjetas }: { estado: Estado; tarjetas: Tarjeta[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: estado });
  return (
    <section
      ref={setNodeRef}
      data-testid={`columna-${estado}`}
      className={`flex min-h-64 flex-col gap-2 rounded-lg border p-3 ${
        isOver
          ? "border-zinc-900 dark:border-zinc-100"
          : "border-zinc-200 dark:border-zinc-800"
      }`}
    >
      <h2 className="text-sm font-semibold">
        {estado} ({tarjetas.length})
      </h2>
      {tarjetas.map((t) => (
        <TarjetaVista key={t.id} tarjeta={t} />
      ))}
    </section>
  );
}

export function KanbanTablero({ inicial }: { inicial: Tablero }) {
  const [tablero, setTablero] = useState<Tablero>(inicial);
  const [error, setError] = useState<string | null>(null);
  const [, iniciarTransicion] = useTransition();

  function alSoltar(evento: DragEndEvent) {
    const { active, over } = evento;
    if (!over) return;
    const destino = over.id;
    if (!esEstado(destino)) return;

    const id = Number(active.id);
    const anterior = tablero;
    const siguiente = moverTarjeta(anterior, id, destino);
    if (siguiente === anterior) return;

    setError(null);
    setTablero(siguiente); // actualización optimista

    iniciarTransicion(async () => {
      const resultado = await moverVenta({ id, estado: destino });
      if (!resultado.ok) {
        setTablero(anterior); // revertir (tarea 2.5)
        setError(resultado.error);
      }
    });
  }

  return (
    <div>
      {error && (
        <p role="alert" className="mb-3 rounded-md bg-red-100 p-3 text-sm text-red-800">
          {error}
        </p>
      )}
      {/* id fijo evita avisos de hidratación de dnd-kit */}
      <DndContext id="kanban" onDragEnd={alSoltar}>
        <div className="grid gap-4 md:grid-cols-4">
          {ESTADOS.map((estado) => (
            <Columna key={estado} estado={estado} tarjetas={tablero[estado]} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
