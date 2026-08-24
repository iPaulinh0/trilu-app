"use client";

import { useRef } from "react";
import { OTP_LENGTH } from "../domain/schema";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

/** Six accessible digit boxes: numeric-only, auto-advance, backspace-back, full-code paste. */
export function OtpInput({ value, onChange, disabled = false, error = false }: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? "");

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join(""));
    if (digit && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    requestAnimationFrame(() => inputsRef.current[focusIndex]?.focus());
  }

  return (
    <div className="flex justify-center gap-2" role="group" aria-label="Código de confirmação de 6 dígitos">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          aria-label={`Dígito ${index + 1} de ${OTP_LENGTH}`}
          aria-invalid={error || undefined}
          className={cn(
            "size-12 rounded-xl border-2 bg-card text-center text-xl font-bold text-ink-900 transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40",
            error ? "border-[var(--status-danger)]" : "border-ink-200 focus-visible:border-violet-400",
          )}
        />
      ))}
    </div>
  );
}
