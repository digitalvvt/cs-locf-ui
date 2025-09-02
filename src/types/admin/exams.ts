export interface ExamPayload {
  faculty_id: number;
  name: string;
  year: number;
  semester: number;
  programme: number;
  course: number;
  chapters: number[];
  topics: number[];
  question_count: string;
  duration: string;
  start_date: string;
  end_date: string;
  test_mode: number;
  online_instructions: string;
  offline_instructions: string;
  bloomDistribution: Record<string, number>;
  difficultyDistribution: Record<string, number>;
  shift_id?: number | null;
  section?: string | null;
}

export interface ExamReponse {
  id: number;
  exam_name: string;
  c_id: number;
  is_published: boolean;
  start_date: string;
  end_date: string;
  duration: number;
  question_count: number;
  p_name: string;
  subject_name: string;
  uniqueId: string;
  isCompleted: number;
  userId: number;
}
