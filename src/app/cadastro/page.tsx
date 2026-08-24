"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenShell } from "@/components/shared/screen-shell";
import { SignupForm } from "@/features/auth/components/signup-form";
import { useOnboardingDraft } from "@/features/onboarding/hooks/use-onboarding-draft";

export default function CadastroPage() {
  const router = useRouter();
  const { draft, isHydrated, resetDraft } = useOnboardingDraft();
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isHydrated || isCompleted) return;
    if (draft.bmr === null || draft.tdee === null) {
      router.replace("/onboarding");
    }
  }, [isHydrated, isCompleted, draft, router]);

  if (!isHydrated || (!isCompleted && (draft.bmr === null || draft.tdee === null))) return null;

  const handleCompleted = () => {
    setIsCompleted(true);
    resetDraft();
  };

  return (
    <ScreenShell>
      <SignupForm onboardingDraft={draft} onCompleted={handleCompleted} />
    </ScreenShell>
  );
}
