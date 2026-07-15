import type { UseFormReturn } from "react-hook-form";
import type { InviteParticipantsFormInput } from "@/features/events/schemas/events.schemas";

type InviteEmailsFieldProps = {
  form: UseFormReturn<InviteParticipantsFormInput>;
};

export function InviteEmailsField({ form }: InviteEmailsFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-800">Emails</span>
      <textarea
        className="mt-2 min-h-28 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        placeholder="ana@mail.com, juan@mail.com (opcional si elegis un grupo)"
        {...form.register("emailsText")}
      />
      {form.formState.errors.emailsText?.message ? (
        <span className="mt-2 block text-sm text-red-700">
          {form.formState.errors.emailsText.message}
        </span>
      ) : null}
    </label>
  );
}
