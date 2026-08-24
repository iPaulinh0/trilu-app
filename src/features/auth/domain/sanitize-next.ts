/**
 * Validates a `?next=` redirect target so login/signup/OAuth callback can
 * send the user back where they came from without becoming an open
 * redirect. Only an internal, single-leading-slash path is accepted —
 * absolute URLs, protocol-relative URLs (`//evil.com`), backslash tricks,
 * and any path embedding a scheme are all rejected.
 */
export function sanitizeNextPath(next: string | null | undefined): string | null {
  if (typeof next !== "string" || next.length === 0) return null;
  if (!next.startsWith("/")) return null;
  if (next.startsWith("//") || next.startsWith("/\\")) return null;
  if (next.includes("://")) return null;
  return next;
}
