type AuthStatusProps = {
  error?: string | null;
  success?: string | null;
};

export function AuthStatus({ error, success }: AuthStatusProps) {
  if (!error && !success) return null;

  return (
    <div
      className={`rounded-lg border px-3 py-2 text-sm ${
        error
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-teal-200 bg-teal-50 text-teal-800"
      }`}
      role="status"
    >
      {error ?? success}
    </div>
  );
}
