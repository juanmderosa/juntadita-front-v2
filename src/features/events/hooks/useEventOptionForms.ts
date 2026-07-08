import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type {
  CreateEventOptionInput,
  EventOption,
  UpdateEventOptionInput,
} from "@/types/events";
import {
  defaultOptionFormValues,
  toCreateEventOptionInput,
  toOptionFormValues,
  toUpdateEventOptionInput,
} from "@/features/events/lib/eventOptions.lib";
import {
  optionFormSchema,
  type OptionFormInput,
} from "@/features/events/schemas/events.schemas";

export function useCreateEventOptionForm({
  createOption,
  timeZone,
}: {
  createOption: (input: CreateEventOptionInput) => Promise<unknown>;
  timeZone: string;
}) {
  const form = useForm<OptionFormInput>({
    resolver: zodResolver(optionFormSchema),
    defaultValues: defaultOptionFormValues,
  });

  async function submit(values: OptionFormInput) {
    await createOption(toCreateEventOptionInput(values, timeZone));
    form.reset(defaultOptionFormValues);
  }

  return {
    form,
    optionType: form.watch("type"),
    submit,
  };
}

export function useEditableEventOption({
  option,
  timeZone,
  updateOption,
}: {
  option: EventOption;
  timeZone: string;
  updateOption: (
    optionId: string,
    input: UpdateEventOptionInput,
  ) => Promise<unknown>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<OptionFormInput>({
    resolver: zodResolver(optionFormSchema),
    defaultValues: toOptionFormValues(option, timeZone),
  });

  async function submit(values: OptionFormInput) {
    await updateOption(option.id, toUpdateEventOptionInput(values, timeZone));
    setIsEditing(false);
  }

  return {
    form,
    isEditing,
    optionType: form.watch("type"),
    startEditing: () => setIsEditing(true),
    cancelEditing: () => setIsEditing(false),
    submit,
  };
}
