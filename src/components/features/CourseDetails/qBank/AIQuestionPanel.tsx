import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Brain, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import {
  useGetCoursesByProgramIdQuery,
  useGetOutComesbyCourseIdQuery,
} from "@/api/api/program-outcomes-api";
import MultiSelect from "./MultiSelectDropdown";
import SelectDropdown from "@/components/Common/SelectDropdown";
import { GenericType } from "@/types";
import { useGetQuestionFilterDataQuery } from "@/api/api/question-bank-api";
import MultiSelectDropdown from "@/components/Common/MultiSelectDropdown";

export type GeneratePayload = {
  user_id: number;
  uuid: string;
  program_id: number;
  subject_name: string[]; // Assuming it's an array of course names (strings)
  chapter_name: string[]; // Assuming it's an array of selected outcomes (strings or IDs)
  topic_name: string[]; // Empty initially, but will hold string values
  question_type: "multiple_choice" | string; // Restrict to specific types if needed
  cognitive_level: Record<string, number>; // Example: { "Remember": 2, "Understand": 3 }
  difficulty: Record<string, number>; // Example: { "Easy": 5, "Hard": 2 }
  number_of_questions: number;
  model: number;
  stream: number;
};

export interface GeneratedQuestion {
  question_text: string;
  question_type: "mcq" | "short_answer" | "long_answer" | "problem";
  options?: string[];
  answer_key: string;
  marks: number;
  blooms_level: "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";
  difficulty: "easy" | "medium" | "hard";
  co_mapping: number;
  unit_mapping?: number;
}

const items = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
  { id: 4, name: "Item 4" },
  { id: 5, name: "Item 5" },
  { id: 6, name: "Item 6" },
  { id: 7, name: "Item 7" },
  { id: 8, name: "Item 8" },
  { id: 9, name: "Item 9" },
  { id: 10, name: "Item 10" },
];

interface AIQuestionPanelProps {
  onQuestionsGenerated: (questions: GeneratePayload, programId: string, courseId: string) => void;
  generating: boolean; // Optional prop to control generating state
}

export const AIQuestionPanel = ({
  onQuestionsGenerated,
  generating, // Optional prop to control generating state
}: AIQuestionPanelProps) => {
  const userId = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails")!).id
    : null;

  const { data: questionFilter } = useGetQuestionFilterDataQuery();
  const { programId, courseId } = useParams<{ programId: string; courseId: string }>();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<GenericType | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<GenericType[]>([]);
  const [preSelectedCourse, setPreselectedCourse] = useState<GenericType | null>(null);
  const [courseData, setCourseData] = useState<GenericType[]>([]);
  const [selectedOutcomes, setSelectedOutcomes] = useState<string[]>([]);
  const [chapterData, setChapterData] = useState<GenericType[]>([]);
  const [topicsData, setTopicsData] = useState<GenericType[]>([]);
  const [outComesData, setOutComesData] = useState([]); // Raw outcomes data
  const [transformedOutcomes, setTransformedOutcomes] = useState([]); // Transformed outcomes data
  const [questionCount, setQuestionCount] = useState([5]);
  const [subjectName, setSubjectName] = useState("");
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>(["mcq"]);
  const [bloomsDistribution, setBloomsDistribution] = useState({
    remembering: 20,
    understanding: 30,
    applying: 25,
    analyzing: 15,
    evaluating: 5,
    creating: 5,
  });
  const [difficultyDistribution, setDifficultyDistribution] = useState({
    easy: 30,
    medium: 50,
    hard: 20,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const {
    data: courses = [],
    isLoading: isCoursesLoading,
    error: courseError,
  } = useGetCoursesByProgramIdQuery({ programId }, { skip: !programId });

  const {
    data: outcomes = [],
    isLoading: isOutComesLoading,
    error: outcomesError,
  } = useGetOutComesbyCourseIdQuery(selectedCourse!, {
    skip: !selectedCourse,
  });

  useEffect(() => {
    if (outcomes && outcomes.length > 0) {
      setOutComesData(outcomes);
      setSubjectName(outcomes[0].subjectName); // Set subject name

      const transformed = outcomes.map((item) => ({
        id: item.id,
        name: item.code,
        chapterName: item.chapterName,
      }));

      setTransformedOutcomes(transformed); // For MultiSelect
    }
  }, [outcomes]);

  const { toast } = useToast();

  const handleOutComesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedOutcomes(selectedValues);
  };

  const handleMultiSelectChange = (selected: string[]) => {
    setSelectedOutcomes(selected);
  };

  const handleProgramChange = (program: GenericType) => {};

  const handleChapterCHange = (chapter: GenericType) => {
    setSelectedTopics(null);
    setSelectedChapter(chapter);
    const topics = questionFilter.topics
      .filter((topic: any) => topic.c_id === chapter.id)
      .map((topic: any) => ({ id: topic.id, name: topic.t_name }));
    setTopicsData(topics);
  };

  const handleTopicChange = (topics: GenericType[]) => {
    setSelectedTopics(topics);
  };

  const handleBloomsChange = (level: string, value: number) => {
    // Calculate the total of all levels before updating the value
    const total = Object.values(bloomsDistribution).reduce((acc, val) => acc + val, 0);

    // If the total is 100%, prevent increasing but allow decreasing
    if (total < 100 || value < bloomsDistribution[level as keyof typeof bloomsDistribution]) {
      setBloomsDistribution((prev) => ({ ...prev, [level]: value }));
    } else {
      // If it exceeds 100%, show a warning or prevent the change
      toast({
        title: "Maximum limit reached",
        description: "Total Bloom's Level Distribution cannot exceed 100%.",
      });
    }
  };

  const handleDifficultyChange = (difficulty: string, value: number) => {
    // Calculate the total of all difficulty levels before updating the value
    const total = Object.values(difficultyDistribution).reduce((acc, val) => acc + val, 0);

    // If the total is 100%, prevent increasing but allow decreasing
    if (
      total < 100 ||
      value < difficultyDistribution[difficulty as keyof typeof difficultyDistribution]
    ) {
      setDifficultyDistribution((prev) => ({ ...prev, [difficulty]: value }));
    } else {
      // If it exceeds 100%, show a warning or prevent the change
      toast({
        title: "Maximum limit reached",
        description: "Total Difficulty Distribution cannot exceed 100%.",
      });
    }
  };

  const handleGenerateQuestions = async () => {
    // Validate course selection
    if (!selectedCourse) {
      toast({
        title: "Course Required",
        description: "Please select a course before generating questions.",
        variant: "destructive",
      });
      return;
    }

    // // Validate outcomes selection
    if (!selectedChapter) {
      toast({
        title: "Chpater Required",
        description: "Please select a chapter before generating questions.",
        variant: "destructive",
      });
      return;
    }

    if (selectedTopics.length === 0) {
      toast({
        title: "Topics Required",
        description: "Please select atleast one topic before generating questions.",
        variant: "destructive",
      });
      return;
    }

    const generatedData = {
      user_id: userId, // Set to default value or pass dynamically
      uuid: uuidv4(), // Generate unique UUID
      chapter_name: [selectedChapter.name],
      program_id: parseInt(programId!),
      program_name: questionFilter.programs.find((p) => p.id === parseInt(programId!))?.name, // From params
      subject_name: [subjectName],
      course_id: preSelectedCourse.id, // From selected course// From selected outcomes
      topic_name: selectedTopics.map((topic) => topic.name), // Will be updated based on selected outcomes' topics
      question_type: "multiple_choice", // Hardcoded to "multiple_choice"
      cognitive_level: bloomsDistribution, // Cognitive levels from state
      difficulty: difficultyDistribution, // Difficulty from state
      number_of_questions: questionCount[0], // From slider
      model: 2, // Default
      stream: 1, // Default
    };

    onQuestionsGenerated(generatedData, programId!, selectedCourse); // Call the parent function with generated data
  };

  useEffect(() => {
    if (courseId) {
      setSelectedCourse(courseId); // Pre-select course
      const chapters = questionFilter?.chapters
        ?.filter((chapter: any) => chapter.s_id === Number(courseId))
        .map((chapter: any) => ({ id: chapter.id, name: chapter.c_name }));
      setChapterData(chapters);
    }
  }, [courseId, questionFilter]);

  useEffect(() => {
    if (courseId && questionFilter) {
      const courses = questionFilter.courses
        .filter((c: any) => c.id === Number(courseId))
        .map((c: any) => ({
          id: c.id,
          name: c.subjects.s_name,
        }));
      setPreselectedCourse(courses[0]);
      setCourseData(courses);
    }
  }, [courseId, questionFilter]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Question Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* course selection */}
        <div className="relative w-full">
          <SelectDropdown
            options={courseData || []}
            value={preSelectedCourse}
            onChange={handleProgramChange}
            placeholder="Select Program"
            disabled
          />
        </div>

        <SelectDropdown
          options={chapterData || []}
          value={selectedChapter}
          onChange={handleChapterCHange}
          placeholder="Select Chapter"
        />

        <MultiSelectDropdown
          options={topicsData || []}
          selectedItems={selectedTopics}
          onChange={handleTopicChange}
          placeholder={selectedChapter ? "Select Topics" : "Select Chapter First"}
        />

        {/* Question Count */}
        <div>
          <Label className="text-sm font-medium">Number of Questions: {questionCount[0]}</Label>
          <Slider
            value={questionCount}
            onValueChange={setQuestionCount}
            max={20}
            min={1}
            step={1}
            className="mt-1"
          />
        </div>

        {/* Question Types */}
        <div>
          <Label className="text-sm font-medium">Question Types</Label>
          <div className="grid gap-2 mt-1">
            <label className="flex items-center space-x-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={selectedQuestionTypes.includes("mcq")}
                onChange={() => setSelectedQuestionTypes(["mcq"])} // For simplicity, MCQs are the only type available
              />
              <span>Multiple Choice</span>
            </label>
          </div>
        </div>

        {/* Bloom's Level Distribution */}
        <div>
          <Label className="text-sm font-medium">Bloom's Level Distribution (%)</Label>
          <div className="space-y-3 mt-2">
            {Object.keys(bloomsDistribution).map((level) => (
              <div key={level} className="flex items-center justify-between">
                <span className="text-sm capitalize">{level}</span>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[bloomsDistribution[level as keyof typeof bloomsDistribution]]}
                    onValueChange={([value]) => handleBloomsChange(level, value)}
                    max={100}
                    min={0}
                    step={5}
                    className="w-24"
                  />
                  <span className="text-xs w-8">
                    {bloomsDistribution[level as keyof typeof bloomsDistribution]}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div>
          <Label className="text-sm font-medium">Difficulty Distribution (%)</Label>
          <div className="space-y-3 mt-2">
            {Object.entries(difficultyDistribution).map(([difficulty, value]) => (
              <div key={difficulty} className="flex items-center justify-between">
                <span className="text-sm capitalize">{difficulty}</span>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[value]}
                    onValueChange={([newValue]) => handleDifficultyChange(difficulty, newValue)}
                    max={100}
                    min={0}
                    step={5}
                    className="w-24"
                  />
                  <span className="text-xs w-8">{value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button onClick={handleGenerateQuestions} disabled={generating} className="w-full">
          {generating ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border border-white border-t-transparent rounded-full" />
              Generating Questions...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Questions
            </>
          )}
        </Button>

        {/* {isGenerating && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500 text-center">
              Creating questions aligned with course outcomes...
            </p>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
};

export default AIQuestionPanel;
