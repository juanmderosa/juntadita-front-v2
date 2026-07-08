import {
  CalendarDays,
  LogOut,
  Plus,
  Sparkles,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

function navClass({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
    isActive
      ? "bg-indigo-50 text-indigo-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
  }`;
}

export function AuthenticatedLayout() {
  const { currentUser, signOut } = useAuth();
  const displayName = currentUser?.profile.displayName ?? "Organizador";

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white px-5 py-7 lg:flex">
        <NavLink className="flex items-center gap-2 text-2xl font-bold text-indigo-700" to="/">
          <Sparkles aria-hidden="true" className="size-7" />
          Juntadita
        </NavLink>

        <nav className="mt-10 space-y-2" aria-label="Navegacion principal">
          <NavLink className={navClass} end to="/">
            <CalendarDays aria-hidden="true" className="size-5" />
            Mis eventos
          </NavLink>
          <NavLink className={navClass} to="/events/new">
            <Plus aria-hidden="true" className="size-5" />
            Crear evento
          </NavLink>
        </nav>

        <div className="mt-auto rounded-2xl bg-slate-50 p-4">
          <p className="truncate text-sm font-bold text-slate-900">{displayName}</p>
          <p className="mt-1 text-xs text-slate-500">Organizador</p>
          <button
            className="mt-4 flex w-full items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-700"
            onClick={() => void signOut()}
            type="button"
          >
            <LogOut aria-hidden="true" className="size-4" />
            Cerrar sesion
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden">
        <NavLink className="flex items-center gap-2 text-xl font-bold text-indigo-700" to="/">
          <Sparkles aria-hidden="true" className="size-6" />
          Juntadita
        </NavLink>
        <button
          aria-label="Cerrar sesion"
          className="rounded-full bg-slate-100 p-2 text-slate-600"
          onClick={() => void signOut()}
          type="button"
        >
          <LogOut aria-hidden="true" className="size-5" />
        </button>
      </header>

      <main className="min-h-screen pb-24 lg:ml-64 lg:pb-0">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid h-20 grid-cols-2 border-t border-slate-200 bg-white px-6 lg:hidden" aria-label="Navegacion movil">
        <NavLink className={navClass} end to="/">
          <CalendarDays aria-hidden="true" className="size-5" />
          Eventos
        </NavLink>
        <NavLink className={navClass} to="/events/new">
          <Plus aria-hidden="true" className="size-5" />
          Crear
        </NavLink>
      </nav>
    </div>
  );
}
