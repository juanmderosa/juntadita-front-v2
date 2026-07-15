import { ChevronRight, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { ContactGroup } from "@/types/groups";

type GroupCardProps = { group: ContactGroup };

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Link
      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_8px_28px_rgba(15,23,42,0.08)]"
      to={`/groups/${group.id}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
          <Users
            aria-hidden="true"
            className="size-5"
          />
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          Privado
        </span>
      </div>
      <h2 className="mt-5 text-xl font-bold text-slate-950">{group.name}</h2>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-600">
        <span>
          {group.memberCount}{" "}
          {group.memberCount === 1 ? "contacto" : "contactos"}
        </span>
        <span className="flex items-center gap-1 font-semibold text-indigo-700">
          Ver grupo{" "}
          <ChevronRight
            aria-hidden="true"
            className="size-4"
          />
        </span>
      </div>
    </Link>
  );
}
