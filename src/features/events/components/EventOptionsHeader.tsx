type EventOptionsHeaderProps = {
  optionsCount: number;
};

export function EventOptionsHeader({ optionsCount }: EventOptionsHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-950">
          Opciones de votacion
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Dias, horarios o franjas posibles para esta juntadita.
        </p>
      </div>
      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
        {optionsCount} opciones
      </span>
    </div>
  );
}
