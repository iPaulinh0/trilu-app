"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ScreenShell } from "@/components/shared/screen-shell";
import { SignupForm } from "@/features/auth/components/signup-form";
import { useOnboardingDraft } from "@/features/onboarding/hooks/use-onboarding-draft";

export default function CadastroPage() {
  const router = useRouter();
  const { draft, isHydrated } = useOnboardingDraft();
  const hasCompletedOnboarding = draft.bmr !== null && draft.tdee !== null;

  useEffect(() => {
    if (isHydrated && !hasCompletedOnboarding) router.replace("/onboarding");
  }, [isHydrated, hasCompletedOnboarding, router]);

  if (!isHydrated || !hasCompletedOnboarding) return null;

  return (
    <ScreenShell>
      <SignupForm />
    </ScreenShell>
  );
}
