import "server-only";

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function backend<T>(path: string, options: { token?: string; method?: string; body?: unknown; timeout?: number } = {}): Promise<T> {
  const base = process.env.BACKEND_URL ?? "http://127.0.0.1:8080";
  let response: Response;
  try {
    response = await fetch(new URL(path, base), {
      method: options.method ?? "GET",
      headers: { "Content-Type": "application/json", ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}) },
      ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
      cache: "no-store",
      signal: AbortSignal.timeout(options.timeout ?? 10_000),
    });
  } catch {
    throw new ApiError(503, "Layanan sekolah belum dapat dihubungi. Silakan coba kembali.");
  }
  if (!response.ok) {
    if ([409, 422].includes(response.status)) {
      const detail = await response.json().catch(() => null);
      if (typeof detail?.error === "string" && detail.error.length <= 400) throw new ApiError(response.status, detail.error);
    }
    const messages: Record<number, string> = {
      401: "Sesi berakhir atau akun tidak aktif. Silakan masuk kembali.",
      403: "Akun Anda tidak memiliki akses ke halaman ini.",
      404: "Data yang Anda cari belum tersedia.",
      400: "Data yang dikirim belum valid. Periksa isian formulir.",
      429: "Terlalu banyak percobaan masuk. Tunggu 1 menit lalu coba kembali.",
    };
    throw new ApiError(response.status, messages[response.status] ?? "Data belum dapat dimuat. Silakan coba kembali.");
  }
  try { return await response.json() as T; }
  catch { throw new ApiError(502, "Respons layanan belum dapat dibaca."); }
}
