import { Users } from "lucide-react";

export function GroupsEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-10 text-center">
      <Users
        aria-hidden="true"
        className="mx-auto size-9 text-indigo-600"
      />
      <h2 className="mt-4 text-xl font-bold text-slate-900">
        Tu agenda está vacía
      </h2>
      <p className="mt-2 text-slate-600">
        Creá un grupo para tener a tus contactos habituales siempre a mano.
      </p>
    </div>
  );
}
