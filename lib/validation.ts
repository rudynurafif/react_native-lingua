/**
 * Reusable input validation helpers.
 *
 * Each validator returns `null` when the value is valid, or a human-readable
 * error message when it isn't. This keeps screens simple: they just call the
 * validator and render whatever string comes back.
 *
 * Add new field validators here so every screen validates input the same way.
 */

// Pragmatic email shape: something@something.tld with no spaces.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Characters commonly abused for injection (HTML/script/SQL). We reject them
// in free-text credentials so unsafe input never reaches a backend.
const DANGEROUS_CHARS_REGEX = /[<>"'`;\\{}]/;

const MIN_PASSWORD_LENGTH = 8;

export function validateEmail(email: string): string | null {
  const value = email.trim();

  if (!value) return "Email is required";
  if (!EMAIL_REGEX.test(value)) return "Please enter a valid email address";

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  if (DANGEROUS_CHARS_REGEX.test(password)) {
    return "Password contains invalid characters";
  }

  return null;
}
