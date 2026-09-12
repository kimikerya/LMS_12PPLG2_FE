# SMK Citra Negara EMS — Frontend Design System

> Source of truth untuk implementasi frontend Next.js oleh Codex.
> Product: **SMK Citra Negara — Education Management System**
> Design System: **Citra Modern**

## 1. Prinsip Produk
Arah visual:
- modern academic SaaS
- clean, compact, professional
- high information clarity
- desktop-first
- light mode sebagai prioritas

Semua role memakai satu keluarga komponen yang sama:
Student, Teacher, Admin, Curriculum, Principal.

Perbedaan role hanya pada navigation, permission, content, dan data density.
Jangan membuat design system terpisah per-role.

## 2. Core Colors
- Primary: `#5996FF`
- Secondary: `#D0E7E6`
- Tertiary / Accent: `#92EEFF`
- Neutral Dark / Main Text: `#172033`
- Background: `#F7F9FC`
- Surface: `#FFFFFF`

Neutral scale:
- 900 `#172033`
- 700 `#3A4355`
- 600 `#596273`
- 500 `#737C8C`
- 400 `#9AA2AF`
- 300 `#CBD1DA`
- 200 `#E2E6EC`
- 100 `#EEF1F5`
- 50 `#F7F9FC`

Semantic:
- Success `#22C55E`, BG `#DCFCE7`
- Warning `#F59E0B`, BG `#FEF3C7`
- Danger `#EF4444`, BG `#FEE2E2`
- Info `#3B82F6`, BG `#DBEAFE`

Jangan gunakan semantic color sebagai area besar.

## 3. Typography
Font utama: **Plus Jakarta Sans**

Fallback:
```css
"Plus Jakarta Sans", Arial, sans-serif
```

Scale:
- KPI: `36px / 700 / 44px`
- Page title: `32px / 700 / 40px`
- Section title: `20px / 600-700 / 28px`
- Card title: `16px / 600 / 24px`
- Body: `14px / 400 / 20-22px`
- Supporting: `12px / 400 / 18px`
- Label: `12-14px / 500-600`

Preferred sizes: `12, 14, 16, 20, 24, 32, 36`.

## 4. Spacing
Gunakan 8px grid.

Preferred:
- 4px adjustment
- 8px micro
- 12px compact control
- 16px component gap
- 24px card padding / section gap
- 32px section separation
- 40px occasional
- 48px major separation

Utamakan `8 / 16 / 24 / 32`.

## 5. Desktop
- Primary width: `1440px`
- Minimum height: `1024px`
- vertical scroll boleh
- jangan scale-down seluruh UI hanya agar muat

## 6. Application Shell
Struktur:
`Sidebar + Topbar + Main Content`

### Sidebar
- width rekomendasi implementasi: `260px`
- background `#FFFFFF`
- border-right `1px solid #E2E6EC`
- menu height `40-44px`
- active radius `8-12px`

Top: logo + portal label  
Middle: navigation  
Bottom: profile + role + logout

Proporsi sidebar tidak boleh berubah antar-page.

### Topbar
- height `72px`
- background `#FFFFFF`
- border-bottom `1px solid #E2E6EC`

Berisi breadcrumb/context, search, notification, help/utility, avatar bila perlu.

## 7. Main Content
- background `#F7F9FC`
- padding-x `32px`
- padding-top `24px`
- padding-bottom `32px`

Admin table page boleh memakai hampir seluruh available width.

## 8. Cards
- background `#FFFFFF`
- border `1px solid #E2E6EC`
- radius `12px`
- large container `16px`
- padding `24px`
- compact `16px`

Subtle shadow:
```css
0 1px 2px rgba(16,24,40,.04)
```

## 9. Buttons
Primary:
- bg `#5996FF`
- text white
- height `40px`
- padding-x `16px`
- radius `8px`
- font `14px / 600`

Secondary:
- bg white
- border `#CBD1DA`
- text `#172033`

Danger:
- bg `#EF4444`
- text white

Icon button:
- `36-40px`
- icon `16-18px`

Action penting untuk prototype sebaiknya visible:
Eye = inspect, Pencil = edit, Trash = delete/remove/deactivate.

## 10. Forms
- input `40-44px`, recommended `44px`
- bg white
- border `1px solid #CBD1DA`
- radius `8px`
- padding-x `12-16px`
- focus border `#5996FF`

Gunakan 1 atau 2 kolom sesuai kebutuhan.
Referensi form Admin: **Buat Kelas Baru**.

## 11. Tables
Admin table harus compact:
- surface white
- border `#E2E6EC`
- header bg `#F7F9FC`
- header text `12px / 600`
- row text `13-14px`
- row height `48-56px`
- avatar `28-32px`
- badge compact

Action column:
View, Edit, Delete/Deactivate.

## 12. Tabs
Compact horizontal tabs.

Pengguna:
Semua, Siswa, Guru, Kurikulum, Kepala Sekolah, Admin.

Detail Kelas:
Ringkasan, Siswa, Guru, Pengumuman.

Active:
- text primary/dark
- underline `2px #5996FF`

## 13. Badges
- height `22-26px`
- padding `4px 8px`
- radius `999px`
- font `11-12px / 500-600`

## 14. Modal / Drawer / Toast
Modal:
- backdrop `rgba(23,32,51,.35)`
- bg white
- radius `12-16px`
- padding `24px`

Drawer:
- width `400-480px`
- right aligned

Toast:
- success/error/info
- 3–5 detik

## 15. Icons
Gunakan satu keluarga icon.
Recommended: **Lucide**
- regular `16-20px`
- sidebar `18-20px`

Jangan campur filled/outline acak.

## 16. Role UX

### Student
Fokus:
- Dashboard
- Kelas Saya
- Profil

Inside class:
Pengumuman, Materi, Tugas, Asesmen.

Student tidak memiliki management CRUD.

### Teacher
Fokus:
- Dashboard
- Kelas Saya
- Asesmen
- Laporan Nilai
- Profil

Teacher dapat mengelola miliknya sendiri:
Materi, Tugas, Asesmen, Pengumuman, Penilaian.

### Admin
Sidebar sesuai arahan pengguna 10 September 2026:
- Halaman Utama
- Kelas
- Pengguna
- Pengaturan

Assignment/assessment tidak termasuk navigasi admin. Laporan ditambahkan
setelah fitur dan sumber datanya tersedia.

Bottom:
- Admin Pusat
- Administrator
- Keluar

`Pengguna` mengelola:
Siswa, Guru, Kurikulum, Kepala Sekolah, Admin.

Jangan jadikan Siswa/Guru/Akun sebagai sidebar utama Admin terpisah.

### Curriculum / Principal
Monitoring-oriented:
KPI, table, report, simple charts.
Mayoritas read-only.

## 17. Forbidden Modules
Jangan menambahkan:
Finance, Billing, Payment, Tuition, Payroll.

## 18. CSS Tokens
```css
:root {
  --primary: #5996FF;
  --secondary: #D0E7E6;
  --tertiary: #92EEFF;
  --text-primary: #172033;
  --text-secondary: #596273;
  --text-muted: #737C8C;
  --background: #F7F9FC;
  --surface: #FFFFFF;
  --border: #E2E6EC;
  --border-strong: #CBD1DA;
  --success: #22C55E;
  --warning: #F59E0B;
  --danger: #EF4444;
  --info: #3B82F6;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --sidebar-width: 260px;
  --topbar-height: 72px;
}
```

## 19. Suggested FE Components
```text
components/
  ui/
    Avatar.tsx
    Badge.tsx
    Button.tsx
    Card.tsx
    Drawer.tsx
    Input.tsx
    Modal.tsx
    Select.tsx
    Table.tsx
    Tabs.tsx
  layout/
    AppShell.tsx
    Sidebar.tsx
    Topbar.tsx
```

Jangan duplicate Button/Card/Table per-page.

## 20. Codex Rules
Sebelum implement screen:
1. audit reusable component
2. audit global CSS / Tailwind
3. audit hardcoded color/radius/spacing
4. reuse AppShell/Sidebar/Topbar
5. reuse Button/Input/Table/Card/Tabs/Badge
6. inspect Figma sebelum membuat layout baru
7. jangan buat token baru tanpa alasan
8. jika Figma bertentangan dengan file ini, jelaskan konflik dulu
9. jangan redesign screen approved tanpa izin

**Source of truth:**
- `DESIGN_SYSTEM.md` = token/style contract
- Figma approved frame = layout/frame truth
