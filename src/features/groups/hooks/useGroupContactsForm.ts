import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getEmailsValidationError, parseEmails } from "@/lib/emails";
import {
  addGroupContactsFormSchema,
  type AddGroupContactsFormInput,
} from "@/features/groups/schemas/groups.schemas";

export function useGroupContactsForm(
  onAdd: (emails: string[]) => Promise<void>,
) {
  const form = useForm<AddGroupContactsFormInput>({
    resolver: zodResolver(addGroupContactsFormSchema),
    defaultValues: { emailsText: "" },
  });
  async function submit(values: AddGroupContactsFormInput) {
    const emails = parseEmails(values.emailsText);
    const error = getEmailsValidationError(emails);
    if (error) {
      form.setError("emailsText", { message: error });
      return;
    }
    await onAdd(emails);
    form.reset();
  }
  return { form, submit };
}
