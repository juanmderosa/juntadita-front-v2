import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { usersApi } from "@/api/users.api";
import { getErrorMessage } from "@/lib/errors";
import { getSupabaseBrowser } from "@/lib/supabase";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  emailOtpSchema,
  otpCodeSchema,
  type EmailOtpInput,
  type OtpCodeInput,
} from "@/features/auth/schemas/auth.schemas";

type LoginStep = "email" | "code";

export function useLoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuthenticatedSession } = useAuth();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<LoginStep>("email");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const emailForm = useForm<EmailOtpInput>({
    resolver: zodResolver(emailOtpSchema),
    defaultValues: { email: "" },
  });

  const codeForm = useForm<OtpCodeInput>({
    resolver: zodResolver(otpCodeSchema),
    defaultValues: { code: "" },
  });

  const isSubmitting = emailForm.formState.isSubmitting || codeForm.formState.isSubmitting;

  async function requestCode(values: EmailOtpInput) {
    setError(null);
    setStatus(null);

    try {
      const normalizedEmail = values.email.trim().toLowerCase();
      const { error } = await getSupabaseBrowser().auth.signInWithOtp({
        email: normalizedEmail,
        options: { shouldCreateUser: true },
      });

      if (error) throw error;

      setEmail(normalizedEmail);
      setStep("code");
      setStatus("Te enviamos un codigo para entrar.");
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }

  async function verifyCode(values: OtpCodeInput) {
    setError(null);
    setStatus(null);

    try {
      const { data, error } = await getSupabaseBrowser().auth.verifyOtp({
        email,
        token: values.code.trim(),
        type: "email",
      });

      if (error) throw error;

      const verifiedSession = data.session;
      const accessToken = verifiedSession?.access_token;
      if (!verifiedSession || !accessToken) {
        throw new Error("No pudimos iniciar la sesion con ese codigo.");
      }

      setAuthenticatedSession(verifiedSession);
      const currentUser = await usersApi.getCurrentUser(accessToken);
      queryClient.setQueryData(["users", "me", accessToken], currentUser);

      navigate(currentUser.requiresProfileOnboarding ? "/onboarding" : "/", {
        replace: true,
      });
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }

  function goBackToEmail() {
    setStep("email");
    setStatus(null);
    setError(null);
    codeForm.reset();
  }

  return {
    codeForm,
    description:
      step === "email"
        ? "Ingresa tu email y te mandamos un codigo para entrar o crear tu cuenta."
        : `Escribi el codigo que enviamos a ${email}.`,
    emailForm,
    error,
    goBackToEmail,
    isSubmitting,
    requestCode,
    status,
    step,
    title: step === "email" ? "Entrar a Juntadita" : "Verificar codigo",
    verifyCode,
  };
}
