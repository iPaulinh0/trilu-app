import { WelcomeScreen } from "@/features/onboarding/components/welcome-screen";
import { ScreenShell } from "@/components/shared/screen-shell";

export default function Home() {
  return (
    <ScreenShell>
      <WelcomeScreen />
    </ScreenShell>
  );
}
