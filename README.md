# SMK Citra Negara EMS — Frontend

Fondasi Next.js App Router dengan satu portal login. Peran ditentukan backend
dari akun, bukan dipilih sendiri di halaman masuk.

Landing page kini ada di http://localhost:3000/; portal tetap di /login dan /dashboard.
Panduan visual: [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).
Acuan Figma, perubahan tahap ini, dan pekerjaan tersisa:
[FE_IMPLEMENTATION.md](docs/FE_IMPLEMENTATION.md).

## Menjalankan di Windows / Laragon

1. Nyalakan MySQL di Laragon. Database smk_citra_ems dan migration 001–035
   harus sudah tersedia. Tidak perlu menulis SQL baru untuk pekerjaan frontend ini.
2. Terminal pertama, jalankan backend:

   ```powershell
   cd "C:\lms sekolah\LMS_12PPLG2_BE"
   .\scripts\start-api.cmd
   ```

   Periksa http://localhost:8080/health/db (status ok).
3. Terminal kedua, jalankan frontend:

   ```powershell
   cd "C:\lms sekolah\LMS_12PPLG2_FE"
   npm.cmd install
   npm.cmd run dev
   ```

4. Buka http://localhost:3000/login. Jangan memakai port 8080 untuk melihat UI.
   Gunakan akun sekolah/demo yang sudah dibuat. Akun demo hanya untuk lokal,
   bukan untuk deployment publik.
5. Untuk berhenti, Ctrl+C di terminal server masing-masing. Jika API terpisah
   masih hidup, jalankan .\scripts\stop-api.cmd dari folder backend pada terminal lain.
   Tidak perlu mematikan MySQL saat hanya ingin restart API.

Gunakan npm.cmd bila PowerShell memblokir npm.ps1; tidak perlu mengubah execution policy.
BACKEND_URL opsional di .env.local, contoh tersedia di .env.example.
Default http://127.0.0.1:8080. Ini URL server Next ke Go, bukan NEXT_PUBLIC variable.
Alamat 127.0.0.1 juga diizinkan sebagai origin development Next.js agar koneksi
development dan interaksi browser bekerja saat preview/tes memakai alamat itu.
Tidak ada koneksi MySQL langsung dari browser/Next; kredensial DB tetap di backend.

## Struktur modul

- app/: route, layout, loading/error, login, dan portal terlindungi.
- modules/auth/: server action login/logout, validasi sesi, form login.
- modules/classes/: daftar, tambah/edit, empat tab detail kelas, siswa/guru, pengumuman.
- modules/users/: tabel, tambah/edit/status pengguna, dan import CSV dengan pratinjau.
- modules/learning/: daftar materi, tugas, dan asesmen/ulangan.
- config/learning.ts: sumber istilah dan endpoint kegiatan akademik.
- config/navigation.ts: menu sesuai role.
- components/: sidebar, ikon, brand, tampilan data kosong.
- lib/api.ts: pemanggilan Go API hanya di server Next.
- tests/: uji alur browser.

## Assignment bukan ulangan

| Halaman | Konsep | Endpoint |
|---|---|---|
| /tugas — Tugas | PR, latihan, proyek; pengumpulan jawaban | /api/assignments |
| /asesmen — Asesmen / Ulangan | Kuis, ulangan harian, ujian | /api/assessments |

quiz ditampilkan sebagai Kuis / Ulangan harian; online_exam sebagai Ujian daring.
Ralat istilah tidak mengubah schema, ID, atau memindahkan data lama otomatis.
Rincian domain: ../LMS_12PPLG2_BE/docs/DOMAIN_LEARNING.md.

## Sudah tersedia dan batasnya

- Satu login; dashboard dan daftar kelas dari data API sebenarnya.
- Admin: menu Pengguna dengan tab Semua/Siswa/Guru/Kurikulum/Kepala Sekolah/Admin.
- Pencarian dan status pada data pengguna yang dimuat, bukan pencarian seluruh server.
- Daftar materi, tugas, dan asesmen sesuai izin backend. Maksimal 100 konten
  ditampilkan per halaman saat ini; angka dashboard bukan total keseluruhan konten.
- Data kosong ditampilkan apa adanya, bukan diisi mock agar tampak ramai.
- Sidebar responsif, info akun, tombol keluar, dan pesan layanan tidak tersedia.
- JWT pada cookie HttpOnly/SameSite=Lax; tidak ada token di localStorage.
  Setiap halaman terlindungi memvalidasi sesi ke backend.
- Logout menghapus cookie browser, belum mencabut JWT yang sudah disalin di luar
  browser. Revokasi sesi server dan rate limit login masih perlu dibuat.
- Produksi memerlukan HTTPS karena cookie Secure aktif dalam mode production.
  Backend belum dinyatakan siap produksi.
- Admin dapat menambah/edit pengguna dan kelas, mengubah status akun, import CSV,
  mengelola siswa/guru kelas, dan membuat pengumuman kelas.
- Detail kelas empat tab tahap ini khusus admin. Sidebar dan dashboard admin
  tidak memuat assignment/assessment; URL pembelajaran admin diarahkan ke /kelas.
- Pengumpulan tugas di UI, upload, pengerjaan soal/timer/nilai ulangan,
  laporan/notifikasi, arsip kelas, dan edit/hapus pengumuman belum dibuat.

Role tabs hanyalah filter tampilan data, bukan sesi login yang berbeda.
Backend tetap bertanggung jawab menolak akses tanpa izin.

## Pengujian

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run test:e2e
```

E2E membutuhkan API+frontend aktif pada 8080 dan 3000, Microsoft Edge terpasang,
dan akun demo ADMIN001/STD001 dengan password seed lokal. Jika sudah diganti,
isi E2E_ADMIN_ID, E2E_ADMIN_PASSWORD, E2E_STUDENT_ID, E2E_STUDENT_PASSWORD
melalui environment lokal, jangan commit kredensial asli.

Tes mencakup login salah/benar, cookie HttpOnly, logout, tab pengguna,
larangan siswa mengakses pengguna, pemisahan tugas/ulangan, dan lebar layar mobile.
Tes standar tidak membuat atau menghapus data akademik. Login dapat memperbarui last_login_at.
Tes backend MySQL menggunakan fixture transaction rollback; lihat docs backend.

Tes API offline terpisah (opsional): hentikan hanya API, biarkan frontend aktif,
lalu jalankan dari folder frontend:

```powershell
$env:E2E_API_OFFLINE = '1'
npm.cmd run test:e2e -- tests/offline.spec.ts
Remove-Item Env:E2E_API_OFFLINE
```

Nyalakan kembali API setelah tes tersebut. Tes offline dilewati pada run biasa.

Screenshot tersimpan di test-results (diabaikan Git). Trace dimatikan agar cookie
dan isian login tidak direkam ke arsip. Screenshot tetap dapat memuat data pengguna;
jangan dibagikan bila memakai akun/data sungguhan.

## Pengelolaan admin dan import Excel/CSV

Import menerima .xlsx (maksimal 1 MB), CSV UTF-8 koma/titik koma, serta tabel
Excel/Google Sheets yang ditempel beserta header (maksimal 100 KB teks).
Pilih sheet untuk .xlsx, maksimal 50 akun per import. Unduh template pada
/pengguna/import; header Indonesia dan peran seperti Guru/Siswa juga diterima.
Tanggal Excel, YYYY-MM-DD dan DD/MM/YYYY didukung. Simpan ID dan nomor identitas
sebagai Teks di Excel agar nol di depan tidak hilang. Kata sandi diisi per baris dan
tidak ditampilkan di pratinjau. Semua baris disimpan bersama; konflik membatalkan
seluruh import. Akun hasil import berstatus aktif.

Email opsional. Tempat/tanggal lahir dan nomor HP juga opsional. Guru/staf memakai
NIP/nomor pegawai; NUPTK tersedia untuk tenaga pendidik. Jalankan migration backend
036–039 sebelum memakai formulir baru. Edit akun mempertahankan peran;
status diubah melalui dialog konfirmasi.
Setelah membuat kelas, tetapkan siswa pada tab Siswa dan wali/guru mapel pada tab Guru.

ID akun baru dibuat otomatis; centang Isi ID pengguna sendiri bila memakai ID
manual. Pada import, kolom ID boleh kosong. Semua isian kelas wajib kecuali
deskripsi dan ruang. Guru pembuat kelas juga memilih mata pelajarannya.

Guru kelas dapat membuat/mengganti kode bergabung selama 7 hari. Siswa memasukkan
kode melalui Kelas > Gabung kelas. Penugasan wali dan mapel dapat diberikan kepada
guru yang sama. Hapus pengguna/kelas memerlukan overlay konfirmasi dan menyimpan
riwayat; pengguna tidak bisa login lagi dan kelas tidak lagi tersedia untuk bergabung.

Tes mutasi lokal bersifat opt-in dan memakai data sementara dengan tag acak E2E:

```powershell
$env:E2E_MANAGEMENT = '1'
npm.cmd run test:e2e -- tests/management.spec.ts tests/class-lifecycle.spec.ts
Remove-Item Env:E2E_MANAGEMENT
```

Go harus tersedia. Teardown menjalankan ../LMS_12PPLG2_BE/cmd/e2e-cleanup
yang hanya menghapus kelas, akun, dan audit kelas dengan tag pengujian pada MySQL
lokal. Jika tes dihentikan paksa, jalankan cleanup dengan tag E2E yang sama.
E2E_BASE_URL dapat diisi untuk menguji FE di port lain.
