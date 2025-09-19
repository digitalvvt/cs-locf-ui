export interface GenericType {
  id: number;
  name: string;
  chapterName?: string;
  description?: string;
}

export interface GenericTypes {
  id?: number;
  name: string;
  chapterName?: string;
  description?: string;
}

type QuestionType = {
  s_no: number;
  question_type: string;
};

type CognitiveLevel = {
  s_no: number;
  title: string;
};

type CourseOutcome = {
  id: number;
  co_number: string;
};

export type Question = {
  s_no: number;
  question: string;
  difficulty: number;
  estimated_time: number;
  course_id: number;
  question_type: QuestionType;
  cognitive_level: CognitiveLevel;
  co_outcome: CourseOutcome;
  correctOption: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answerDescription: string;
  ProgramId: number;
  chapterId: number;
  topicId: number;
  Keywords: string;
  subjectName: string;
  chapterName: string;
};
