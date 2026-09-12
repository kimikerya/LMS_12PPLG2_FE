# Figma Handoff for Codex

## Figma File
Tempel URL Figma resmi project pada baris ini:

```text
FIGMA_FILE_URL=https://www.figma.com/design/jpJwZ806FnAiFeY6Fg7OOA/Abidin-Figma-LMS?node-id=0-1
```

> URL diisi dari tautan yang diberikan pengguna saat implementasi.

## Cara Codex memakai Figma

Jika Figma MCP / Figma integration tersedia:

1. Buka `FIGMA_FILE_URL`.
2. Audit frame yang relevan sebelum coding.
3. Gunakan approved frame sebagai referensi layout, bukan screenshot lama yang sudah ditolak.
4. Cocokkan:
   - frame size
   - sidebar
   - topbar
   - content margins
   - card size
   - table density
   - tabs
   - buttons
   - typography
   - spacing
5. Gunakan `DESIGN_SYSTEM.md` untuk token/style.
6. Gunakan Figma untuk layout/frame aktual.
7. Jangan mengubah Figma kecuali pengguna secara eksplisit meminta edit Figma.
8. Jika diminta edit, hanya ubah role/frame yang disebut.
9. Jangan menyentuh role lain tanpa izin.

## Reference Priority

Urutan:
1. Approved frame terbaru yang pengguna pertahankan.
2. Master/reference frame.
3. `DESIGN_SYSTEM.md`.
4. Screenshot lama hanya sebagai context.

Jangan hidupkan lagi desain yang sudah ditolak.

## Approved Visual Families

Cari frame yang merepresentasikan pola:

### Admin
- Admin Dashboard
- Manajemen Kelas
- Detail Kelas — Ringkasan
- Detail Kelas — Siswa
- Detail Kelas — Guru
- Detail Kelas — Pengumuman
- Manajemen Pengguna
- Buat Kelas Baru

### Student
- Student Dashboard
- Kelas Saya
- Class Detail
- Materials
- Assignment Detail
- Assessment Lobby
- Profile

### Teacher
Gunakan keluarga visual yang sama seperti Student/Admin, lalu adaptasi fungsi Teacher.

## Prototype Behavior

Tombol/aksi yang terlihat harus punya target nyata bila flow-nya sudah tersedia:
- Eye → Quick View / Detail
- Pencil → Edit
- Trash → Delete / Remove / Deactivate confirmation
- Tambah → Create flow
- Import → Import flow
- Tabs → state/page sesuai

## Figma QA sebelum commit
Codex harus cek:
- sidebar sama proporsinya?
- topbar konsisten?
- content alignment benar?
- text/button/table masuk visual family yang sama?
- warna mengikuti token?
- ada hardcoded style yang seharusnya reusable?
- page terlihat satu produk dengan frame approved lain?

Jika tidak, perbaiki sebelum dianggap selesai.
