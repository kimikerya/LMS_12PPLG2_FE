# Status implementasi portal siswa — 12 September 2026

## Pembaruan alur kelas → mata pelajaran

Arahan terbaru menggantikan alur gabung kelas sebelumnya. Header Kelas Saya menampilkan kelas akademik siswa; kartu menampilkan mapel dari penugasan guru aktif. Penugasan wali kelas tanpa mapel tidak membuat kartu. Guru yang juga menjadi wali kelas tetap dapat mengajar mapel, dan penugasan mapel yang sama digabung menjadi satu kartu.

Kode dan tombol gabung kelas dihapus dari UI dan endpoint API publik. Kelas baru tidak membuat kode. Tabel/migrasi kode lama tetap disimpan sebagai riwayat, bukan dipindahkan otomatis ke mapel. **Kode bergabung mapel belum diimplementasikan**, sesuai arahan untuk tahap berikutnya.

Siswa tanpa kelas mendapat petunjuk penempatan oleh admin. Jika data siswa memiliki beberapa kelas aktif, tersedia pemilih kelas terdaftar. Pengumuman umum tetap berada di halaman kelas.

Materi, tugas, dan asesmen menggunakan filter `class_id` + `subject_id` di backend. Detail menyimpan konteks `kelas` dan `mapel`; kembali menuju tab mapel asal. Konten lama tanpa `subject_id` tetap dapat dibaca dari daftar aktivitas agregat, namun tidak dimasukkan secara keliru ke mapel tertentu.

Validasi perubahan: build dan lint FE; pengujian browser terisolasi desktop/ponsel; pengujian MySQL rollback untuk pemisahan ketiga jenis konten per mapel dan batas keanggotaan kelas. Screenshot pemeriksaan ada di `test-results/student-classes-1440.png` dan `test-results/student-classes-390.png`.


## Acuan dan batas pemeriksaan desain

File Figma: https://www.figma.com/design/jpJwZ806FnAiFeY6Fg7OOA

Design context dan screenshot yang berhasil dibaca pada sesi implementasi:

- Dashboard siswa: `2172:220`.
- Detail kelas / pengumuman: `2173:1510`.
- Daftar materi: `2173:3312`.

Metadata juga dibaca untuk Kelas Saya (`2181:315`), tugas (`2173:2905`),
detail tugas (`2216:2942`), profil (`2173:3847`), dan asesmen
(`2216:2779`, `2258:1059`, `2216:2076`). Pengambilan design context berikutnya
ditolak oleh batas jumlah panggilan Figma MCP Starter, termasuk jalur baca
Plugin API. **Kesesuaian visual seluruh frame belum terverifikasi.**

Komposisi siswa memakai sidebar, topbar, font, token warna, tombol, form,
dialog, dan empty state portal yang sama. Tidak membuat design system lain.
Di Figma sebagian label ujian bernama Assignment; implementasi tetap memakai
**Tugas** untuk assignments dan **Asesmen** untuk assessments, sesuai domain BE.

## Sudah tersimpan dan terhubung ke API

| Halaman | Perilaku |
| --- | --- |
| `/dashboard` | Sapaan nama siswa, kelas dan daftar mapel, tugas menunggu, asesmen terjadwal, materi terbaru, tenggat tugas, dan aktivitas pengumpulan. Semua dari akun yang masuk. |
| `/kelas` | Header kelas siswa, kartu mapel, pencarian mapel/guru, pengumuman kelas, dan pemilih kelas bila siswa memiliki lebih dari satu penempatan. |
| `/kelas/[id]` | Untuk siswa, mengarah ke `/kelas?kelas=id`. Administrasi kelas tetap untuk admin/guru. |
| `/kelas/[id]/mapel/[subjectId]` | Header mapel dan guru, tab Materi, Tugas, Asesmen khusus mapel tersebut dalam kelas siswa. |
| Tab Materi | Dikelompokkan menurut pertemuan, pencarian judul/guru, detail materi dan tautan sumber yang valid. |
| Tab Tugas | Pencarian, filter status, tenggat, status pengumpulan, dan detail petunjuk. |
| `/tugas/[id]` | Pengumpulan teks atau tautan; konfirmasi dengan pratinjau jawaban; jawaban tetap ada saat gagal; hasil pengumpulan bisa dibuka kembali. Tenggat diperiksa lagi oleh backend. |
| Nilai tugas | Nilai dan umpan balik terlihat setelah dirilis guru. Sebelum itu ditampilkan sebagai menunggu penilaian. |
| Tab Asesmen / detail | Daftar, jadwal, durasi, jumlah soal, deskripsi, dan petunjuk asesmen yang tersedia untuk siswa. |
| `/profil` | Edit nama tampilan dan bio akun sendiri. NIS, NISN, email, ID pengguna, serta keanggotaan kelas hanya dibaca. |

Navigasi siswa: **Dashboard → Kelas Saya → Profil**.
Materi/tugas/asesmen juga dapat diakses melalui ringkasan dashboard.
Tautan detail mempertahankan `?kelas=...&mapel=...`; tombol kembali mengarah ke tab mapel
asal. Konteks kelas diperiksa agar URL tidak dapat menampilkan aktivitas kelas
lain. `/pengaturan` untuk siswa menuju `/profil`.

## Perubahan backend yang diperlukan

Repo saudara: `../LMS_12PPLG2_BE`.

- `GET /api/profile`, `PATCH /api/profile`: identitas diambil dari sesi,
  bukan ID request. PATCH menerima hanya `full_name` dan `bio`; identitas
  sekolah, role, serta password tidak bisa diubah melalui endpoint ini.
- Detail kelas menambahkan `member_count` sebelum daftar anggota disembunyikan
  dari siswa.
- Proyeksi materi/tugas/asesmen menambahkan nama guru, nomor pertemuan,
  jadwal/durasi/jumlah soal, kebijakan tenggat, dan status pengumpulan sendiri.
- Status `graded` disamarkan menjadi `submitted` sampai nilai dirilis.
- Tidak ada perubahan skema atau migrasi baru pada tahap ini.

**Frontend ini memerlukan backend versi perubahan yang sama.** Backend lama
belum mempunyai `/api/profile` dan kolom tambahan tersebut.

## Belum selesai — jangan dianggap seluruh role siswa sudah final

1. Pengerjaan asesmen: mulai percobaan, mengambil soal tanpa kunci jawaban,
   penyimpanan jawaban, timer yang diperiksa server, submit, penilaian,
   dan hasil. Skema tabel sudah ada, tetapi API alur tersebut belum ada.
   Halaman sekarang menyampaikan bahwa pengerjaan belum tersedia.
2. Unggah berkas jawaban dan avatar: belum ada layanan penyimpanan/download
   berkas yang memeriksa akses. Pengumpulan saat ini mendukung teks/tautan.
3. Pusat notifikasi, komentar/diskusi, serta pratinjau dokumen dalam portal
   belum diimplementasikan. Materi dibuka melalui tautan sumber.
4. Verifikasi visual frame Figma yang belum dapat dibaca, termasuk detail
   tugas, profil, dan seluruh alur asesmen, setelah akses Figma tersedia lagi.

## Validasi dan cara melanjutkan

- `npm run build`: berhasil, termasuk route siswa yang baru.
- `npm run lint` dan `npx.cmd tsc --noEmit`: lulus.
- Backend: `LMS_INTEGRATION=1 go test ./...` menggunakan MySQL lokal dan fixture
  yang di-rollback. Mencakup akses role, keanggotaan, pengumpulan, rilis nilai,
  profil sendiri, penolakan perubahan identitas/role, dan isolasi akun.
- `npm run test:student`: **4 tes lulus**, suite browser terpisah untuk UI siswa. Jalankan
  setelah `npm run build`. Memakai backend fixture lokal port 8088 dan Next
  port 3100; **bukan pengujian browser terhadap database sekolah**.
- Screenshot hasil uji tersimpan pada `test-results/student-*.png`; halaman
  dashboard, kelas, materi, tugas, detail tugas, dan profil diperiksa pada
  lebar 1440 dan 390 piksel.
- Suite browser portal lama disesuaikan dengan navigasi siswa yang baru.
  Pengujian login dengan akun nyata tetap membutuhkan kredensial lokal yang
  valid; tidak dilakukan reset password akun sekolah.

Kode utama: `modules/student/`, komposisi CSS `app/student.css`.
Pembagian halaman admin/guru tetap menggunakan komponen yang telah ada.

Langkah lanjutan: baca ulang catatan ini dan status git, lalu lengkapi kontrak
dan implementasi alur asesmen sesuai frame Figma sebelum menyatakan role siswa
selesai seluruhnya.
