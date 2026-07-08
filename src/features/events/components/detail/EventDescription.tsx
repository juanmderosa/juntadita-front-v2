interface Props {
  description: string | null;
}

export const EventDescription = ({ description }: Props) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-8">
      <h2 className="text-lg font-bold text-slate-950">Sobre este evento</h2>
      <p className="mt-4 whitespace-pre-wrap text-base leading-7 text-slate-600">
        {description || "Todavia no se agrego una descripcion."}
      </p>
    </article>
  );
};
