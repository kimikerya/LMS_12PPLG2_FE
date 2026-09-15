export const MIN_PASSWORD_CHARACTERS = 5;
export const MAX_PASSWORD_BYTES = 72;
export const PASSWORD_HINT = "Minimal 5 karakter, maksimal 72 byte.";
export const PASSWORD_ERROR = "Kata sandi minimal 5 karakter, maksimal 72 byte";

export function validPassword(password: string): boolean {
  return [...password].length >= MIN_PASSWORD_CHARACTERS
    && new TextEncoder().encode(password).length <= MAX_PASSWORD_BYTES;
}
