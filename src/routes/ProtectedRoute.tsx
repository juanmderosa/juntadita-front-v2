import { Navigate, Outlet } from "react-router-dom";
import { getAuthRedirectPath } from "../lib/auth";

type ProtectedRouteProps = {
  isAllowed?: boolean;
};

export function ProtectedRoute({ isAllowed = false }: ProtectedRouteProps) {
  if (!isAllowed) {
    return <Navigate replace to={getAuthRedirectPath()} />;
  }

  return <Outlet />;
}
