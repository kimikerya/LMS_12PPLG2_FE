import { test,expect } from "@playwright/test";
test.beforeEach(async({context,request})=>{
 await request.get("http://127.0.0.1:8088/__reset");
 await context.addCookies([{name:"ems_session",value:"isolated-student-fixture",domain:"127.0.0.1",path:"/",httpOnly:true,sameSite:"Lax"}]);
});
test("dashboard, class subjects, search, subject isolation and return context",async({page})=>{
 await page.goto("/dashboard");await expect(page.getByRole("heading",{name:"Halo, Budi!"})).toBeVisible();
 const nav=page.getByRole("navigation",{name:"Navigasi utama"});await expect(nav.getByRole("link")).toHaveText(["Dashboard","Kelas Saya","Profil"]);
 await page.screenshot({path:"test-results/student-dashboard.png",fullPage:true});
 await nav.getByRole("link",{name:"Kelas Saya"}).click();
 await expect(page.getByRole("heading",{name:"12 PPLG 2",exact:true})).toBeVisible();
 await expect(page.locator(".student-subject-card")).toHaveCount(2);
 await expect(page.getByRole("button",{name:"Gabung kelas",exact:true})).toHaveCount(0);
 await page.getByLabel("Cari mata pelajaran").fill("Suci");
 await expect(page.locator(".student-subject-card")).toHaveCount(1);
 await page.getByLabel("Cari mata pelajaran").fill("tidak ada");
 await expect(page.getByRole("heading",{name:"Tidak ada mapel yang cocok"})).toBeVisible();
 await page.getByLabel("Cari mata pelajaran").clear();
 await page.getByRole("link",{name:/Pemrograman Web.*Buka mapel/}).click();
 await expect(page).toHaveURL("http://127.0.0.1:3100/kelas/1/mapel/11");
 await expect(page.getByRole("heading",{name:"Pertemuan 1"})).toBeVisible();
 await expect(page.getByRole("link",{name:"Menulis teks argumentasi",exact:true})).toHaveCount(0);
 await page.getByRole("link",{name:"Buka materi"}).first().click();
 await expect(page.getByRole("link",{name:"Buka sumber materi"})).toHaveAttribute("href","https://example.test/materi.pdf");
 await page.getByRole("link",{name:"Kembali ke mapel"}).click();
 await expect(page).toHaveURL("http://127.0.0.1:3100/kelas/1/mapel/11?tab=materi");
 await page.goto("/kelas/1/mapel/12");
 await expect(page.getByRole("link",{name:"Menulis teks argumentasi",exact:true})).toBeVisible();
 await expect(page.getByRole("link",{name:"Pengenalan HTML dan CSS",exact:true})).toHaveCount(0);
 await page.goto("/materi/201?kelas=1&mapel=12");
 await expect(page.getByRole("heading",{name:/Halaman tidak ditemukan/i})).toBeVisible();
 await page.goto("/kelas/1/mapel/999");
 await expect(page.getByRole("heading",{name:/Halaman tidak ditemukan/i})).toBeVisible();
 await page.goto("/tugas/101?kelas=2");await expect(page.getByRole("heading",{name:/Halaman tidak ditemukan/i})).toBeVisible();
});
test("task confirmation, recoverable failure, text/link answers, closed task and released grade",async({page,request})=>{
 await page.goto("/kelas/1/mapel/11?tab=tugas");await page.getByLabel("Filter status").selectOption("Pengumpulan ditutup");await expect(page.getByRole("link",{name:"Latihan minggu lalu",exact:true})).toBeVisible();await expect(page.getByRole("link",{name:"Membuat halaman profil",exact:true})).toHaveCount(0);
 await page.goto("/tugas/101?kelas=1");await page.getByLabel("Jawaban Anda").fill("Jawaban tugas siswa.");await page.getByRole("button",{name:"Kumpulkan tugas",exact:true}).click();await page.getByRole("button",{name:"Periksa lagi"}).click();await expect(page.getByLabel("Jawaban Anda")).toHaveValue("Jawaban tugas siswa.");
 await request.get("http://127.0.0.1:8088/__fail-submit");await page.getByRole("button",{name:"Kumpulkan tugas",exact:true}).click();await page.getByRole("button",{name:"Ya, kumpulkan"}).click();await expect(page.getByRole("alert")).toBeVisible();await expect(page.getByLabel("Jawaban Anda")).toHaveValue("Jawaban tugas siswa.");
 await page.getByRole("button",{name:"Kumpulkan tugas",exact:true}).click();await page.getByRole("button",{name:"Ya, kumpulkan"}).click();await expect(page.getByRole("heading",{name:"Jawaban Anda"})).toBeVisible();await page.reload();await expect(page.getByText("Jawaban tugas siswa.",{exact:true})).toBeVisible();await expect(page.getByRole("button",{name:"Kumpulkan tugas",exact:true})).toHaveCount(0);
 await page.goto("/tugas/102?kelas=1");await page.getByLabel("Bentuk jawaban").selectOption("link");await page.getByRole("textbox",{name:"Tautan jawaban",exact:true}).fill("https://example.test/proyek");await page.getByRole("button",{name:"Kumpulkan tugas",exact:true}).click();await page.getByRole("button",{name:"Ya, kumpulkan"}).click();await expect(page.getByRole("link",{name:"https://example.test/proyek",exact:true})).toBeVisible();
 await page.goto("/tugas/103");await expect(page.getByText("Pengumpulan tugas sudah ditutup.",{exact:false})).toBeVisible();await expect(page.getByLabel("Jawaban Anda")).toHaveCount(0);
 await page.goto("/tugas/104");await expect(page.locator(".student-grade strong")).toHaveText("88");await expect(page.getByText("Penjelasan sudah baik.",{exact:true})).toBeVisible();
});
test("profile save, assessment information and student access boundaries",async({page})=>{
 await page.goto("/profil");await expect(page.getByLabel("NIS",{exact:true})).toHaveCount(0);await page.getByLabel("Nama lengkap").fill("Budi Pratama");await page.getByLabel("Bio",{exact:true}).fill("Belajar bersama teman kelas.");await page.getByRole("button",{name:"Simpan perubahan"}).click();await expect(page.getByRole("status")).toContainText("Profil berhasil diperbarui");await page.reload();await expect(page.getByLabel("Nama lengkap")).toHaveValue("Budi Pratama");await expect(page.locator(".account strong")).toHaveText("Budi Pratama");
 await page.goto("/kelas/1/mapel/11?tab=asesmen");await page.getByRole("link",{name:"Lihat detail"}).click();await expect(page.getByRole("heading",{name:"Asesmen dasar pemrograman"})).toBeVisible();await expect(page.getByText("20 soal",{exact:true})).toBeVisible();await expect(page.getByText("Pengerjaan asesmen belum tersedia",{exact:false})).toBeVisible();
 await page.goto("/pengguna");await expect(page.getByRole("heading",{name:"Akses khusus administrator"})).toBeVisible();await expect(page.getByRole("table")).toHaveCount(0);
 await page.goto("/pengaturan");await expect(page).toHaveURL(/\/profil$/);
});
test("student pages at desktop and mobile widths",async({page})=>{
 const failures:string[]=[];page.on("pageerror",e=>failures.push(e.message));
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:1000});
  for(const [name,path]of Object.entries({classes:"/kelas",classroom:"/kelas/1/mapel/11",materials:"/kelas/1/mapel/11?tab=materi",tasks:"/kelas/1/mapel/11?tab=tugas",assignment:"/tugas/101?kelas=1",profile:"/profil",dashboard:"/dashboard"})){
   await page.goto(path);await expect(page.getByRole("heading",{level:1})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`test-results/student-${name}-${width}.png`,fullPage:true});
  }
 }
 await page.getByRole("button",{name:"Buka navigasi"}).click();await page.getByRole("navigation",{name:"Navigasi utama"}).getByRole("link",{name:"Profil",exact:true}).click();await expect(page.getByRole("button",{name:"Buka navigasi"})).toHaveAttribute("aria-expanded","false");expect(failures).toEqual([]);
});
