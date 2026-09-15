export type ExamOption = {id?:number;text:string;correct?:boolean};
export type ExamQuestion = {id?:number;type:"single_choice"|"multiple_choice"|"essay";text:string;points:number;options:ExamOption[]};
export type ExamDraft = { has_attempts?: boolean;id?:number;status?:string;subject_id:number|null;title:string;assessment_type:"quiz"|"online_exam";description:string|null;instructions:string|null;duration_minutes:number|null;start_at:string|null;end_at:string|null;class_ids:number[];questions:ExamQuestion[]};
export type TeachingChoice = {id:number;title:string;subjects:{id:number;name:string}[]};
export type ExamAnswer = {question_id:number;text:string;option_ids:number[];points?:number;feedback?:string};
export type ExamPaper = {id:number;status:string;title:string;instructions:string|null;expires_at:string;server_now:string;questions:ExamQuestion[];answers:ExamAnswer[]};
export type ExamAttempt = {id:number;student_name:string;student_id:string;class_name:string;status:string;score:number|null;released_at:string|null;answers:ExamAnswer[]};
export const questionLabels = {single_choice:"Pilihan ganda",multiple_choice:"Pilihan ganda kompleks",essay:"Esai"};
