import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { usersApi } from "@/api/users.api";
import { getErrorMessage } from "@/lib/errors";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  displayNameSchema,
  type DisplayNameInput,
} from "@/features/auth/schemas/auth.schemas";

export function useOnboardingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessToken, currentUser } = useAuth();
  const form = useForm<DisplayNameInput>({
    resolver: zodResolver(displayNameSchema),
    defaultValues: {
      displayName: currentUser?.profile.displayName ?? "",
    },
  });

  async function saveProfile(values: DisplayNameInput) {
    if (!accessToken) return;

    try {
      const updatedUser = await usersApi.updateCurrentUserProfile(
        accessToken,
        values.displayName,
      );

      queryClient.setQueryData(["users", "me", accessToken], updatedUser);
      navigate("/", { replace: true });
    } catch (error) {
      form.setError("root", { message: getErrorMessage(error) });
    }
  }

  return {
    form,
    isSubmitting: form.formState.isSubmitting,
    rootError: form.formState.errors.root?.message,
    saveProfile,
    submitLabel: form.formState.isSubmitting ? "Guardando..." : "Guardar y entrar",
  };
}
