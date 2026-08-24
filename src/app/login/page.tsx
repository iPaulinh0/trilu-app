import { Suspense } from "react";
import { ScreenShell } from "@/components/shared/screen-shell";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <ScreenShell>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </ScreenShell>
  );
}
