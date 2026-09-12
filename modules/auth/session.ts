import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError, backend } from "@/lib/api";
import { Identity, isIdentity } from "./types";

export const SESSION_COOKIE = "ems_session";
type Session = { kind: "authenticated"; identity: Identity; token: string } | { kind: "anonymous" } | { kind: "unavailable" };

// React cache is scoped to a render request, never shared across users.
export const getSession = cache(async (): Promise<Session> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return { kind: "anonymous" };
  try {
    const identity = await backend<unknown>("/auth/me", { token });
    if (!isIdentity(identity)) return { kind: "anonymous" };
    return { kind: "authenticated", identity, token };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return { kind: "anonymous" };
    return { kind: "unavailable" };
  }
});

export async function requireSession() {
  const session = await getSession();
  if (session.kind === "anonymous") redirect("/login");
  if (session.kind === "unavailable") throw new ApiError(503, "Layanan sekolah belum dapat dihubungi.");
  return session;
}

export async function authorizedData<T>(path: string): Promise<T> {
  const session = await requireSession();
  try { return await backend<T>(path, { token: session.token }); }
  catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect("/login");
    throw error;
  }
}
