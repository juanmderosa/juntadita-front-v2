import { FormProvider, type FieldValues, type SubmitHandler, type UseFormReturn } from "react-hook-form";
import type { ReactNode } from "react";

type RHFormProps<TValues extends FieldValues> = {
  children: ReactNode;
  className?: string;
  form: UseFormReturn<TValues>;
  onSubmit: SubmitHandler<TValues>;
};

export function RHForm<TValues extends FieldValues>({
  children,
  className = "space-y-4",
  form,
  onSubmit,
}: RHFormProps<TValues>) {
  return (
    <FormProvider {...form}>
      <form className={className} noValidate onSubmit={form.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  );
}
