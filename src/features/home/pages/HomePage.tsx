import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../auth/hooks/useAuth";

export function HomePage() {
  const { currentUser, signOut } = useAuth();

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10">
      <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Juntadita</p>
            <h1 className="mt-2 text-2xl font-bold text-gray-950">
              Hola, {currentUser?.profile.displayName ?? "bienvenido"}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
              La app base ya esta protegida por sesion. Las features del MVP se
              agregaran por tareas aceptadas.
            </p>
          </div>
          <Button
            className="w-full sm:w-auto"
            onClick={() => void signOut()}
          >
            Cerrar sesion
          </Button>
        </div>
      </div>
    </section>
  );
}
