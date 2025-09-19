type Subject = string;

export type Student = {
  slNo: number;
  name: string;
  marks: Record<string, number>;
  total: number;
  accuracy: string; // e.g., "60%"
};

export type QuestionDistribution = {
  difficultyLevel: "Easy" | "Medium" | "Hard";
  noOfQuestions: number;
  correct: number;
  wrong: number;
  left: number;
};
export type CourseOutComeAnalysis = {
  co: string;
  noOfQuestions: number;
  correct: number;
  wrong: number;
  left: number;
};

export type Topics = {
  name: string;
  correct: number;
  wrong: number;
  left: number;
  performance: number;
};

export type ChapterAnalysis = {
  id: number;
  name: string;
  totalStudents: number;
  correct: number;
  wrong: number;
  left: number;
  performance: string;
  performanceValue: number;
  topics?: Topics[];
};

export type SingleExamAnalysis = {
  subjects: Subject[];
  questionCount: number;
  students: Student[];
  questionDistribution: QuestionDistribution[];
  chapterAnalysis: ChapterAnalysis[];
  CourseOutComeAnalysis: CourseOutComeAnalysis[];
};
