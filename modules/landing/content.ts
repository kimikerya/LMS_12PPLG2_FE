// Isi sekolah mengikuti frame Figma, bukan statistik atau data siswa produksi.
export const majors = [
  { code: "PPLG", name: "Pengembangan Perangkat Lunak dan Gim", icon: "imgMonitor" },
  { code: "DKV", name: "Desain Komunikasi Visual", icon: "imgPalette" },
  { code: "TJKT", name: "Teknik Jaringan Komputer dan Telekomunikasi", icon: "imgSettings" },
  { code: "MPLB", name: "Manajemen Perkantoran dan Layanan Bisnis", icon: "imgToolbox" },
  { code: "Pemasaran", name: "Pemasaran", icon: "imgTrendingUp" },
  { code: "Perhotelan", name: "Perhotelan", icon: "imgBookOpen" },
] as const;

export const features = [
  { title: "Pembelajaran digital", body: "Temukan kelas, materi, dan tugas dalam satu ruang belajar yang terorganisasi.", icon: "imgContainer3", tone: "blue" },
  { title: "Asesmen & ulangan", body: "Lihat daftar kuis dan ulangan sesuai akses kelas. Fitur pengerjaan soal sedang dikembangkan.", icon: "imgContainer4", tone: "cyan" },
  { title: "Laporan akademik", body: "Ringkasan perkembangan belajar dan hasil penilaian menjadi bagian pengembangan berikutnya.", icon: "imgContainer5", tone: "mint" },
  { title: "Pengelolaan terpusat", body: "Data pengguna dalam satu portal, dengan akses yang disesuaikan untuk setiap peran.", icon: "imgContainer6", tone: "blue" },
] as const;

export const faqs = [
  { question: "Siapa yang dapat menggunakan portal ini?", answer: "Siswa, guru, administrator, staf kurikulum, dan kepala sekolah yang sudah memiliki akun sekolah. Semua menggunakan halaman masuk yang sama." },
  { question: "Bagaimana cara mendapatkan akun?", answer: "Akun dibuat oleh administrator sekolah. Hubungi administrator atau tata usaha untuk mendapatkan ID pengguna dan kata sandi. Tidak ada pendaftaran akun mandiri." },
  { question: "Apa yang harus dilakukan jika lupa kata sandi?", answer: "Hubungi administrator sekolah untuk bantuan pemulihan akun. Jangan membagikan kata sandi kepada orang lain." },
  { question: "Mengapa kelas atau tugas saya belum terlihat?", answer: "Pastikan Anda masuk menggunakan akun yang benar. Kelas dan kegiatan ditampilkan sesuai keanggotaan dan izin akun. Hubungi administrator jika akses belum sesuai." },
] as const;
