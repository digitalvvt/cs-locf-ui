// src/app/questions/QuestionList.tsx
import React, { Fragment, memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { GenericType, Question } from "@/types";
import { FilterData } from "@/api/api/question-bank-api";
import { Button } from "@/components/ui/button";
import { useGetProgramsQuery } from "@/api/api/program-management-api";
import MarkdownForBot from "@/components/MarkdownForBot";
import MarkdownBotLatest from "@/components/MarkdownBotLatest";
import SelectDropdown from "@/components/Common/SelectDropdown";
import { PaginationServer } from "@/components/ui/pagination-server-side";

// -----------------------
// Props (two modes)
// -----------------------
type ServerModeProps = {
  mode?: "server"; // default
  questionsData: Question[];
  filterData: FilterData;

  // server-side pagination props
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;

  // loading
  isLoading: boolean;
  isFetching: boolean;

  // actions
  onApply: (
    filters: Partial<{
      programId: number;
      subjectId: number;
      chapterId: number;
      topicId: number;
      coId: number;
      questionTypeId: number;
      cognitiveLevelId: number;
    }>
  ) => void;

  onPageChange: (page: number) => void;
  onPerPageChange: (limit: number) => void;

  hasApplied: boolean;
  refetch: () => any;
};

type StaticModeProps = {
  mode: "static";
  questionsData: Question[];
  filterData: FilterData;
  isLoading?: boolean; // optional convenience

  // NEW: show filters in static mode (no pagination)
  showFiltersInStatic?: boolean;

  // When filters are visible in static mode, allow parent to handle Apply
  onApply?: (
    filters: Partial<{
      programId: number;
      courseId: number;
      chapterId: number;
      topicId: number;
      coId: number;
      questionTypeId: number;
      cognitiveLevelId: number;
    }>
  ) => void;
};

type QuestionListProps = ServerModeProps | StaticModeProps;

const Questions = (props: QuestionListProps) => {
  // Mode switch
  const isStatic = props.mode === "static";
  const showFiltersInStatic = isStatic ? !!props.showFiltersInStatic : false;

  // Normalize props so the JSX below doesn't branch everywhere
  const questionsData = props.questionsData ?? [];
  const filterData = props.filterData;

  const page = isStatic ? 1 : props.page;
  const limit = isStatic ? Math.max(questionsData.length || 0, 10) : props.limit;
  const totalPages = isStatic ? 1 : props.totalPages;
  const totalItems = isStatic ? questionsData.length : props.totalItems;
  const isLoading = isStatic ? !!props.isLoading : props.isLoading;
  const isFetching = isStatic ? false : props.isFetching;
  const hasApplied = isStatic ? true : props.hasApplied;

  // onApply is optional in static mode; required in server mode
  const onApply = isStatic ? props.onApply ?? (() => {}) : (props as ServerModeProps).onApply;
  const onPageChange = isStatic ? () => {} : (props as ServerModeProps).onPageChange;
  const onPerPageChange = isStatic ? () => {} : (props as ServerModeProps).onPerPageChange;

  // --- SSR-safe subjectIds read
  const [subjectIdsString, setSubjectIdsString] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSubjectIdsString(localStorage.getItem("subjectIds"));
    }
  }, []);
  const subIdArray = useMemo(
    () => (subjectIdsString ? subjectIdsString.split(",").map((id) => Number(id)) : null),
    [subjectIdsString]
  );

  const userString = localStorage.getItem("userDetails");
  const user = userString ? JSON.parse(userString) : null;

  const programIdsString = user?.programIds || "";

  const { data: programsList } = useGetProgramsQuery(
    subjectIdsString || programIdsString
      ? { subjectIds: subjectIdsString || undefined, programIds: programIdsString || undefined }
      : undefined
  );

  const [explanationExpand, setExplanationExpand] = useState("");

  // local filter states (UI stays unselected by default)
  const [selectedProgram, setSelectedProgram] = useState<GenericType | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<GenericType | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<GenericType | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<GenericType | null>(null);
  const [selectedCO, setSelectedCO] = useState<GenericType | null>(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState<GenericType | null>(null);
  const [selectedCognitiveLevel, setSelectedCognitiveLevel] = useState<GenericType | null>(null);

  const [programData, setProgramData] = useState<GenericType[]>([]);
  const [genericCourses, setGenericCourses] = useState<GenericType[]>([]);
  const [chapterData, setChapterData] = useState<GenericType[]>([]);
  const [topicsData, setTopicsData] = useState<GenericType[]>([]);
  const [courseOutcomesData, setCourseOutcomesData] = useState<GenericType[]>([]);
  const [questionTypeOptionsGeneric, setQuestionTypeOptionsGeneric] = useState<GenericType[]>([]);
  const [cognitiveLevelOptionsGeneric, setCognitiveLevelOptionsGeneric] = useState<GenericType[]>(
    []
  );

  // Guard so we only do the initial auto-apply once (server mode only)
  const didInitialApplyRef = useRef(false);

  // ===== Helpers to compute dependent options =====
  const buildCoursesForProgram = useCallback(
    (programId?: number): GenericType[] => {
      if (!filterData?.courses || !programId) return [];
      const filtered =
        filterData.courses
          .filter((c: any) =>
            subIdArray
              ? c.program_id === programId && subIdArray.includes(c.subjects.id)
              : c.program_id === programId
          )
          .map((item: any) => ({
            id: item.subjects.id, // subject id used across filters
            name: item.subjects.s_name,
          })) ?? [];
      return filtered;
    },
    [filterData?.courses, subIdArray]
  );

  const buildChaptersForCourse = (courseId?: number): GenericType[] => {
    if (!filterData?.chapters || !courseId) return [];
    return (
      filterData.chapters
        .filter((chapter: any) => chapter.s_id === courseId && chapter.p_id == selectedProgram?.id)
        .map((chapter: any) => ({ id: chapter.id, name: chapter.c_name })) ?? []
    );
  };

  const buildTopicsForChapter = (chapterId?: number): GenericType[] => {
    if (!filterData?.topics || !chapterId) return [];
    return (
      filterData.topics
        .filter((topic: any) => topic.c_id === chapterId)
        .map((topic: any) => ({ id: topic.id, name: topic.t_name, c_id: topic.c_id })) ?? []
    );
  };

  const buildCOsForCourse = (courseId?: number): GenericType[] => {
    if (!filterData?.courseOutCome || !courseId) return [];
    return (
      filterData.courseOutCome
        .filter(
          (co: any) =>
            co.courses.course_name_id === courseId && co.courses.program_id === selectedProgram?.id
        )
        .map((co: any) => ({ id: co.id, name: co.co_number })) ?? []
    );
  };

  // Central helpers that set state + rebuild dependents (for manual changes)
  const setProgramAndBuild = (program: GenericType | null) => {
    setSelectedProgram(program);
    setSelectedCourse(null);
    setSelectedChapter(null);
    setSelectedTopic(null);
    setSelectedCO(null);
    setSelectedQuestionType(null);
    setSelectedCognitiveLevel(null);

    const nextCourses = buildCoursesForProgram(program?.id);
    setGenericCourses(nextCourses);

    setChapterData([]);
    setTopicsData([]);
    setCourseOutcomesData([]);
  };

  const setCourseAndBuild = (course: GenericType | null) => {
    setSelectedCourse(course);
    setSelectedChapter(null);
    setSelectedTopic(null);
    setSelectedCO(null);
    setSelectedQuestionType(null);
    setSelectedCognitiveLevel(null);

    const nextChapters = buildChaptersForCourse(course?.id);
    setChapterData(nextChapters);

    const nextCOs = buildCOsForCourse(course?.id);
    setCourseOutcomesData(nextCOs);

    setTopicsData([]);
  };

  const setChapterAndBuild = (chapter: GenericType | null) => {
    setSelectedChapter(chapter);
    setSelectedTopic(null);
    setSelectedCO(null);
    setSelectedQuestionType(null);
    setSelectedCognitiveLevel(null);

    const nextTopics = buildTopicsForChapter(chapter?.id);
    setTopicsData(nextTopics);
  };

  // ===== Build static dropdowns =====
  useEffect(() => {
    if (programsList && Array.isArray(programsList)) {
      const filtered = programsList.map((program: any) => ({
        id: program.id,
        name: program.name,
      }));
      setProgramData(filtered);
    }
  }, [programsList]);

  useEffect(() => {
    const qTypes: GenericType[] =
      filterData?.questionTypes?.map((q: any) => ({
        id: q.s_no,
        name: q.question_type,
      })) ?? [];
    setQuestionTypeOptionsGeneric(qTypes);

    const cogLevels: GenericType[] =
      filterData?.cognitiveLevel?.map((level: any) => ({
        id: level.s_no,
        name: `K${level.s_no} - ${level.title}`,
      })) ?? [];
    setCognitiveLevelOptionsGeneric(cogLevels);
  }, [filterData?.questionTypes, filterData?.cognitiveLevel, filterData]);

  // ===== Utility: pick default program id (prefer one with courses) =====
  const getDefaultProgramId = useCallback(() => {
    if (!programData.length) return undefined;
    const withCourse = programData.find((p) => buildCoursesForProgram(p.id).length > 0);
    return (withCourse ?? programData[0])?.id;
  }, [programData, buildCoursesForProgram]);

  // ===== Initial auto-apply ONLY first programId (server mode only) =====
  useEffect(() => {
    if (isStatic) return; // skip auto-apply in static mode
    if ("refetch" in props) {
      if (didInitialApplyRef.current) return;
      const pid = getDefaultProgramId();
      if (pid) {
        didInitialApplyRef.current = true;
        onPageChange(1);
        onApply({ programId: pid });
      }
    }
  }, [isStatic, getDefaultProgramId, onApply, onPageChange, props]);

  // ===== Handlers =====
  const handleProgramChange = (program: GenericType) => {
    console.log("program", program);
    setProgramAndBuild(program);
  };
  const handleCourseChange = (course: GenericType) => {
    console.log("course", course);
    setCourseAndBuild(course);
  };
  const handlechapterChange = (chapter: GenericType) => {
    console.log("chapter", chapter);
    setChapterAndBuild(chapter);
  };

  // CLEAR: reset UI selections; in server mode also refetch with default program
  const clearFilters = () => {
    // reset UI selections
    setSelectedProgram(null);
    setSelectedCourse(null);
    setSelectedChapter(null);
    setSelectedTopic(null);
    setSelectedCO(null);
    setSelectedQuestionType(null);
    setSelectedCognitiveLevel(null);

    setGenericCourses([]);
    setChapterData([]);
    setTopicsData([]);
    setCourseOutcomesData([]);

    if (!isStatic) {
      // server mode: fetch again with first program id
      const pid = getDefaultProgramId();
      onPageChange(1);
      if (pid) {
        onApply({ programId: pid });
      } else {
        onApply({});
      }
    }
    // static mode: no API call here (parent will decide upon Apply)
  };

  // Manual Apply button
  const handleApplyClick = () => {
    // In both modes, call onApply with current selections
    if (isStatic) {
      // parent of static mode will switch to server mode and call API
    } else {
      // server mode: reset to page 1 before apply
      onPageChange(1);
    }
    onApply({
      programId: selectedProgram?.id ?? undefined,
      subjectId: selectedCourse?.id ?? undefined,
      chapterId: selectedChapter?.id ?? undefined,
      topicId: selectedTopic?.id ?? undefined,
      coId: selectedCO?.id ?? undefined,
      questionTypeId: selectedQuestionType?.id ?? undefined,
      cognitiveLevelId: selectedCognitiveLevel?.id ?? undefined,
    });
  };

  // ===== Presentation helpers =====
  const cognitiveLevelColor = (level?: string) => {
    if (level === "Application" || level === "Applying")
      return "border-[#cefafd] bg-[#cefafd] !text-[#0e748e]";
    if (level === "Remembering") return "border-[#f3e8fe] bg-[#f3e8fe] !text-[#a562d9]";
    if (level === "Understanding") return "border-[#dce9fd] bg-[#dce9fd] !text-[#2550d4]";
    if (level === "Knowledge") return "border-[#cbfbf1] bg-[#cbfbf1] !text-[#09756e]";
    return "border-gray-200 bg-gray-100 !text-gray-700";
  };

  const colorSchemes = [
    { bg: "#EADCF8", text: "#8A2BE2" },
    { bg: "#DCE9FD", text: "#2550D4" },
    { bg: "#D5F7F8", text: "#0D8F95" },
    { bg: "#DBFCE7", text: "#1C715A" },
    { bg: "#FDE2E4", text: "#D8345F" },
    { bg: "#FDDADA", text: "#C62828" },
  ];
  const colorFor = useCallback((label: string) => {
    let h = 0;
    for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) | 0;
    return colorSchemes[Math.abs(h) % colorSchemes.length];
  }, []);

  const isEmpty = hasApplied && !isLoading && !isFetching && questionsData.length === 0;

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Generated Questions</h2>
        {(!isStatic || showFiltersInStatic) && (
          <p className="text-sm text-gray-500 mt-1">
            Defaults use the first available Program. You can change filters and click{" "}
            <span className="font-semibold">Apply</span>. Use{" "}
            <span className="font-semibold">Clear</span> to reset.
          </p>
        )}
      </div>

      {/* Filters + Apply */}
      {(!isStatic || showFiltersInStatic) && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Filters</h3>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-gray-300" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button variant="default" color={"primary"} size="sm" onClick={handleApplyClick}>
                Apply
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Program */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Program</label>
              <SelectDropdown
                options={programData}
                value={selectedProgram}
                onChange={handleProgramChange}
                placeholder="Select Program"
              />
            </div>

            {/* Course */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Course</label>
              <SelectDropdown
                options={
                  selectedProgram ? genericCourses : [{ id: 0, name: "Select Program first" }]
                }
                value={selectedCourse}
                onChange={handleCourseChange}
                placeholder={selectedProgram ? "Select a course" : "Select Programme first"}
              />
            </div>

            {/* Chapter */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Chapter</label>
              <SelectDropdown
                options={selectedCourse ? chapterData : [{ id: 0, name: "Select Course first" }]}
                value={selectedChapter}
                onChange={handlechapterChange}
                placeholder={selectedCourse ? "Select a chapter" : "Select Course first"}
              />
            </div>

            {/* Topic */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Topic</label>
              <SelectDropdown
                options={selectedChapter ? topicsData : [{ id: 0, name: "Select Chapter first" }]}
                value={selectedTopic}
                onChange={setSelectedTopic}
                placeholder={selectedChapter ? "Select a topic" : "Select Chapter first"}
              />
            </div>

            {/* CO */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Course Outcome (CO)</label>
              <SelectDropdown
                options={
                  selectedCourse ? courseOutcomesData : [{ id: 0, name: "Select Course first" }]
                }
                value={selectedCO}
                onChange={setSelectedCO}
                placeholder={selectedCourse ? "Select a CO" : "Select Course first"}
              />
            </div>

            {/* Question Type */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Question Type</label>
              <SelectDropdown
                options={questionTypeOptionsGeneric}
                value={selectedQuestionType}
                onChange={setSelectedQuestionType}
                placeholder="Select Question Type"
              />
            </div>

            {/* Cognitive Level */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Cognitive Level</label>
              <SelectDropdown
                options={cognitiveLevelOptionsGeneric}
                value={selectedCognitiveLevel}
                onChange={setSelectedCognitiveLevel}
                placeholder="Select Cognitive Level"
              />
            </div>
          </div>
        </div>
      )}

      {/* States */}
      {!hasApplied && !isStatic ? (
        <div className="rounded-lg border bg-white p-6 text-center text-gray-600">
          Preparing defaults…
        </div>
      ) : isLoading || isFetching ? (
        <div className="flex justify-center items-center h-[200px]">
          <p className="text-gray-600 text-sm">Loading questions...</p>
        </div>
      ) : isEmpty ? (
        <div className="mt-6 rounded-lg border border-dashed bg-white p-8 text-center">
          <div className="text-lg font-semibold text-gray-800">
            No questions available for the selected filters
          </div>
          <div className="mt-1 text-sm text-gray-500">
            Try adjusting the filters or clear them and Apply again.
          </div>
        </div>
      ) : (
        <>
          {/* Questions List */}
          <div className="flex flex-col gap-6">
            {questionsData.map((d, i) => (
              <Fragment key={String(d.id ?? d.s_no ?? `${d.subjectName}-${d.chapterName}-${i}`)}>
                <div className="relative w-full rounded-lg border px-3 py-4">
                  {/* Tags */}
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {!!d.cognitive_level && (
                      <div
                        className={`flex items-center gap-2 rounded-3xl border px-4 py-2 ${cognitiveLevelColor(
                          d.cognitive_level.title
                        )}`}
                      >
                        <span className="text-[11px] font-medium sm:text-[12px]">
                          {`K${d.cognitive_level.s_no} - ${d.cognitive_level.title}`}
                        </span>
                      </div>
                    )}
                    <Badge
                      className={cn(
                        "rounded-[25px] px-4 py-2 text-[11px] font-medium sm:text-[12px]",
                        d.difficulty === 1
                          ? "bg-[#d0fae5] !text-[#007758]"
                          : d.difficulty === 2
                          ? "bg-[#fdf9c7] !text-[#a1621b]"
                          : "bg-[#fee2e2] !text-[#ba2023]"
                      )}
                    >
                      {d.difficulty === 1 ? "Easy" : d.difficulty === 2 ? "Medium" : "Hard"}
                    </Badge>
                    <Badge className="bg-[#e0f2fe] px-4 py-2 text-[11px] text-[#0a699e] sm:text-[12px]">
                      <Timer size={18} className="me-2" /> {d.estimated_time} mins
                    </Badge>
                    {!!d.question_type && (
                      <Badge className="bg-[#a6d7f8] px-4 py-2 text-[11px] text-[#423d3d] sm:text-[12px]">
                        {d.question_type.question_type}
                      </Badge>
                    )}
                  </div>

                  {/* Question */}
                  <div className="px-[15px] py-[10px]">
                    <div className="inline-flex leading-7">
                      <span className="mr-2 text-[14px] font-bold text-[#00143f]">
                        {(page - 1) * limit + i + 1}.
                      </span>
                      <MarkdownForBot content={d.question} />
                    </div>
                  </div>

                  {/* Options */}
                  {[d.optionA, d.optionB, d.optionC, d.optionD].filter(Boolean).map((opt, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "mt-2 rounded-sm border px-[15px] py-[8px]",
                        `${d.correctOption}` === `${idx + 1}` ? "bg-[#C7F7D4] text-[#046444]" : ""
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium whitespace-nowrap">
                          Option {String.fromCharCode(65 + idx)}:
                        </span>
                        <div className="flex-1">
                          <MarkdownForBot content={opt as string} />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Subject + Chapter */}
                  <div className="my-4 flex flex-wrap items-center gap-2 rounded-lg">
                    <div className="flex items-center gap-2 bg-[#e0e7fe] px-4 py-2 rounded-3xl">
                      <span className="text-[13px] font-medium text-[#000]">📚 Subject:</span>
                      <span className="text-[13px] font-medium text-[#473ac5]">
                        {d.subjectName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#fef2ca] px-4 py-2 rounded-3xl">
                      <span className="text-[13px] font-medium text-[#000]">📑 Chapter:</span>
                      <span className="text-[13px] font-medium text-[#b4541c]">
                        {d.chapterName}
                      </span>
                    </div>
                  </div>

                  {/* Keywords */}
                  {d.Keywords && (
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-[13px] font-semibold">🔄 Concepts:</div>
                      {d.Keywords.split(",")
                        .filter((k) => k.trim().length > 0)
                        .map((keyword, idx) => {
                          const colors = colorFor(keyword);
                          return (
                            <div key={idx} className="my-4">
                              <div
                                className="flex items-center gap-2 rounded-3xl px-4 py-2"
                                style={{ backgroundColor: colors.bg }}
                              >
                                <span
                                  style={{ color: colors.text }}
                                  className="text-[12px] font-medium"
                                >
                                  {keyword}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* Explanation */}
                  <Accordion
                    type="single"
                    collapsible
                    value={explanationExpand}
                    onValueChange={(val) => setExplanationExpand(val)}
                    className="mt-4 w-full border bg-[#f3faff] px-[15px] py-[2px]"
                  >
                    <AccordionItem value={`${i}`} className="border-none">
                      <AccordionTrigger>Explanation</AccordionTrigger>
                      <AccordionContent className="mark_down_text">
                        <MarkdownBotLatest content={d.answerDescription} />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </Fragment>
            ))}
          </div>

          {/* Pagination (server-side only) */}
          {!isStatic && (
            <div className="flex justify-center mt-7">
              <PaginationServer
                currentPage={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
                perPage={limit}
                onPerPageChange={onPerPageChange}
                totalItems={totalItems}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default memo(Questions);
