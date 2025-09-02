import React, { useEffect, useState } from "react";
import MultiSelectDropdown from "@/components/Common/MultiSelectDropdown";
import SelectDropdown from "@/components/Common/SelectDropdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { GenericType } from "@/types";
import { Brain, Wand2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import {
  useGetCoursesByProgramIdQuery,
  useGetOutComesbyCourseIdQuery,
} from "@/api/api/program-outcomes-api";
import { useGetProgramsQuery } from "@/api/api/program-management-api";
import { GeneratePayload } from "../CourseDetails/qBank/AIQuestionPanel";

const questionTypeOptions = [
  { id: "multiple_choice", label: "Multiple Choice" }
  // { id: "short", label: "Short Answer" },
  // { id: "long", label: "Essay" },
  // { id: "truefalse", label: "True / False" },
];

interface IAIQuestionGeneratorProps {
  generating: boolean;
  onGenerateQuestions: (data: GeneratePayload) => void;
}

const AIQuestionGenerator = ({ generating, onGenerateQuestions }: IAIQuestionGeneratorProps) => {
  const { toast } = useToast();
  const { data: programsList, isLoading, error } = useGetProgramsQuery();
  const [programData, setProgramData] = useState<GenericType[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<GenericType | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<GenericType | null>(null);
  const [outComesData, setOutComesData] = useState([]);
  const [genericOutComes, setGenericOutComes] = useState<GenericType[]>([]);
  const [genericCourses, setGenericCourses] = useState<GenericType[]>([]);
  const [selectedCourseOutcomes, setSelectedCourseOutcomes] = useState<number[] | null>(null);
  const [questionCount, setQuestionCount] = useState<number[]>([5]);
  const [selectedQuestionType, setSelectedQuestionType] = useState<string | null>(null);
  const [chapterNames, setChapterNames] = useState<string[]>([]);
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
  const [subjectName, setSubjectName] = useState("");

  const filteredPrograms =
    programsList &&
    programsList.map((program: any) => ({
      id: program.id,
      name: program.name,
    }));

  const {
    data: courses = [],
    isLoading: isCoursesLoading,
    error: courseError,
  } = useGetCoursesByProgramIdQuery(selectedProgram ? String(selectedProgram.id) : ""!, {
    skip: !selectedProgram,
  });

  const {
    data: outcomes = [],
    isLoading: isOutComesLoading,
    error: outcomesError,
  } = useGetOutComesbyCourseIdQuery(selectedCourse ? String(selectedCourse.id) : "", {
    skip: !selectedCourse,
  });

  useEffect(() => {
    if (outcomes && outcomes.length > 0) {
      // Store the raw outcomes data
      setOutComesData(outcomes);
      setSubjectName(outcomes[0].subjectName); // Assuming courseName is available in outcomes

      // Transform the outcomes data to the format required for MultiSelect
      const transformed = outcomes.map((item) => ({
        id: item.id,
        name: item.code,
        chapterName: item.chapterName,
        // Add any other required fields
      }));

      setGenericOutComes(transformed); // Set transformed data for MultiSelect
    }
  }, [outcomes]);

  useEffect(() => {
    if (courses && courses.length > 0) {
      const transformedCourses = courses.map((course: any) => ({
        id: course.id,
        name: course.name,
      }));
      setGenericCourses(transformedCourses);
    }
  }, [courses]);

  const handleProgramChange = (program: GenericType) => {
    // Step 1: Reset everything below program immediately
    setSelectedCourse(null);
    setSelectedCourseOutcomes(null);
    setGenericCourses([]); // optional: clear current courses while loading new ones
    setGenericOutComes([]);
    setOutComesData([]);
    setSubjectName("");

    // Step 2: Then set the new program (triggers course API call)
    setSelectedProgram(program);
  };

  const handleCourseChange = (course: GenericType) => {
    setSelectedCourseOutcomes(null);
    setGenericOutComes([]);
    setOutComesData([]);
    setSubjectName("");

    setSelectedCourse(course); // triggers CO API
  };

  const handleCourseOutcomesChange = (selectedOutcomes: number[]) => {
    setSelectedCourseOutcomes(selectedOutcomes);
    const selectedOutComeString = outComesData
      .filter((outcome: any) => selectedOutcomes.includes(outcome.id))
      .map((outcome: any) => outcome.chapterName);

    setChapterNames(selectedOutComeString);
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
        variant: "destructive",
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
        variant: "destructive",
      });
    }
  };

  const handleGenerateQuestions = () => {
    if (!selectedCourse) {
      toast({
        title: "No Course Selected",
        description: "Please select a course to generate questions.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCourseOutcomes || selectedCourseOutcomes.length === 0) {
      toast({
        title: "No Course Outcomes Selected",
        description: "Please select at least one course outcome.",
        variant: "destructive",
      });
      return;
    }

    if (questionCount[0] < 1 || questionCount[0] > 20) {
      toast({
        title: "Invalid Question Count",
        description: "Please select a question count between 1 and 20.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedQuestionType) {
      toast({
        title: "No Question Type Selected",
        description: "Please select a question type.",
        variant: "destructive",
      });
      return;
    }

    const generatedData = {
      user_id: 2, // Set to default value or pass dynamically
      uuid: uuidv4(), // Generate unique UUID
      program_id: selectedProgram.id, // From params
      subject_name: [subjectName], // From selected course
      chapter_name: chapterNames, // From selected outcomes
      concepts: [], // Will be updated based on selected outcomes' topics
      question_type: selectedQuestionType, // Hardcoded to "multiple_choice"
      cognitive_level: bloomsDistribution, // Cognitive levels from state
      difficulty: difficultyDistribution, // Difficulty from state
      number_of_questions: questionCount[0], // From slider
      model: 1, // Default
      stream: 1, // Default
    };

    chapterNames.forEach((outcomeId) => {
      const outcome = outComesData.find(
        (item) => item.chapterName === outcomeId // Find outcome by chapterName
      );
      if (outcome) {
        generatedData.concepts.push(outcome.topicNames); // if you want full string
        // Add all topics from topicNames
      }
    });

    // Simulate question generation
    onGenerateQuestions(generatedData);
  };

  useEffect(() => {
    if (programsList && Array.isArray(programsList)) {
      const filtered = programsList.map((program: any) => ({
        id: program.id,
        name: program.name,
      }));
      setProgramData(filtered);
    }
  }, [programsList]);

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Question Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* programme selection */}
        <SelectDropdown
          options={programData}
          value={selectedProgram}
          onChange={handleProgramChange}
          placeholder="Select a program"
        />

        {/* course selection */}
        <SelectDropdown
          options={selectedProgram ? genericCourses : [{ id: 0, name: "Select Program first" }]}
          value={selectedCourse}
          onChange={handleCourseChange}
          placeholder={selectedProgram ? "Select a course" : "Select Programme first"}
        />

        {/* course outcomes multiselect */}
        <MultiSelectDropdown
          options={genericOutComes}
          selectedIds={selectedCourseOutcomes}
          onChange={handleCourseOutcomesChange}
          placeholder={selectedCourse ? "Select CO" : "Select Course First"}
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
          <div className="flex gap-4 mt-1 flex-wrap">
            {questionTypeOptions.map((option) => (
              <label key={option.id} className="flex items-center space-x-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedQuestionType === option.id}
                  onChange={() =>
                    setSelectedQuestionType(selectedQuestionType === option.id ? null : option.id)
                  }
                />
                <span>{option.label}</span>
              </label>
            ))}
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

export default AIQuestionGenerator;
