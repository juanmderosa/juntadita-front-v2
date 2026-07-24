type EmptyStateProps = {
  action?: React.ReactNode;
  className?: string;
  description?: string;
  title: string;
};

export function EmptyState({
  action,
  className = "mx-auto max-w-md py-16 text-center",
  description,
  title,
}: EmptyStateProps) {
  return (
    <section className={className}>
      <h1 className="text-2xl font-bold">{title}</h1>
      {description ? <p className="mt-3 text-sm text-stone-600">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </section>
  );
}
