import { getErrorMessage } from "@/lib/errors";

type ErrorStateProps = {
  action?: React.ReactNode;
  className?: string;
  error: unknown;
};

export function ErrorState({ action, className = "", error }: ErrorStateProps) {
  return (
    <section className={className}>
      <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {getErrorMessage(error)}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </section>
  );
}
