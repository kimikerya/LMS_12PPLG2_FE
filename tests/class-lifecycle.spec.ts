import { test, expect, type Page } from "@playwright/test";
import { randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

test.describe("class lifecycle (local fixtures)",()=>{
 test.skip(process.env.E2E_MANAGEMENT!=="1","Local management opt-in required");
 const tag="E2E"+randomBytes(10).toString("hex");
 test.afterAll(()=>{if(process.env.E2E_MANAGEMENT!=="1")return;const backend=resolve(process.cwd(),"../LMS_12PPLG2_BE");execFileSync("go",["run","./cmd/e2e-cleanup","--tag",tag],{cwd:backend,env:{...process.env,GOCACHE:resolve(backend,".local/go-cache")},timeout:60000,stdio:"pipe"});});
 const login=async(page:Page,id:string,password:string)=>{await page.goto("/login");await page.getByLabel(/^ID pengguna/).fill(id);await page.getByLabel(/^Kata sandi/).fill(password);await page.getByRole("button",{name:"Masuk ke portal"}).click();await expect(page).toHaveURL(/\/dashboard$/);};

 test("automatic account, teacher creates class, admin places student, confirms deletion",async({page,browser,request})=>{
  test.setTimeout(180000);
  const adminID=process.env.E2E_ADMIN_ID||"ADMIN001",password=process.env.E2E_ADMIN_PASSWORD||"Admin123!";
  const auth=await request.post("http://127.0.0.1:8080/auth/login",{data:{login_id:adminID,password}});expect(auth.ok()).toBeTruthy();const {token}=await auth.json();
  await login(page,adminID,password);
  const manage=page.getByRole("heading",{name:"Kelola sekolah",exact:true}),quick=page.getByRole("heading",{name:"Akses cepat",exact:true});
  expect((await quick.boundingBox())!.y).toBeGreaterThan((await manage.boundingBox())!.y);
  await page.goto("/pengguna/baru");
  await page.getByLabel(/^Peran pengguna/).selectOption("teacher");
  await expect(page.getByLabel("Isi ID pengguna sendiri")).not.toBeChecked();
  await page.getByLabel(/^Nama lengkap/).fill(tag+"-Guru");await page.getByLabel(/^Kata sandi awal/).fill("TestOnly123!");await page.getByRole("button",{name:"Buat akun",exact:true}).click();
  await expect(page.getByRole("status")).toContainText("berhasil disimpan");
  const teacherURL=page.url().split("?")[0];const teacherID=await page.getByLabel(/^ID pengguna/).inputValue();expect(teacherID).toMatch(/^GUR-\d{6,}$/);
  const pupil=await request.post("http://127.0.0.1:8080/api/users",{headers:{Authorization:`Bearer ${token}`},data:{full_name:tag+"-Siswa",role:"student",password:"TestOnly123!",nis:tag+"-nis"}});expect(pupil.ok()).toBeTruthy();const student=await pupil.json();expect(student.login_id).toMatch(/^SIS-\d{6,}$/);

  const teacherContext=await browser.newContext();const teacher=await teacherContext.newPage();
  const pupilContext=await browser.newContext();const studentPage=await pupilContext.newPage();
  try {
   await login(teacher,teacherID,"TestOnly123!");await teacher.goto("/kelas/baru");
   await teacher.getByLabel(/^Nama kelas/).fill(tag+"-Kelas");
   await teacher.getByRole("button",{name:"Simpan kelas",exact:true}).click();await expect(teacher).toHaveURL(/\/kelas\/baru$/);
   expect(await teacher.getByLabel(/^Jurusan/).evaluate((field:HTMLSelectElement)=>field.validity.valueMissing)).toBe(true);
   await teacher.getByLabel(/^Jurusan/).selectOption({index:1});await teacher.getByLabel(/^Mata pelajaran Anda/).selectOption({index:1});
   await teacher.getByRole("button",{name:"Simpan kelas",exact:true}).click();await expect(teacher.getByRole("status")).toContainText("Kelas berhasil dibuat");
   const classURL=teacher.url().split("?")[0];
   await expect(teacher.locator(".class-code-card")).toHaveCount(0);
   const classID=classURL.split("/").at(-1);
   const placement=await request.post(`http://127.0.0.1:8080/api/classes/${classID}/members`,{headers:{Authorization:`Bearer ${token}`},data:{user_ids:[student.id],status:"active"}});
   expect(placement.ok()).toBeTruthy();
   await login(studentPage,student.login_id,"TestOnly123!");await studentPage.goto("/kelas");await expect(studentPage.getByRole("heading",{name:tag+"-Kelas",exact:true})).toBeVisible();await expect(studentPage.getByRole("button",{name:"Gabung kelas",exact:true})).toHaveCount(0);
   await teacher.reload();await expect(teacher.getByRole("cell",{name:tag+"-Siswa",exact:true})).toBeVisible();
   // An existing subject teacher can also be assigned as homeroom without losing the subject.
   await page.goto(classURL+"?tab=guru");await page.getByRole("button",{name:"Tambah guru",exact:true}).click();await page.getByLabel(/^Guru(?: \*)?$/).selectOption({label:tag+"-Guru · "+teacherID});await page.getByRole("button",{name:"Simpan penugasan"}).click();await expect(page.getByRole("dialog").getByRole("status")).toContainText("berhasil");await page.getByRole("button",{name:"Tutup dialog"}).click();await expect(page.getByRole("cell",{name:tag+"-Guru",exact:true})).toHaveCount(2);
   await page.getByRole("button",{name:"Hapus kelas "+tag+"-Kelas",exact:true}).click();await expect(page.getByRole("dialog")).toContainText("Riwayat nilai dan kegiatan tetap tersimpan");await page.getByRole("dialog").getByRole("button",{name:"Batal",exact:true}).click();await expect(page.getByRole("heading",{name:tag+"-Kelas",exact:true})).toBeVisible();
   await page.getByRole("button",{name:"Hapus kelas "+tag+"-Kelas",exact:true}).click();await page.screenshot({path:"test-results/hapus-kelas-overlay.png"});await page.getByRole("button",{name:"Ya, hapus",exact:true}).click();await expect(page).toHaveURL(/\/kelas\?deleted=1$/);await expect(page.getByRole("status")).toContainText("Riwayat tetap tersimpan");
   await teacher.goto("/kelas");await expect(teacher.getByRole("heading",{name:tag+"-Kelas",exact:true})).toHaveCount(0);
   const studentAuth=await request.post("http://127.0.0.1:8080/auth/login",{data:{login_id:student.login_id,password:"TestOnly123!"}});const {token:studentToken}=await studentAuth.json();expect((await request.post("http://127.0.0.1:8080/api/classes/join",{headers:{Authorization:`Bearer ${studentToken}`},data:{code:"A1B2C3D4E5F6"}})).status()).toBe(404);
   await page.goto(teacherURL);await page.getByRole("button",{name:"Hapus pengguna "+tag+"-Guru",exact:true}).click();await page.getByRole("dialog").getByRole("button",{name:"Batal",exact:true}).click();await expect(page.getByLabel(/^ID pengguna/)).toHaveValue(teacherID);await page.getByRole("button",{name:"Hapus pengguna "+tag+"-Guru",exact:true}).click();await page.getByRole("button",{name:"Ya, hapus",exact:true}).click();await expect(page).toHaveURL(/\/pengguna\?deleted=1$/);await expect(page.getByRole("status")).toContainText("Pengguna dihapus");
   await teacher.goto("/kelas");await expect(teacher).toHaveURL(/\/login$/);
  } finally {await teacherContext.close();await pupilContext.close();}
 });
});
