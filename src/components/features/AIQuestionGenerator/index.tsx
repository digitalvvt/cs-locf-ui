"use client";
import { useEffect, useState } from "react";
import MultiSelectDropdown from "@/components/Common/MultiSelectDropdown";
import SelectDropdown from "@/components/Common/SelectDropdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { GenericType, GenericTypes } from "@/types";
import { Brain, Wand2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import {
  useGetCoursesByProgramIdQuery,
  useGetOutComesbyCourseIdQuery,
} from "@/api/api/program-outcomes-api";
import { useGetProgramsQuery } from "@/api/api/program-management-api";
import { API_BASE_URL, QB_BASE_URL } from "@/config";
import { useNavigate } from "react-router-dom";
import { useGetQuestionFilterDataQuery } from "@/api/api/question-bank-api";
import { skipToken } from "@reduxjs/toolkit/query";

const questionTypeOptions = [
  { id: "multiple_choice", label: "Multiple Choice" },
  // { id: "short", label: "Short Answer" },
  // { id: "long", label: "Essay" },
  // { id: "truefalse", label: "True / False" },
];

const AIQuestionGenerator = () => {
  const userId = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails")!).id
    : null;
  const userString = localStorage.getItem("userDetails");
  const user = userString ? JSON.parse(userString) : null;

  const programIdsString = user?.programIds || "";
  const navigate = useNavigate();
  const { toast } = useToast();
  const subjectIdsString = localStorage.getItem("subjectIds");

  const {
    data: programsList,
    isLoading,
    error,
  } = useGetProgramsQuery(
    subjectIdsString || programIdsString
      ? { subjectIds: subjectIdsString || undefined, programIds: programIdsString || undefined }
      : undefined
  );
  const [generating, setGenerating] = useState<boolean>(false);
  const [programData, setProgramData] = useState<GenericType[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<GenericType | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<GenericType | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<GenericType | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<GenericType[] | null>(null);
  const [chapterData, setChapterData] = useState<GenericType[]>([]);
  const [topicsData, setTopicsData] = useState<GenericType[]>([]);
  const [outComesData, setOutComesData] = useState([]);
  const [genericOutComes, setGenericOutComes] = useState<GenericType[]>([]);
  const [genericCourses, setGenericCourses] = useState<GenericType[]>([]);
  const [coOutComes, setCoOutComes] = useState<GenericTypes[]>([]);
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
    easy: 50,
    medium: 50,
    hard: 0,
  });
  const [subjectName, setSubjectName] = useState("");
  const [subjectId, setSubjectId] = useState<number>(0);

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
  } = useGetCoursesByProgramIdQuery(
    selectedProgram
      ? { programId: String(selectedProgram.id), subjectIds: subjectIdsString || undefined }
      : skipToken
  );

  const {
    data: outcomes = [],
    isLoading: isOutComesLoading,
    error: outcomesError,
  } = useGetOutComesbyCourseIdQuery(selectedCourse ? String(selectedCourse.id) : "", {
    skip: !selectedCourse,
  });

  const { data: questionFilter } = useGetQuestionFilterDataQuery();

  useEffect(() => {
    if (outcomes && outcomes.length > 0) {
      // Store the raw outcomes data
      setOutComesData(outcomes);
      setSubjectName(outcomes[0].subjectName);
      // Assuming courseName is available in outcomes

      // Transform the outcomes data to the format required for MultiSelect
      const transformed = outcomes.map((item) => ({
        id: item.id,
        name: item.code,
        chapterName: item.chapterName,
        description: item.description,
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
    setSelectedChapter(null);
    setSelectedTopics(null);
    setGenericCourses([]); // optional: clear current courses while loading new ones
    setGenericOutComes([]);
    setChapterData([]);
    setTopicsData([]);
    setOutComesData([]);
    setSubjectName("");

    // Step 2: Then set the new program (triggers course API call)
    setSelectedProgram(program);
  };

  const handleCourseChange = (course: GenericType) => {
    setSelectedCourseOutcomes(null);
    setSelectedTopics(null);
    setSelectedChapter(null);
    setGenericOutComes([]);
    setOutComesData([]);
    setTopicsData([]);
    setChapterData([]);
    setSubjectName("");
    setSelectedCourse(course); // triggers CO API

    const subjectId = questionFilter?.courses?.find((c: any) => c.course_name_id === course.id)?.id;
    setSubjectId(subjectId);

    const chapters = questionFilter.chapters
      .filter((chapter: any) => chapter.s_id === course.id && chapter.p_id === selectedProgram?.id)
      .map((chapter: any) => ({ id: chapter.id, name: chapter.c_name }));

    setChapterData(chapters);
  };

  const handleChapterChange = (chapters: GenericType) => {
    setTopicsData([]);
    setSelectedTopics(null);
    const topics = questionFilter.topics
      .filter((topic: any) => topic.c_id === chapters.id && topic.p_id === selectedProgram?.id)
      .map((topic: any) => ({ id: topic.id, name: topic.t_name }));
    setTopicsData(topics);
    setSelectedChapter(chapters);
  };

  const handleTopicChange = (topic: GenericType[]) => {
    setSelectedTopics(topic);
  };

  const handleCourseOutcomesChange = (selectedOutcomes: number[]) => {
    setSelectedCourseOutcomes(selectedOutcomes);

    const co_outcomes = genericOutComes
      .filter((outcome: GenericType) => selectedOutcomes.includes(outcome.id))
      .map((outcome) => ({
        name: outcome.name,
        description: outcome.description,
        chapterName: outcome.chapterName,
      }));
    setCoOutComes(co_outcomes);

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

  const handleGenerateQuestions = async () => {
    if (!selectedProgram) {
      toast({
        title: "No Programm Selected",
        description: "Please select a programme to generate questions.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCourse) {
      toast({
        title: "No Course Selected",
        description: "Please select a course to generate questions.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedChapter) {
      toast({
        title: "No Chapter Selected",
        description: "Please select a chapter to generate questions.",
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

    if (!selectedQuestionType) {
      toast({
        title: "No Question Type Selected",
        description: "Please select a question type.",
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

    const generatedData = {
      user_id: userId, // Set to default value or pass dynamically
      uuid: uuidv4(), // Generate unique UUID
      course_id: subjectId, // From selected course
      subject_id: selectedCourse.id, // From selected course
      program_id: selectedProgram.id, // From params
      program_name: selectedProgram.name,
      subject_name: [subjectName], // From selected course
      chapter_name: [selectedChapter.name], // From selected chapters
      topic_name: selectedTopics.map((topic: any) => topic.name), // Will be updated based on selected outcomes' topics
      question_type: selectedQuestionType, // Hardcoded to "multiple_choice"
      cognitive_level: bloomsDistribution, // Cognitive levels from state
      difficulty: difficultyDistribution, // Difficulty from state
      number_of_questions: questionCount[0], // From slider
      model: 2, // Default
      stream: 1, // Default
    };

    setGenerating(true);
    try {
      const response = await fetch("https://doubts.collegesuggest.com/locf/question_bank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to send data to the API");
      }

      const result = await response.json();

      if (result) {
        toast({
          title: "Success",
          description: "Questions generated successfully.",
          variant: "default",
        });
        navigate("/question-history");
      } else {
        toast({
          title: "Error",
          description: "Something went wrong while generating questions. Try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending data to API:", error);
      toast({
        title: "Error",
        description: "An error occurred while sending data to the API.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
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
    <div className="max-w-4xl mx-auto">
      <Card className="w-full">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Brain className="h-6 w-6" />
            AI Question Generator
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Selection Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Program</Label>
              <SelectDropdown
                options={programData}
                value={selectedProgram}
                onChange={handleProgramChange}
                placeholder="Select a program"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Course</Label>
              <SelectDropdown
                options={
                  selectedProgram ? genericCourses : [{ id: 0, name: "Select Program first" }]
                }
                value={selectedCourse}
                onChange={handleCourseChange}
                placeholder={selectedProgram ? "Select a course" : "Select Programme first"}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Chapter</Label>
              <SelectDropdown
                options={chapterData}
                value={selectedChapter}
                onChange={handleChapterChange}
                placeholder={selectedCourse ? "Select a chapter" : "Select Course First"}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Course Topics</Label>
              <MultiSelectDropdown
                options={topicsData}
                selectedItems={selectedTopics}
                onChange={handleTopicChange}
                placeholder={selectedChapter ? "Select Topics" : "Select Chapters First"}
              />
            </div>
          </div>

          <Separator />

          {/* Course Outcomes Section */}
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted/20">
              <Label className="text-sm font-medium">Question Type</Label>
              <div className="flex gap-4 mt-2 flex-wrap">
                {questionTypeOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center space-x-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedQuestionType === option.id}
                      onChange={() =>
                        setSelectedQuestionType(
                          selectedQuestionType === option.id ? null : option.id
                        )
                      }
                      className="rounded border-gray-300"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Question Count Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Number of Questions</Label>
              <span className="text-sm font-semibold bg-muted px-3 py-1 rounded-md">
                {questionCount[0]}
              </span>
            </div>
            <Slider
              value={questionCount}
              onValueChange={setQuestionCount}
              max={20}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground"></div>
          </div>

          <Separator />

          {/* Bloom's Level Distribution */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Bloom's Level Distribution</Label>
              <div className=" font-semibold rounded-md p-1 px-2 bg-[#F1F5F9]">
                <span className="text-sm text-[#020817]">
                  Total: {Object.values(bloomsDistribution).reduce((a, b) => a + b, 0)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(bloomsDistribution).map(([level, value], index) => (
                <div key={level} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium capitalize">{`${level} - K${
                      index + 1
                    }`}</Label>
                    <span className="text-sm font-semibold bg-muted px-2 py-1 rounded text-center min-w-[50px]">
                      {value}%
                    </span>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={([newValue]) => handleBloomsChange(level, newValue)}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Difficulty Distribution */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Difficulty Distribution</Label>
              <div className=" font-semibold rounded-md p-1 px-2 bg-[#F1F5F9]">
                <span className="text-sm text-[#020817]">
                  Total: {Object.values(difficultyDistribution).reduce((a, b) => a + b, 0)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(difficultyDistribution).map(([difficulty, value]) => (
                <div key={difficulty} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium capitalize">{difficulty}</Label>
                    <span className="text-sm font-semibold bg-muted px-2 py-1 rounded text-center min-w-[50px]">
                      {value}%
                    </span>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={([newValue]) => handleDifficultyChange(difficulty, newValue)}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Generate Button */}
          <div className="pt-4">
            <Button
              onClick={handleGenerateQuestions}
              disabled={generating}
              className="w-full h-12 text-base"
              size="lg"
              variant="default"
              color="primary"
            >
              {generating ? (
                <>
                  <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 mr-3" />
                  Generate Questions
                </>
              )}
            </Button>
          </div>

          {/* Loading States */}
          {(isLoading || isCoursesLoading || isOutComesLoading) && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-gray-600 rounded-full mr-2" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          )}

          {/* Error States */}
          {(error || courseError || outcomesError) && (
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">Error loading data. Please try again.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIQuestionGenerator;
