"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError, backend } from "@/lib/api";
import { SESSION_COOKIE } from "./session";
import { isIdentity, type LoginState } from "./types";

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const loginID = formData.get("login_id");
  const password = formData.get("password");
  if (typeof loginID !== "string" || !loginID.trim() || loginID.length > 100
    || typeof password !== "string" || !password || new TextEncoder().encode(password).length > 72) {
    return { error: "Isi ID pengguna dan kata sandi yang valid." };
  }
  let token: string;
  let expiresAt: number;
  try {
    const result = await backend<{ token: string }>("/auth/login", { method: "POST", body: { login_id: loginID.trim(), password } });
    if (!result || typeof result.token !== "string") throw new ApiError(502, "Respons login tidak valid.");
    const identity = await backend<unknown>("/auth/me", { token: result.token });
    if (!isIdentity(identity)) throw new ApiError(401, "Akun tidak dapat digunakan.");
    token = result.token;
    expiresAt = identity.exp;
  } catch (error) {
    return { error: error instanceof ApiError && error.status === 401
      ? "ID pengguna atau kata sandi salah, atau akun belum aktif."
      : "Layanan sekolah belum dapat dihubungi. Silakan coba kembali." };
  }
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(1, Math.min(8 * 3600, expiresAt - Math.floor(Date.now() / 1000))),
  });
  redirect("/dashboard");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
