import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-indigo-600">Juntadita</p>
          <h1 className="mt-2 text-2xl font-bold text-gray-950">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
