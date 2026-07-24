import type { InputHTMLAttributes } from "react";
import { useFormContext, type FieldValues, type Path } from "react-hook-form";

type RHFormInputProps<TValues extends FieldValues> = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: Path<TValues>;
};

export function RHFormInput<TValues extends FieldValues>({
  className = "",
  label,
  name,
  ...props
}: RHFormInputProps<TValues>) {
  const {
    formState: { errors },
    register,
  } = useFormContext<TValues>();
  const error = errors[name]?.message;

  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-800">{label}</span>
      <input
        className={`mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 ${className}`}
        {...register(name)}
        {...props}
      />
      {typeof error === "string" ? (
        <span className="mt-2 block text-sm text-red-700">{error}</span>
      ) : null}
    </label>
  );
}
