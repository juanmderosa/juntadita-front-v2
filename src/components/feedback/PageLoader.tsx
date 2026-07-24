type PageLoaderProps = {
  ariaLabel?: string;
  className?: string;
  itemClassName?: string;
  items?: number;
};

export function PageLoader({
  ariaLabel = "Cargando",
  className = "",
  itemClassName = "h-64 rounded-2xl",
  items = 1,
}: PageLoaderProps) {
  return (
    <div aria-label={ariaLabel} className={className}>
      {Array.from({ length: items }, (_, index) => (
        <div className={`animate-pulse bg-slate-200 ${itemClassName}`} key={index} />
      ))}
    </div>
  );
}
