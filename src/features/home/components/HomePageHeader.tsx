import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  displayName: string;
}

export const HomePageHeader = ({ displayName }: Props) => {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-700">Tu espacio</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Hola, {displayName}
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Organiza tus próximos encuentros desde un solo lugar.
        </p>
      </div>
      <Link
        className="hidden items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 sm:flex"
        to="/events/new"
      >
        <Plus className="size-5" />
        Crear evento
      </Link>
    </div>
  );
};
