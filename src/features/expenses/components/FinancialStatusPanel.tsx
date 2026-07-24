import { Button } from "@/components/ui/Button";

type Props = {
  canManage: boolean;
  financialStatus: "collecting_expenses" | "payments_enabled";
  hasBeenFinanciallyClosed: boolean;
  onEnablePayments: () => void;
  onReopenExpenses: () => void;
};

export function FinancialStatusPanel({
  canManage,
  financialStatus,
  hasBeenFinanciallyClosed,
  onEnablePayments,
  onReopenExpenses,
}: Props) {
  const paymentsEnabled = financialStatus === "payments_enabled";
  return (
    <section
      className={`mt-6 rounded-2xl border p-5 ${paymentsEnabled ? "border-emerald-200 bg-emerald-50" : "border-indigo-100 bg-indigo-50"}`}
    >
      <p className="font-bold">
        {paymentsEnabled
          ? "Pagos habilitados"
          : hasBeenFinanciallyClosed
            ? "Gastos reabiertos"
            : "Gastos abiertos"}
      </p>
      <p className="mt-1 text-sm text-slate-700">
        {paymentsEnabled
          ? "Los gastos y participantes financieros están congelados para evitar que cambien las deudas."
          : hasBeenFinanciallyClosed
            ? "Los pagos históricos se conservan. Corregí los gastos y volvé a habilitar pagos cuando termines."
            : "Pedí al grupo que cargue cualquier gasto antes de habilitar los pagos."}
      </p>
      {canManage ? (
        <Button
          className="mt-4"
          variant={paymentsEnabled ? "secondary" : "primary"}
          onClick={paymentsEnabled ? onReopenExpenses : onEnablePayments}
        >
          {paymentsEnabled ? "Reabrir gastos" : "Habilitar pagos"}
        </Button>
      ) : null}
    </section>
  );
}
