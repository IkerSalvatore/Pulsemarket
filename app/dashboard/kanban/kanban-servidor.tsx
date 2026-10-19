import { cargarTablero } from "@/lib/kanban-datos";
import { KanbanTablero } from "./kanban-tablero";

export async function KanbanServidor() {
  const inicial = await cargarTablero();
  return <KanbanTablero inicial={inicial} />;
}
