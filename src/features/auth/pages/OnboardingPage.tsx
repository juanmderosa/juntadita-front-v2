import { RHForm } from "../../../components/forms/RHForm";
import { RHFormInput } from "../../../components/forms/RHFormInput";
import { Button } from "../../../components/ui/Button";
import { AuthShell } from "../components/AuthShell";
import { AuthStatus } from "../components/AuthStatus";
import { useOnboardingPage } from "../hooks/useOnboardingPage";
import type { DisplayNameInput } from "../schemas/auth.schemas";

export function OnboardingPage() {
  const onboarding = useOnboardingPage();

  return (
    <AuthShell
      description="Este nombre lo van a ver tus invitados y contactos cuando organices una juntadita."
      title="Completa tu perfil"
    >
      <RHForm form={onboarding.form} onSubmit={onboarding.saveProfile}>
        <AuthStatus error={onboarding.rootError} />
        <RHFormInput<DisplayNameInput>
          autoComplete="name"
          label="Nombre visible"
          name="displayName"
          placeholder="Juan"
          type="text"
        />
        <Button
          className="w-full"
          disabled={onboarding.isSubmitting}
          type="submit"
        >
          {onboarding.submitLabel}
        </Button>
      </RHForm>
    </AuthShell>
  );
}
