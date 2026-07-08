import { RHForm } from "@/components/forms/RHForm";
import { RHFormInput } from "@/components/forms/RHFormInput";
import { Button } from "@/components/ui/Button";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { AuthStatus } from "@/features/auth/components/AuthStatus";
import { useLoginPage } from "@/features/auth/hooks/useLoginPage";
import {
  type EmailOtpInput,
  type OtpCodeInput,
} from "@/features/auth/schemas/auth.schemas";

export function LoginPage() {
  const login = useLoginPage();

  return (
    <AuthShell
      description={login.description}
      title={login.title}
    >
      <div className="space-y-4">
        <AuthStatus error={login.error} success={login.status} />

        {login.step === "email" ? (
          <RHForm form={login.emailForm} onSubmit={login.requestCode}>
            <RHFormInput<EmailOtpInput>
              autoComplete="email"
              label="Email"
              name="email"
              placeholder="juan@example.com"
              type="email"
            />
            <Button className="w-full" disabled={login.isSubmitting} type="submit">
              {login.isSubmitting ? "Enviando..." : "Enviar codigo"}
            </Button>
          </RHForm>
        ) : (
          <RHForm form={login.codeForm} onSubmit={login.verifyCode}>
            <RHFormInput<OtpCodeInput>
              autoComplete="one-time-code"
              inputMode="numeric"
              label="Codigo"
              name="code"
              placeholder="123456"
              type="text"
            />
            <Button className="w-full" disabled={login.isSubmitting} type="submit">
              {login.isSubmitting ? "Verificando..." : "Entrar"}
            </Button>
            <button
              className="w-full rounded-lg px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
              onClick={login.goBackToEmail}
              type="button"
            >
              Cambiar email
            </button>
          </RHForm>
        )}
      </div>
    </AuthShell>
  );
}
