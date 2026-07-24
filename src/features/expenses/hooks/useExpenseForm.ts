import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Expense, ExpenseInput } from "@/types/expenses";
import type { EventParticipant } from "@/types/events";

const formSchema = z.object({
  title: z.string().trim().min(1, "Ingresa un concepto."),
  description: z.string(),
  amount: z.number().positive("Ingresa un monto válido."),
  paidByParticipantId: z.string().min(1),
  splitMethod: z.enum(["equal", "custom"]),
  participantIds: z.array(z.string()).min(1, "Selecciona al menos una persona."),
  customAmounts: z.record(z.string(), z.string()),
  files: z.array(z.instanceof(File)).max(5),
});
export type ExpenseFormValues = z.infer<typeof formSchema>;

export function useExpenseForm(
  expense: Expense | null,
  participants: EventParticipant[],
  onSave: (input: ExpenseInput, files: File[]) => Promise<void>,
) {
  const eligible = useMemo(
    () =>
      participants.filter(
        (participant) => participant.participatesInExpenses && participant.status !== "removed",
      ),
    [participants],
  );
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaults(expense, eligible),
  });
  const { reset } = form;

  useEffect(() => {
    reset(getDefaults(expense, eligible));
  }, [expense, eligible, reset]);

  const submit = async (values: ExpenseFormValues) => {
    const amountCents = Math.round(values.amount * 100);
    const input: ExpenseInput =
      values.splitMethod === "equal"
        ? {
            paidByParticipantId: values.paidByParticipantId,
            title: values.title,
            description: values.description || null,
            amountCents,
            splitMethod: "equal",
            participantIds: values.participantIds,
          }
        : {
            paidByParticipantId: values.paidByParticipantId,
            title: values.title,
            description: values.description || null,
            amountCents,
            splitMethod: "custom",
            splits: values.participantIds.map((participantId) => ({
              participantId,
              amountCents: Math.round(Number(values.customAmounts[participantId] ?? 0) * 100),
            })),
          };
    await onSave(input, values.files);
  };
  return { form, submit, eligible };
}

function getDefaults(expense: Expense | null, participants: EventParticipant[]): ExpenseFormValues {
  const splitIds =
    expense?.splits.map((split) => split.participantId) ??
    participants.map((participant) => participant.id);
  return {
    title: expense?.title ?? "",
    description: expense?.description ?? "",
    amount: expense ? expense.amountCents / 100 : 0,
    paidByParticipantId: expense?.paidByParticipantId ?? participants[0]?.id ?? "",
    splitMethod: expense?.splitMethod ?? "equal",
    participantIds: splitIds,
    customAmounts: Object.fromEntries(
      expense?.splits.map((split) => [split.participantId, String(split.amountCents / 100)]) ?? [],
    ),
    files: [],
  };
}
