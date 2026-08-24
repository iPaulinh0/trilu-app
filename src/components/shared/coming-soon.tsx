import { Mascot } from "./mascot";

interface ComingSoonProps {
  title: string;
  description: string;
}

/** Lightweight stub for a tab that isn't fully built yet in this stage. */
export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center">
      <Mascot size={140} />
      <h1 className="text-xl font-bold text-ink-900">{title}</h1>
      <p className="max-w-xs text-sm leading-relaxed text-ink-500">{description}</p>
    </div>
  );
}
