/**
 * Small helpers for working with Clerk in the UI.
 *
 * The Clerk future hooks (`useSignUp` / `useSignIn`) resolve to a single
 * `ClerkError` — an `Error` subclass carrying `message`, `longMessage`, and a
 * stable `code`. `getClerkErrorMessage` prefers the user-friendly `longMessage`
 * so screens can render Clerk failures the same way they render their own
 * validation messages. It also tolerates the older `{ errors: [...] }` shape.
 */

type ClerkLikeError = {
  message?: string;
  longMessage?: string;
};

function hasErrorsArray(err: unknown): err is { errors: ClerkLikeError[] } {
  return (
    typeof err === "object" &&
    err !== null &&
    "errors" in err &&
    Array.isArray((err as { errors: unknown }).errors)
  );
}

export function getClerkErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!err) return fallback;

  // Older API: `{ errors: [{ message, longMessage }] }`.
  if (hasErrorsArray(err) && err.errors.length > 0) {
    const first = err.errors[0];
    return first.longMessage || first.message || fallback;
  }

  // Future API ClerkError (an Error subclass) — prefer the friendly message.
  const candidate = err as ClerkLikeError;
  return candidate.longMessage || candidate.message || fallback;
}

/**
 * Rejects if `promise` doesn't settle within `ms`. Clerk's network calls have
 * no built-in timeout, so on a flaky connection (e.g. an Android emulator that
 * can't reach Clerk) they can hang forever and leave the UI stuck on a loading
 * state. Wrapping them ensures the screen always recovers with an error.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms = 20000,
  message = "Request timed out. Check your connection and try again.",
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}
