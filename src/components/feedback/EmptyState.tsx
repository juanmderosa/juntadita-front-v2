type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section className="mx-auto max-w-md py-16 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      {description ? (
        <p className="mt-3 text-sm text-stone-600">{description}</p>
      ) : null}
    </section>
  );
}
