import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <Outlet />
    </main>
  );
}
