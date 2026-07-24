import { X } from "lucide-react";
import type { ContactGroupMember } from "@/types/groups";

type Props = {
  isRemoving: boolean;
  members: ContactGroupMember[];
  onRequestRemove: (member: ContactGroupMember) => void;
};
export function GroupMembersList({ isRemoving, members, onRequestRemove }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-950">Contactos</h2>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
          {members.length}
        </span>
      </div>
      {members.length === 0 ? (
        <p className="mt-5 text-sm text-slate-500">Este grupo todavía no tiene contactos.</p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
          {members.map((member) => (
            <li className="flex items-center justify-between gap-3 py-3" key={member.id}>
              <span className="truncate text-sm font-medium text-slate-700">{member.email}</span>
              <button
                aria-label={`Quitar ${member.email}`}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                disabled={isRemoving}
                onClick={() => onRequestRemove(member)}
                type="button"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
