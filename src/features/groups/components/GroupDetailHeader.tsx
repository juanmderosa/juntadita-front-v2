import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

type Props = { onDelete: () => void };

export function GroupDetailHeader({ onDelete }: Props) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <Link
          className="text-sm font-semibold text-indigo-700 hover:text-indigo-800"
          to="/groups">
          ← Volver a grupos
        </Link>
        <p className="mt-5 text-sm font-semibold text-indigo-600">
          Agenda personal
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          Administrar grupo
        </h1>
      </div>
      <button
        aria-label="Eliminar grupo"
        className="rounded-lg p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-700"
        onClick={onDelete}
        type="button">
        <Trash2
          aria-hidden="true"
          className="size-5"
        />
      </button>
    </header>
  );
}
