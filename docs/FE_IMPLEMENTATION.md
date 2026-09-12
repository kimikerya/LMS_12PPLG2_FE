# Catatan implementasi FE — Citra Modern

Pembaruan alur pengguna: tautan tambah/detail/edit membawa `returnTo` yang
dibatasi ke daftar pengguna (peran, status, pencarian) atau tab anggota kelas.
Simpan, batal, dan hapus kembali ke konteks asal. Pembuatan akun kembali ke
daftar dengan pesan berhasil; template halaman tambah mereset formulir ketika
dibuka kembali. Peran awal mengikuti tab asal. Tabel memakai aksi Lihat, Edit,
dan Hapus dengan konfirmasi; akun sendiri tidak mempunyai aksi Hapus.
Penanda biru tab peran bergeser dengan ease-out 260 ms dan menghormati
pengaturan reduced motion.
Validasi: build, TypeScript, dan lint lulus; empat tes alur pengguna lulus
(kembali ke tab/filter/kelas, formulir kosong termasuk browser Back, konfirmasi
hapus, serta animasi). Empat tes regresi portal siswa juga lulus. Pengujian
browser memakai data fixture terpisah dari akun sekolah.

Pembaruan role siswa 11 September 2026: lihat
[status portal siswa](STUDENT_IMPLEMENTATION.md) untuk halaman yang sudah
terhubung, perubahan API, hasil pemeriksaan, dan alur yang belum selesai.

## Acuan

Paket SMK_Citra_EMS_Codex_FE_Context.zip dibaca sebelum perubahan.
Salinannya ada di CODEX_FRONTEND_HANDOFF.md, DESIGN_SYSTEM.md, dan FIGMA_HANDOFF.md.
Dokumen adalah acuan desain; perubahan fungsi tetap mengikuti permintaan pengguna.

File Figma: jpJwZ806FnAiFeY6Fg7OOA, halaman Desktop (0:1).
Frame yang diperiksa melalui design context:

- Landing page: 2090:1496.
- Admin Dashboard — Master Shell: 2282:2.
- Manajemen Pengguna: 2328:876.
- Manajemen Kelas: 2282:281.
- Buat Kelas Baru: 2320:2.
- Detail Kelas: Ringkasan 2316:598, Siswa 2323:1556, Guru 2323:1059,
  Pengumuman 2323:1320.
- Tambah Pengguna: 2342:79; pratinjau import: 2355:958.

Figma tidak diubah. Frame legacy dan desain role lain tidak dianggap final otomatis.
Nomor node disimpan supaya pekerjaan berikutnya tidak bergantung pada ingatan chat.

## Audit awal

- Aman: App Router, validasi sesi di server, Go API, komponen shell/brand/icon,
  daftar kelas dan pengguna, tab role, pemisahan tugas dan ulangan.
- Dirapikan: Segoe UI diganti Plus Jakarta Sans, token warna, sidebar 260px,
  topbar 72px desktop, ukuran judul/tabel, radius dan tombol.
- Dibuat: landing page publik, data konten sekolah terpusat, header fixed dengan
  navigasi mobile dan transisi ease-out,
  navigasi bagian halaman, FAQ, komponen Button/ButtonLink bersama, dashboard
  admin dengan empat KPI asli, serta tes browser landing.
- Tahap admin menambahkan form dan dialog bersama untuk perubahan data.
  Jangan membuat komponen duplikat per role saat melanjutkan.

## Implementasi tahap ini

| Bagian | Status |
|---|---|
| / | Landing page publik, tidak membutuhkan API/database |
| /login | Alur login lama dipertahankan; font/token dan tombol diperbarui |
| /dashboard admin | Empat KPI, kelas tersedia, akses cepat membuat kelas/pengguna; tanpa asesmen |
| /pengguna | Tab role, pencarian, filter status, tautan detail/edit, dialog perubahan status |
| /pengguna/baru dan /pengguna/[id] | Tambah/detail/edit identitas dan kata sandi opsional, profil sesuai role |
| /pengguna/import | Unggah Excel/CSV atau tempel tabel, pilih sheet, pratinjau, validasi, penyimpanan atomik |
| Shell portal | Tetap satu komponen bersama, bukan sidebar terpisah per halaman |
| Materi/tugas/asesmen | Daftar untuk role non-admin; akses admin diarahkan ke /kelas |
| /kelas dan /kelas/baru | Pencarian/filter kelas admin dan pembuatan kelas dengan referensi database |
| /kelas/[id] dan /kelas/[id]/edit | Empat tab admin, edit informasi kelas, siswa/guru dan pengumuman; kode bergabung permanen tampil di header |
| Laporan, notifikasi, pemulihan kelas arsip | Belum dibuat dalam tahap ini |

Aktivitas terkini belum memiliki endpoint baca; UI memberi keterangan tersebut.
Tidak menampilkan log atau jumlah palsu dari mock Figma.
KPI kelas/siswa/guru/akun aktif dihitung dari data yang dikembalikan API.
Jumlah asesmen pada role lain dibatasi 100 data, bukan jumlah ujian sedang berlangsung.
Daftar kelas tidak disebut kelas terbaru karena urutan tanggal belum dijamin.

## Keputusan visual

- Pengguna mengizinkan penyegaran landing: hero dua kolom, foto sekolah lebih
  besar, hierarki teks, CTA masuk, bagian jurusan, FAQ, dan footer sederhana.
- Nama jurusan, foto, logo, dan ikon fitur memakai sumber Figma.
- Tidak menambahkan nomor telepon, email, alamat, akreditasi, atau statistik
  sekolah yang belum diberikan.
- Klaim proctoring/penilaian instan otomatis tidak ditampilkan sebagai fitur aktif
  karena backend belum mendukungnya. Status pengembangan dijelaskan dalam copy.
- Token mengikuti DESIGN_SYSTEM.md meski beberapa frame memakai biru/radius lama.
- Pengecualian keterbacaan: teks pada primary #5996FF memakai #172033, bukan
  putih kecil. Tautan menggunakan #005BBF yang juga ada di Figma.
- Padding/tipografi portal diperbarui bersama sehingga memengaruhi semua role,
  tetapi izin dan alur bisnis tidak berubah.
- Ikon portal yang sudah ada tetap dipakai; ikon landing berasal dari ekspor Figma.
- Font di-host lokal melalui Fontsource (OFL-1.1), tidak meminta font ke Google
  saat build atau dari browser. Logo/foto diproses next/image.
- Arahan terbaru pengguna menghapus assignment/assessment dari sidebar admin,
  sekaligus kartu asesmen dashboard. Navigasi siswa/guru tetap mengikuti role.
- Form kelas mempertahankan susunan informasi utama dan panel samping Figma.
  Kapasitas siswa, catatan internal, kode undangan, upload foto, serta aksi arsip
  tidak ditampilkan karena alur penyimpanannya belum tersedia.

## File utama

- app/tokens.css: token Citra Modern dan alias untuk komponen lama.
- app/globals.css: gaya bersama portal/login; sebagian dekorasi legacy masih ada.
- modules/landing/: halaman, header mobile, konten, CSS khusus landing.
- modules/admin/dashboard.tsx: ringkasan admin dengan data asli.
- components/ui/button.tsx: tombol/link bersama landing dan login.
- public/figma/landing/: aset ekspor asli, bukan URL sementara Figma.
- tests/landing.spec.ts: landing, navigasi, FAQ, font/token, 360/390/768/1440px.
- tests/portal.spec.ts: regresi login, role, filter pengguna, logout, mobile.
- components/ui/form.tsx dan modal.tsx: isian berlabel, pending/error/success,
  dialog native dengan fokus keyboard, serta isian yang bertahan saat gagal.
- app/management.css: gaya form/dialog/detail kelas menggunakan token bersama.
- modules/users/actions.ts dan modules/classes/actions.ts: mutasi melalui
  server action dengan pemeriksaan admin; token tidak dikirim ke komponen browser.
- modules/users/csv.ts: parser CSV dan validasi yang dipakai browser/server.
- tests/management.spec.ts: alur mutasi admin lokal, validasi CSV dan izin API.

## Dependency dan keamanan

Next.js dan eslint-config-next diperbarui dari 16.3.1 ke 16.3.4.
Dependency transitif sharp/js-yaml diperbarui dalam batas versi kompatibel.
Ini perbaikan untuk temuan audit, bukan migrasi framework.
Rujukan advisori:

- https://github.com/advisories/GHSA-p293-qw3h-jr36
- https://github.com/advisories/GHSA-2xp9-vwfh-vxw4

Jangan menjalankan npm audit fix --force tanpa meninjau dampaknya.
Tahap visual pertama tidak mengubah backend. Tahap admin awal menambahkan endpoint
pendukung pada Go. Revisi profil berikutnya memakai migration 036 dan 037.
Tes login dapat memperbarui last_login_at akun demo.

## Verifikasi tahap visual sebelumnya

Verifikasi tahap ini (10 September 2026): lint dan production build berhasil;
10 tes browser normal lulus, 1 tes offline lulus saat dijalankan terpisah;
npm audit melaporkan 0 kerentanan pada saat pemeriksaan. Screenshot landing
desktop/mobile dan dashboard admin ditinjau untuk pengecekan visual.
Pengujian browser memakai mode development; build produksi sudah diperiksa,
tetapi deployment publik dan pengujian lintas browser belum dilakukan.

## Perilaku pengelolaan admin

- Tambah pengguna mendukung kelima role. Siswa wajib memiliki NIS; NISN,
  NUPTK dan nomor pegawai mengikuti profil peran. Email opsional; jika diisi
  harus unik seperti ID dan nomor identitas. Tempat/tanggal lahir dan HP opsional.
- Edit mempertahankan role akun; kata sandi kosong berarti tidak diganti.
  Status akun diubah melalui dialog konfirmasi. Akun sendiri tidak dapat
  dinonaktifkan dari alur ini, termasuk lewat endpoint status atau edit API.
- Import menerima Excel .xlsx (1 MB), CSV UTF-8 koma/titik koma dan tempelan TSV
  (100 KB teks), maksimal 50 baris. Pratinjau tidak menampilkan kata sandi. Validasi diulang pada
  server; konflik database membatalkan seluruh batch, termasuk profil pengguna.
- Saat koneksi putus, UI meminta memeriksa daftar sebelum mencoba lagi karena
  respons yang hilang tidak selalu berarti penyimpanan gagal.
- Pembuatan/edit kelas memakai tahun ajaran, jenjang, jurusan dan mapel asli.
  Sesudah kelas disimpan, siswa dan guru ditetapkan pada tab masing-masing.
- Tab Siswa mendukung pilih banyak akun aktif (maksimal 100 per operasi), cari,
  filter status, Detail / Edit profil dan keluarkan dari kelas. Akun siswa tetap ada setelah dikeluarkan.
- Tab Guru mendukung wali kelas dan guru mapel. Penetapan wali baru mengganti
  wali sebelumnya. Filter penugasan, mapel dan status dapat digabungkan dengan
  pencarian nama. Detail / Edit membuka profil guru. Menghapus penugasan tidak menghapus akun guru.
- Tab Ringkasan memakai jumlah anggota/guru unik dan pengumuman yang sebenarnya.
  Tab Pengumuman mendukung daftar serta penerbitan pengumuman berbasis teks.
- Form admin baru, data referensi, dan detail kelas admin tetap memerlukan izin
  admin pada server Next dan Go. Pembatasan tidak hanya bergantung pada sidebar.

## Batas dan lanjutan

Detail administrasi tersedia untuk admin. Guru/siswa memiliki detail kelas sesuai
keanggotaan, serta pembacaan pengumuman. Edit/hapus pengumuman, pemulihan arsip,
upload foto/file, laporan/notifikasi serta formulir kegiatan belajar masih
perlu pekerjaan lanjutan. Tidak ada tombol aktif yang hanya berpura-pura menyimpan.

Tes browser mutasi menggunakan tag acak E2E dan membersihkan data sementaranya
melalui command backend khusus database lokal. Tes Go memakai transaksi rollback.
Lihat README untuk perintah opt-in pengujian mutasi dan batas CSV.

Kontak resmi sekolah dan versi final frame yang masih ganda perlu konfirmasi
sebelum dijadikan konten publik atau layout final.


## Verifikasi pengelolaan admin

10 September 2026: 13 tes frontend lulus pada development server port 3000,
termasuk alur pengguna/kelas, import atomik, penolakan akses API non-admin,
retensi isian saat konflik, regresi login dan tampilan mobile.
Lint dan build produksi lulus. Tes Go termasuk integrasi MySQL lulus; fixture
transaksi di-rollback dan data browser sementara dibersihkan melalui teardown.

Konfigurasi allowedDevOrigins mengizinkan 127.0.0.1 secara eksplisit, mengikuti
panduan Next.js yang terpasang, agar koneksi development tidak diblokir saat
preview atau tes memakai alamat loopback numerik. Tidak memakai wildcard origin.

## Revisi sesuai umpan balik screenshot

- Nama sekolah dan ikon di kanan header dihapus.
- Detail / Edit dari tab Siswa atau Guru membawa kelas dan tab asal dalam URL.
  Batal kembali tanpa menyimpan; simpan yang berhasil kembali ke tab asal dengan
  pesan sukses. Konteks bertahan saat refresh dan saat validasi gagal. Tujuan
  kembali divalidasi pada halaman dan server action, hanya menerima tab anggota
  kelas lokal. Edit dari menu Pengguna tetap memakai alur pengguna biasa.
- Email opsional; ditambahkan tempat lahir, tanggal lahir dan nomor HP opsional.
- Guru/staf memakai NIP/nomor pegawai. NUPTK opsional untuk tenaga pendidik;
  NIK lama tetap tersimpan saat profil diedit, tetapi tidak ditampilkan pada formulir.
- Migration backend 036 dan 037 menyimpan data pribadi dan nomor pegawai guru.
- Import .xlsx memakai read-excel-file yang dimuat saat berkas dipilih.
  Pengguna memilih sheet dan memeriksa pratinjau sebelum menyimpan.
- Tabel tempelan menerima judul kolom Indonesia, peran Indonesia, serta tanggal
  DD/MM/YYYY. Template tetap CSV dan dapat dibuka/disimpan ulang dari Excel.
- Nilai identitas harus disimpan sebagai Teks di spreadsheet untuk mempertahankan
  nol di depan. File .xls lama perlu disimpan sebagai .xlsx atau ditempel tabelnya.

Rujukan parser: [dokumentasi read-excel-file](https://gitlab.com/catamphetamine/read-excel-file).

Verifikasi revisi: 14 tes FE lulus (10 tes regresi dan 4 tes pengelolaan/parser),
lint, TypeScript dan build produksi lulus. Integrasi MySQL termasuk akun tanpa
email, login, penyimpanan/pengosongan data pribadi dan nomor pegawai guru lulus.
Tes browser mencakup workbook dua sheet, tanggal Excel, nol di depan, tempelan
TSV, rollback import konflik, aksi profil, filter guru dan viewport 390 px.
Screenshot formulir guru, import desktop/mobile dan detail kelas ditinjau.

Revisi navigasi edit dari kelas: pengujian browser Batal/Simpan dari tab Siswa
dan Guru lulus, termasuk refresh, konflik data, dan verifikasi data tersimpan.
Validasi tujuan kembali, lint, dan TypeScript lulus. Data uji dibersihkan oleh
teardown yang sama dengan pengujian pengelolaan admin.

## Pengelolaan akun, penghapusan, dan bergabung ke kelas

- Akses cepat berada di bawah Kelola sekolah pada halaman utama admin.
- Jurusan, nama kelas, tahun ajaran, jenjang dan tingkat wajib diisi. Deskripsi
  dan ruang opsional. Validasi ada pada formulir dan API.
- Pembuatan akun memakai ID otomatis secara default (contoh GUR-000001).
  Admin bisa memilih ID manual. Import juga boleh mengosongkan ID; ID akun lama
  tidak berubah. Urutan per peran disimpan dan dialokasikan dalam transaksi database.
- Tombol Hapus ada di detail pengguna/kelas. Overlay menampilkan identitas target,
  dampak tindakan, tombol Batal dan konfirmasi merah. Pengguna dihapus dari daftar
  aktif dan aksesnya dihentikan; kelas diarsipkan. Riwayat tetap tersimpan.
- Tombol Tambah mapel pada baris guru membuka penugasan mapel untuk guru tersebut.
  Wali kelas dan penugasan mapelnya dapat berjalan bersamaan.
- Guru dapat membuat kelas dengan mapelnya, lalu otomatis mendapat penugasan
  di kelas tersebut. Guru hanya membaca/membagikan kode kelas tempat ia ditugaskan.
- Kode tersedia pada Ringkasan admin dan detail kelas guru. Siswa membuka Kelas
  > Gabung kelas untuk memasukkan kode. Kode berlaku 7 hari, dapat diganti/disetop.
- Siswa hanya mendapat keanggotaan siswa. Kode tidak memberi akses guru, tidak
  menerima kelas arsip, dan tidak mengaktifkan kembali anggota yang dikeluarkan.
- Migration 038/039 diperlukan. Pengujian baru: tests/class-lifecycle.spec.ts,
  backend internal/classroom/invites_test.go dan internal/user/lifecycle_test.go.

Verifikasi tahap ini: alur admin, ID otomatis, pembuatan kelas oleh guru, bergabung
sebagai siswa, wali sekaligus guru mapel, konfirmasi Batal/Hapus, blokir akses
akun terhapus dan penolakan kode kelas arsip lulus di browser. Pengujian backend
juga mencakup guru yang tidak ditugaskan, kode lama/kedaluwarsa, anggota yang
dikeluarkan, ID unik, larangan menghapus akun sendiri, serta penyimpanan riwayat.
Lint, TypeScript, build produksi dan seluruh integrasi Go/MySQL lulus.
