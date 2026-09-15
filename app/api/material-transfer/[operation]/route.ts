import { getSession } from "@/modules/auth/session";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export async function POST(request: Request, { params }: { params: Promise<{ operation: string }> }) {
  // Next may construct request.url with its internal hostname; the browser uses Host.
  let origin: URL;
  try { origin = new URL(request.headers.get("origin") ?? ""); }
  catch { return Response.json({ error: "Asal permintaan tidak sesuai." }, { status: 403 }); }
  if (!["http:", "https:"].includes(origin.protocol) || origin.host !== request.headers.get("host")) return Response.json({ error: "Asal permintaan tidak sesuai." }, { status: 403 });
  const session = await getSession();
  if (session.kind !== "authenticated") return Response.json({ error: "Sesi berakhir atau layanan belum tersedia." }, { status: session.kind === "unavailable" ? 503 : 401 });
  const { operation } = await params;
  const id = new URL(request.url).searchParams.get("material");
  const creating = operation === "create"; const editing = operation === "edit";
  if ((!creating && !editing) || (!creating && !/^[1-9]\d*$/.test(id ?? ""))) return Response.json({ error: "Materi tidak valid." }, { status: 400 });
  if (session.identity.role !== "teacher") return Response.json({ error: "Akses tidak diizinkan." }, { status: 403 });
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.startsWith("multipart/form-data;")) return Response.json({ error: "Format unggahan tidak valid." }, { status: 400 });
  let bytes = 0;
  const body = request.body?.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) { bytes += chunk.byteLength; if (bytes > 27 * 1024 * 1024) throw new Error("size"); controller.enqueue(chunk); },
  }));
  try {
    const response = await fetch(new URL(creating ? "/api/materials/upload" : `/api/materials/${id}/upload`, process.env.BACKEND_URL ?? "http://127.0.0.1:8080"), {
      method: "POST", headers: { Authorization: `Bearer ${session.token}`, "Content-Type": contentType }, body, duplex: "half", signal: AbortSignal.timeout(120000),
    } as RequestInit & { duplex: string });
    const result = await response.json();
    if (response.ok) { revalidatePath("/materi", "layout"); revalidatePath("/kelas", "layout"); revalidatePath("/dashboard"); }
    return Response.json(result, { status: response.status });
  } catch {
    return Response.json({ error: bytes > 27 * 1024 * 1024 ? "Total unggahan maksimal 25 MB." : "Unggahan belum dapat dikonfirmasi. Periksa koneksi dan daftar materi sebelum mencoba lagi." }, { status: 503 });
  }
}
