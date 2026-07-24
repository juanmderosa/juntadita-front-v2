import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  paymentFormSchema,
  type PaymentFormInput,
} from "@/features/payments/schemas/payments.schemas";
import { parseMoneyToCents } from "@/lib/money";
import type { EventParticipant } from "@/types/events";
import type { CreatePaymentInput, PaymentSuggestion } from "@/types/payments";

type Params = {
  isOpen: boolean;
  allowedPayers: EventParticipant[];
  suggestions: PaymentSuggestion[];
  onSave: (input: CreatePaymentInput) => Promise<unknown>;
};

export function usePaymentForm({ isOpen, allowedPayers, suggestions, onSave }: Params) {
  const form = useForm<PaymentFormInput>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      fromParticipantId: allowedPayers[0]?.id ?? "",
      toParticipantId: "",
      amount: "",
      note: "",
    },
  });
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const fromParticipantId = form.watch("fromParticipantId");
  const toParticipantId = form.watch("toParticipantId");
  const recipientSuggestions = useMemo(
    () => suggestions.filter((suggestion) => suggestion.fromParticipantId === fromParticipantId),
    [fromParticipantId, suggestions],
  );
  const selectedSuggestion = recipientSuggestions.find(
    (suggestion) => suggestion.toParticipantId === toParticipantId,
  );

  useEffect(() => {
    if (!isOpen) return;
    const payerId = allowedPayers[0]?.id ?? "";
    const suggestion = suggestions.find((item) => item.fromParticipantId === payerId);
    form.reset({
      fromParticipantId: payerId,
      toParticipantId: suggestion?.toParticipantId ?? "",
      amount: suggestion ? String(suggestion.amountCents / 100) : "",
      note: "",
    });
    setIsCustomAmount(false);
  }, [isOpen, allowedPayers, suggestions, form]);

  useEffect(() => {
    if (
      fromParticipantId &&
      !recipientSuggestions.some((suggestion) => suggestion.toParticipantId === toParticipantId)
    ) {
      form.setValue("toParticipantId", recipientSuggestions[0]?.toParticipantId ?? "");
    }
  }, [fromParticipantId, recipientSuggestions, toParticipantId, form]);

  useEffect(() => {
    if (selectedSuggestion && !isCustomAmount)
      form.setValue("amount", String(selectedSuggestion.amountCents / 100), {
        shouldValidate: true,
      });
  }, [selectedSuggestion, isCustomAmount, form]);

  const useSuggestedAmount = () => {
    if (!selectedSuggestion) return;
    form.setValue("amount", String(selectedSuggestion.amountCents / 100), {
      shouldValidate: true,
    });
    setIsCustomAmount(false);
  };
  const submit = form.handleSubmit(async (value) =>
    onSave({
      fromParticipantId: value.fromParticipantId,
      toParticipantId: value.toParticipantId,
      amountCents: parseMoneyToCents(value.amount),
      note: value.note || null,
    }),
  );
  return {
    form,
    isCustomAmount,
    setIsCustomAmount,
    recipientSuggestions,
    selectedSuggestion,
    submit,
    useSuggestedAmount,
  };
}
