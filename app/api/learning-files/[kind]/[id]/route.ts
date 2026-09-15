import { getSession } from "@/modules/auth/session";
export const runtime = "nodejs";
export async function GET(_request: Request, { params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;
  if (!["assignment", "submission", "material"].includes(kind) || !/^[1-9]\d*$/.test(id)) return new Response("File tidak ditemukan.", { status: 404 });
  const session = await getSession();
  if (session.kind !== "authenticated") return new Response("Masuk kembali untuk mengunduh file.", { status: session.kind === "unavailable" ? 503 : 401 });
  try {
    const response = await fetch(new URL(`/api/learning-files/${kind}/${id}`, process.env.BACKEND_URL ?? "http://127.0.0.1:8080"), { headers: { Authorization: `Bearer ${session.token}` }, cache: "no-store", signal: AbortSignal.timeout(120000) });
    if (!response.ok) return new Response("File tidak tersedia atau Anda tidak memiliki akses.", { status: response.status });
    const headers = new Headers({ "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "sandbox" });
    for (const name of ["Content-Type", "Content-Disposition", "Content-Length"]) { const value = response.headers.get(name); if (value) headers.set(name, value); }
    return new Response(response.body, { headers });
  } catch { return new Response("Layanan unduhan belum dapat dihubungi.", { status: 503 }); }
}
