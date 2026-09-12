// Istilah domain: tugas != ulangan. Pertahankan API/schema yang sudah terpisah.
export const learningModules = {
  materials: {
    title: "Materi", href: "/materi", endpoint: "/api/materials",
    description: "Bahan belajar yang tersedia sesuai akses kelas Anda.",
    empty: "Belum ada materi untuk ditampilkan", icon: "book",
  },
  assignments: {
    title: "Tugas", href: "/tugas", endpoint: "/api/assignments",
    description: "PR, latihan, dan proyek yang dikumpulkan kepada guru. Ulangan berada di menu Asesmen / Ulangan.",
    empty: "Belum ada tugas untuk ditampilkan", icon: "task",
  },
  assessments: {
    title: "Asesmen / Ulangan", href: "/asesmen", endpoint: "/api/assessments",
    description: "Kuis, ulangan harian, dan ujian sesuai target kelas Anda. Terpisah dari pengumpulan tugas.",
    empty: "Belum ada asesmen atau ulangan untuk ditampilkan", icon: "task",
  },
} as const;

export type LearningKind = keyof typeof learningModules;
export const assessmentTypeLabels: Record<string, string> = {
  quiz: "Kuis / Ulangan harian",
  online_exam: "Ujian daring",
};
