// Only class member tabs are accepted, including when a form is submitted directly.
export function classReturnPath(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = /^\/kelas\/([1-9]\d*)\?tab=(siswa|guru)$/.exec(value);
  if (!match || match[0] !== value || !Number.isSafeInteger(Number(match[1]))) return null;
  return value;
}

export function userReturnPath(value: unknown): string | null {
  const classroom = classReturnPath(value);
  if (classroom) return classroom;
  if (typeof value !== "string" || !/^\/pengguna(?:\?|$)/.test(value)) return null;
  const url = new URL(value, "http://local");
  if (url.pathname !== "/pengguna" || url.hash) return null;
  return userListPath(url.searchParams.get("role") ?? "", url.searchParams.get("status") ?? "", url.searchParams.get("q") ?? "", Number(url.searchParams.get("page") ?? 1));
}
export function userListPath(role = "", status = "", query = "", page = 1) {
  const params = new URLSearchParams();
  if (["student", "teacher", "curriculum", "principal", "admin"].includes(role)) params.set("role", role);
  if (["active", "inactive", "locked", "pending"].includes(status)) params.set("status", status);
  if (query.trim()) params.set("q", query.slice(0, 200));
  if (Number.isSafeInteger(page) && page > 1 && page <= 1000000) params.set("page", String(page));
  return `/pengguna${params.size ? `?${params}` : ""}`;
}
export function userResultPath(path: string, result: "saved" | "created" | "deleted") {
  const url = new URL(path, "http://local");
  url.searchParams.set(path.startsWith("/kelas/") ? `user_${result}` : result, "1");
  return url.pathname + "?" + url.searchParams;
}
