export type Kind = "materials" | "assignments" | "assessments";
export type Content = {
  id: number; title: string; teacher_name: string; class_id: number | null; subject_id: number | null;
  status: string; description: string | null; instructions: string | null;
  published_at: string | null; due_at: string | null; close_at: string | null;
  start_at: string | null; end_at: string | null; allow_late: boolean | null;
  duration_minutes: number | null; question_count: number | null; max_points: number | null;
  type: string | null; url: string | null; meeting_no: number | null;
  submission_status: string | null; submitted_at: string | null;
};
export type Submission = {
  id: number; submission_type: string; text_answer: string | null; link_url: string | null;
  submitted_at: string | null; status: string; score: number | null;
  teacher_feedback: string | null; result_released_at: string | null;
};
