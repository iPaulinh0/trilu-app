interface FieldErrorProps {
  id?: string;
  message?: string;
}

/** Inline validation message shown next to a field — never a toast. */
export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-sm font-semibold text-[var(--status-danger)]">
      {message}
    </p>
  );
}
