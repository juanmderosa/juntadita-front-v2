import { Button } from "@/components/ui/Button";
import type { EventParticipant } from "@/types/events";
import type { PaymentOverview } from "@/types/payments";

type Props = {
  overview: PaymentOverview;
  currentUserId?: string;
  isAdmin: boolean;
  onRegister: () => void;
  onVoid: (payment: PaymentOverview["payments"][number]) => void;
};
const money = (cents: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(cents / 100);

const name = (participant: EventParticipant) => participant.displayName ?? participant.email;
export function PaymentsSection({ overview, currentUserId, isAdmin, onRegister, onVoid }: Props) {
  const ownBalance = overview.balances.find((item) => item.participant.userId === currentUserId);
  const people = new Map(overview.balances.map((item) => [item.participant.id, item.participant]));
  return (
    <section className="mt-8 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Balances y pagos</h2>
          <p className="text-sm text-slate-600">
            Los importes se calculan con gastos y pagos activos.
          </p>
        </div>
        <Button onClick={onRegister}>Registrar pago</Button>
      </header>
      {ownBalance ? (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
          <p className="text-sm font-semibold text-indigo-900">Tu saldo</p>
          <strong
            className={`text-3xl ${ownBalance.balanceCents < 0 ? "text-red-700" : "text-emerald-700"}`}
          >
            {ownBalance.balanceCents === 0
              ? "Estás al día"
              : ownBalance.balanceCents < 0
                ? `Debés ${money(-ownBalance.balanceCents)}`
                : `Te deben ${money(ownBalance.balanceCents)}`}
          </strong>
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4">
          <h3 className="font-bold">Saldos</h3>
          <ul className="mt-3 space-y-2">
            {overview.balances.map((item) => (
              <li className="flex justify-between text-sm" key={item.participant.id}>
                <span>{name(item.participant)}</span>
                <strong
                  className={
                    item.balanceCents < 0
                      ? "text-red-700"
                      : item.balanceCents > 0
                        ? "text-emerald-700"
                        : "text-slate-600"
                  }
                >
                  {item.balanceCents === 0 ? "Al día" : money(item.balanceCents)}
                </strong>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <h3 className="font-bold">Sugerencias</h3>
          {overview.suggestions.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600">No hay pagos pendientes.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {overview.suggestions.map((item) => (
                <li key={`${item.fromParticipantId}-${item.toParticipantId}`}>
                  <strong>{name(people.get(item.fromParticipantId)!)}</strong> paga{" "}
                  {money(item.amountCents)} a{" "}
                  <strong>{name(people.get(item.toParticipantId)!)}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="rounded-2xl border bg-white p-4">
        <h3 className="font-bold">Historial</h3>
        {overview.payments.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">Todavía no hay pagos registrados.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {overview.payments.map((payment) => {
              const canVoid =
                payment.status === "active" &&
                (isAdmin || payment.createdByUserId === currentUserId);
              return (
                <li
                  className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 text-sm"
                  key={payment.id}
                >
                  <span>
                    <strong>{name(payment.fromParticipant)}</strong> pagó{" "}
                    {money(payment.amountCents)} a <strong>{name(payment.toParticipant)}</strong>
                    {payment.status === "voided" ? (
                      <em className="ml-2 text-red-700">Anulado: {payment.voidReason}</em>
                    ) : null}
                  </span>
                  {canVoid ? (
                    <button className="font-semibold text-red-700" onClick={() => onVoid(payment)}>
                      Anular
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
