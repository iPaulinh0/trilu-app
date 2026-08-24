import { AuthError as SupabaseAuthErrorBase } from "@supabase/supabase-js";
import { AuthError } from "../domain/types";
import type { AuthErrorCode } from "../domain/types";

/**
 * Translates a raw Supabase/GoTrue error into a domain AuthError with a
 * user-safe, Portuguese message — the only place in the app that inspects
 * Supabase-specific error codes. Never surfaces the original technical
 * message (which can leak details like whether an email exists).
 */
export function mapSupabaseAuthError(error: unknown): AuthError {
  const code = error instanceof SupabaseAuthErrorBase ? error.code : undefined;
  const status = error instanceof SupabaseAuthErrorBase ? error.status : undefined;

  const mapped = mapByCode(code) ?? mapByStatus(status);
  return mapped ?? new AuthError("unavailable", "Não foi possível concluir a operação agora. Tente novamente em instantes.");
}

function mapByCode(code: string | undefined): AuthError | null {
  switch (code) {
    case "invalid_credentials":
      return new AuthError("invalidCredentials", "Não foi possível entrar. Verifique seus dados e tente novamente.");
    case "email_not_confirmed":
      return new AuthError("emailNotConfirmed", "Confirme seu e-mail para continuar.");
    case "user_already_exists":
    case "email_exists":
    case "identity_already_exists":
      return new AuthError("emailAlreadyInUse", "Este e-mail já está cadastrado. Tente entrar ou recuperar sua senha.");
    case "weak_password":
      return new AuthError("weakPassword", "Sua senha não atende aos requisitos mínimos.");
    case "email_address_invalid":
      return new AuthError("invalidCredentials", "Informe um e-mail válido.");
    case "otp_expired":
      return new AuthError("otpExpired", "Esse código expirou. Solicite um novo.");
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
    case "over_sms_send_rate_limit":
      return new AuthError("rateLimited", "Muitas tentativas em pouco tempo. Aguarde um instante e tente novamente.");
    case "session_expired":
    case "session_not_found":
    case "refresh_token_not_found":
    case "refresh_token_already_used":
      return new AuthError("sessionExpired", "Sua sessão expirou. Entre novamente.");
    case "provider_disabled":
    case "email_provider_disabled":
      return new AuthError("oauthProviderNotConfigured", "Esse provedor de login não está disponível no momento.");
    case "bad_oauth_state":
    case "bad_oauth_callback":
      return new AuthError("oauthCancelled", "Não foi possível concluir o login. Tente novamente.");
    default:
      return null;
  }
}

function mapByStatus(status: number | undefined): AuthError | null {
  if (status === 429) {
    return new AuthError("rateLimited", "Muitas tentativas em pouco tempo. Aguarde um instante e tente novamente.");
  }
  return null;
}

/**
 * Supabase reports both a wrong digit and a truly expired OTP under the
 * same `otp_expired` code, distinguishable only by message wording. Falls
 * back to the "expired" message (its call-to-action — request a new code —
 * is the right move either way) when the wording is ambiguous.
 */
export function mapVerifyOtpError(error: unknown): AuthError {
  const mapped = mapSupabaseAuthError(error);
  if (mapped.code !== "otpExpired") return mapped;
  const message = error instanceof SupabaseAuthErrorBase ? error.message.toLowerCase() : "";
  if (message.includes("invalid") && !message.includes("expired")) {
    return new AuthError("invalidOtp", "Código incorreto. Confira e tente novamente.");
  }
  return mapped;
}

export type { AuthErrorCode };
