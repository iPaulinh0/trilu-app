import { Mascot } from "@/components/shared/mascot";
import { Button } from "@/components/ui/button";

interface HomeErrorStateProps {
  onRetry: () => void;
}

export function HomeErrorState({ onRetry }: HomeErrorStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center">
      <Mascot size={120} />
      <h2 className="text-xl font-bold text-ink-900">Não conseguimos carregar sua trilha</h2>
      <p className="text-sm text-ink-500">Verifique sua conexão e tente novamente.</p>
      <Button type="button" variant="accent" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  );
}
