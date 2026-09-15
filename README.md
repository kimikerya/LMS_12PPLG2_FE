# LMS SMK Citra Negara — Frontend

Portal pembelajaran berbasis Next.js untuk admin, siswa, guru, kurikulum,
dan kepala sekolah. Backend: [LMS_12PPLG2_BE](https://github.com/kimikerya/LMS_12PPLG2_BE).

## Instalasi

Siapkan Node.js dan npm, lalu aktifkan MySQL serta backend.
Jalankan dari folder frontend:

```powershell
npm.cmd ci
Copy-Item .env.example .env.local
npm.cmd run dev
```

Buka http://localhost:3000. Sesuaikan `BACKEND_URL` di `.env.local` jika backend
tidak menggunakan `http://127.0.0.1:8080`. Jangan menimpa file environment yang
sudah berisi konfigurasi. Hentikan server dengan `Ctrl+C`.

## Build produksi

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run start
```

## Fitur utama

- Admin mengelola pengguna dan kelas.
- Siswa mengakses materi, mengumpulkan tugas, dan mengerjakan asesmen.
- Guru mengelola pembelajaran, lampiran, dan penilaian.
- Kurikulum memantau aktivitas dan mencatat tindak lanjut.
- Kepala sekolah melihat laporan dan mengekspor Excel.
- Dashboard siswa dan guru menampilkan pengingat pembelajaran.

Login menggunakan NIS siswa atau NIP/nomor pegawai sesuai data akun.
Asesmen pilihan ganda dinilai otomatis; tugas dan esai diperiksa guru.
Data serta izin akses dikelola backend.
