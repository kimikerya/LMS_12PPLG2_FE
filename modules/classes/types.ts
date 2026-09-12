export type Classroom = {
  id: number; title: string; grade_level: number; room?: string;
  academic_year_id: number; education_level_id: number; major_id?: number; status: string;
  description?: string;
};
export type Option = { id: number; name: string };
export type AcademicOptions = { years: Option[]; levels: Option[]; majors: Option[]; subjects: Option[] };
export type ClassMember = { id: number; login_id: string; full_name: string; status: string; nis?: string };
export type ClassTeacher = { id: number; teacher_user_id: number; full_name: string; role: "homeroom" | "subject_teacher"; subject_id: number | null; subject_name: string | null; status: string };
export type Announcement = { id: number; title: string; content: string; author: string; created_at: string };
export type ClassDetail = Classroom & { year: string; level: string; major: string | null; member_count: number; members: ClassMember[]; teachers: ClassTeacher[]; announcements: Announcement[] };
