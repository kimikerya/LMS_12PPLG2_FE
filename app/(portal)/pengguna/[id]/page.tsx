import { DeleteControl } from "@/components/ui/delete-control";
import { deleteUser } from "@/modules/users/actions";
import { userReturnPath } from "@/modules/users/return-path";
import { ButtonLink } from "@/components/ui/button";
import { UserSummary } from "@/modules/users/user-summary";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { backend, ApiError } from "@/lib/api";
import { UserForm } from "@/modules/users/user-form";
import { StatusControl } from "@/modules/users/status-control";
import { statusLabels, type UserDetail } from "@/modules/users/types";
export const metadata = { title: "Detail Pengguna" };
export default async function UserDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; mode?: string; returnTo?: string | string[] }> }) {
  const session = await requireAdmin(); const { id } = await params;
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) notFound();
  let user: UserDetail;
  try { user = await backend<UserDetail>(`/api/users/${id}`, { token: session.token }); } catch (error) { if (error instanceof ApiError && error.status === 404) notFound(); throw error; }
  const { saved, mode, returnTo: rawReturnTo } = await searchParams;
  const returnTo = userReturnPath(rawReturnTo);
  if (mode === "view") return <><div className="page-heading"><div><h1>Detail Pengguna</h1><p>{user.full_name} · {user.login_id}</p></div><ButtonLink href={`/pengguna/${id}?returnTo=${encodeURIComponent(returnTo ?? "/pengguna")}`}>Edit pengguna</ButtonLink></div><UserSummary user={user}/><ButtonLink href={returnTo ?? "/pengguna"}>Kembali</ButtonLink></>;
  return <><div className="page-heading"><div><h1>Detail Pengguna</h1><p>{user.full_name} · {user.login_id}</p></div><div className="button-row"><span className={`badge ${user.status !== "active" ? "neutral" : ""}`}>{statusLabels[user.status]}</span><StatusControl user={user} currentUserID={session.identity.user_id} />{user.id !== session.identity.user_id && <DeleteControl kind="pengguna" name={user.full_name} detail={user.login_id} action={deleteUser.bind(null,user.id,returnTo)} />}</div></div>{saved === "1" && <p className="form-message success" role="status">Data pengguna berhasil disimpan.</p>}<UserForm key={`${user.id}-${user.full_name}-${user.email}`} user={user} returnTo={returnTo} /></>;
}
