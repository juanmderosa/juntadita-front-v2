import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createGroupFormSchema,
  type CreateGroupFormInput,
} from "@/features/groups/schemas/groups.schemas";

export function useCreateGroupForm(onCreate: (name: string) => Promise<void>) {
  const form = useForm<CreateGroupFormInput>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: { name: "" },
  });

  async function submit(values: CreateGroupFormInput) {
    await onCreate(values.name);
    form.reset();
  }

  return { form, submit };
}
