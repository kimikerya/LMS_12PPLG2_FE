import { getSession } from "@/modules/auth/session";
const allowed = ["class_id", "subject_id", "assignment_id", "from", "to", "status"];
export async function GET(request: Request) {
  const session = await getSession();
  if (session.kind !== "authenticated") return Response.json({ error: "Sesi tidak tersedia." }, { status: 401 });
  if (session.identity.role !== "teacher") return Response.json({ error: "Akses tidak diizinkan." }, { status: 403 });
  const input = new URL(request.url).searchParams, params = new URLSearchParams();
  for (const key of allowed) { const value = input.get(key); if (value) params.set(key, value); }
  try {
    const response = await fetch(new URL(`/api/teacher-exports/grades?${params}`, process.env.BACKEND_URL ?? "http://127.0.0.1:8080"), { headers: { Authorization: `Bearer ${session.token}` }, cache: "no-store", signal: AbortSignal.timeout(60_000) });
    if (!response.ok) return Response.json({ error: "Rekap belum dapat diekspor. Periksa filter lalu coba kembali." }, { status: response.status });
    return new Response(response.body, { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": "attachment; filename=rekap-nilai-guru.xlsx", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch { return Response.json({ error: "Layanan ekspor belum tersedia." }, { status: 503 }); }
}
