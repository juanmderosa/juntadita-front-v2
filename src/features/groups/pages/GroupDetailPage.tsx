import { Link } from "react-router-dom";

export function GroupDetailPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
      <Link
        className="text-sm font-semibold text-indigo-700 hover:text-indigo-800"
        to="/groups">
        ← Volver a grupos
      </Link>
      <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
        Detalle del grupo
      </h1>
      <p className="mt-2 text-slate-600">
        La administración de contactos se incorporará en la siguiente etapa.
      </p>
    </section>
  );
}
