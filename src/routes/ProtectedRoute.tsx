import { Navigate, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getAuthRedirectPath } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";

type ProtectedRouteProps = {
  mode?: "app" | "onboarding" | "public";
};

export function ProtectedRoute({ mode = "app" }: ProtectedRouteProps) {
  const { session, currentUser, isLoading, error, signOut } = useAuth();
  const requiresOnboarding = currentUser?.requiresProfileOnboarding;

  if (isLoading) {
    return (
      <AuthShell description="Estamos preparando tu sesion." title="Cargando">
        <p className="text-sm text-gray-600">Un momento...</p>
      </AuthShell>
    );
  }

  if (error) {
    return (
      <AuthShell
        description="No pudimos resolver tu sesion. Proba cerrar sesion e ingresar otra vez."
        title="Algo no salio bien"
      >
        <div className="space-y-4">
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {getErrorMessage(error)}
          </p>
          <Button className="w-full" onClick={() => void signOut()}>
            Cerrar sesion
          </Button>
        </div>
      </AuthShell>
    );
  }

  if (mode === "public") {
    if (!session) return <Outlet />;

    return <Navigate replace to={requiresOnboarding ? "/onboarding" : "/"} />;
  }

  if (!session) {
    return <Navigate replace to={getAuthRedirectPath()} />;
  }

  if (mode === "onboarding") {
    if (!requiresOnboarding) return <Navigate replace to="/" />;

    return <Outlet />;
  }

  if (requiresOnboarding) {
    return <Navigate replace to="/onboarding" />;
  }

  return <Outlet />;
}
