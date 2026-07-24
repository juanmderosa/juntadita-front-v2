import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createGroupFormSchema,
  type CreateGroupFormInput,
} from "@/features/groups/schemas/groups.schemas";

export function useGroupNameForm(name: string, onSave: (name: string) => Promise<void>) {
  const form = useForm<CreateGroupFormInput>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: { name },
  });
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => form.reset({ name }), [form, name]);

  async function submit(values: CreateGroupFormInput) {
    await onSave(values.name);
    setIsEditing(false);
  }
  function cancel() {
    form.reset({ name });
    setIsEditing(false);
  }
  return { form, submit, isEditing, startEditing: () => setIsEditing(true), cancel };
}
