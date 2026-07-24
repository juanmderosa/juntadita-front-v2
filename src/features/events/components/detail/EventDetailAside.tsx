import { Crown } from "lucide-react";

interface Props {
  canManage: boolean;
  currencyCode: string;
  timezone: string;
}

export const EventDetailAside = ({ canManage, currencyCode, timezone }: Props) => {
  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Tu acceso</h2>
      <p className="mt-4 flex items-center gap-2 text-base font-bold text-slate-900">
        {canManage ? <Crown className="size-5 text-amber-600" /> : null}
        {canManage ? "Organizador" : "Participante"}
      </p>
      <dl className="mt-6 space-y-4 text-sm">
        <div>
          <dt className="text-slate-500">Moneda</dt>
          <dd className="mt-1 font-bold">{currencyCode}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Zona horaria</dt>
          <dd className="mt-1 wrap-break-words font-bold">{timezone}</dd>
        </div>
      </dl>
    </aside>
  );
};
