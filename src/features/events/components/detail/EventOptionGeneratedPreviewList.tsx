import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatDate, formatDateTime } from "@/lib/dates";
import type { GeneratedEventOptionPreview } from "@/features/events/lib/eventOptionGenerator.lib";

type EventOptionGeneratedPreviewListProps = {
  duplicateCount: number;
  errorMessage: string | null;
  isCreating: boolean;
  newOptionsCount: number;
  options: GeneratedEventOptionPreview[];
  previewCount: number;
  removePreviewOption: (key: string) => void;
  submit: () => Promise<void>;
  timeZone: string;
};

export function EventOptionGeneratedPreviewList({
  duplicateCount,
  errorMessage,
  isCreating,
  newOptionsCount,
  options,
  previewCount,
  removePreviewOption,
  submit,
  timeZone,
}: EventOptionGeneratedPreviewListProps) {
  return (
    <div className="sm:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Vista previa</h4>
          <p className="mt-1 text-sm text-slate-600">
            {newOptionsCount} opciones nuevas
            {duplicateCount > 0 ? `, ${duplicateCount} ya existen` : ""}
          </p>
        </div>
        <Button
          disabled={isCreating || newOptionsCount === 0 || Boolean(errorMessage)}
          onClick={submit}
          type="button">
          {isCreating ? "Creando..." : `Crear ${newOptionsCount} opciones`}
        </Button>
      </div>

      {errorMessage ? (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {errorMessage}
        </p>
      ) : null}

      {previewCount === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-3 text-sm text-slate-600">
          Completa el rango, los dias y los horarios para ver las opciones.
        </p>
      ) : (
        <ul className="mt-3 max-h-72 space-y-2 overflow-auto pr-1">
          {options.map((option) => (
            <li
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2"
              key={option.key}>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {formatPreviewOption(option, timeZone)}
                </p>
                {option.isDuplicate ? (
                  <span className="mt-1 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                    Ya existe
                  </span>
                ) : null}
              </div>
              <button
                aria-label="Quitar opcion"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                onClick={() => removePreviewOption(option.key)}
                type="button">
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatPreviewOption(
  option: GeneratedEventOptionPreview,
  timeZone: string,
) {
  if (option.input.type === "date") {
    return formatDate(option.input.startAt, { timeZone });
  }

  return formatDateTime(option.input.startAt, { timeZone });
}
