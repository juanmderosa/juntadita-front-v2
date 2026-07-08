type EventParticipantsHeaderProps = {
  participantsCount: number;
};

export function EventParticipantsHeader({
  participantsCount,
}: EventParticipantsHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-950">Invitados</h2>
        <p className="mt-1 text-sm text-slate-500">
          Personas que pueden acceder al evento con su email.
        </p>
      </div>
      <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
        {participantsCount} participantes
      </span>
    </div>
  );
}
