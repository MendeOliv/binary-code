/**
 * Log redaction helpers (CB-SEC-E.3).
 *
 * Logs must stay useful for debugging without becoming a PII / secret sink.
 * When an identifier is genuinely needed we prefer internal UUIDs; otherwise we
 * log a masked, non-reversible value. These helpers NEVER reveal the original
 * value and are safe to call from hot paths.
 */

/**
 * Masks an email address to keep it useful (domain + first char) while removing
 * the identifying local part: `joao.silva@mail.com` → `j***@mail.com`.
 */
export function redactEmail(email: unknown): string {
  if (typeof email !== 'string' || !email.includes('@')) return email ? '***' : '—';
  const [local, domain] = email.split('@');
  const head = local.slice(0, 1);
  return `${head}***@${domain}`;
}

/** Masks a display name to its first character: `João Silva` → `J***`. */
export function redactName(name: unknown): string {
  if (typeof name !== 'string' || name.trim().length === 0) return '—';
  return `${name.trim().slice(0, 1)}***`;
}

/** Masks a phone number to its last 2 digits: `+244923456789` → `***89`. */
export function redactPhone(phone: unknown): string {
  if (typeof phone !== 'string' || phone.trim().length === 0) return '—';
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 2) return '***';
  return `***${digits.slice(-2)}`;
}

/**
 * Returns a short, non-reversible correlation identifier for secret-like
 * values (e.g. an admin key) safe to log. This is NOT for PII — it exists so an
 * operator can correlate without ever seeing the secret.
 */
export function correlationId(value: unknown): string {
  // Lazy import avoided; simple djb2 hash keeps this dependency-free.
  const str = typeof value === 'string' ? value : String(value ?? '');
  let h = 5381;
  for (let i = 0; i < str.length; i += 1) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  return `id:${(h >>> 0).toString(16)}`;
}
