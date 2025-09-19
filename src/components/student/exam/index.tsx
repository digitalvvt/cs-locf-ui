"use client";
import {
  useClearExamSessionMutation,
  useGetQuestionsByExamIdQuery,
  useSaveExamResponseMutation,
  useUpdateExamStatusMutation,
} from "@/api/api/student/student-api";
import Footer from "./Footer";
import OptionCard from "./question/optionCard";
import QuestionCard from "./question/QuestionCard";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import Timer from "./question/Timer";
import SubjectComponent from "../SubjectComponent";
import { useToast } from "@/hooks/use-toast";

interface ExamResponse {
  qId: number;
  ans?: string;
  mr?: boolean;
  saved?: boolean;
  visited?: boolean;
}

interface ApiResponse {
  uuid: string;
  lastQuestionId: number;
  answer?: string;
  mr?: string;
  remainingTime: number;
  timeTaken?: number;
  correctAns: string;
}

const ExamPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const sessionUUID = new URLSearchParams(location.search).get("session");
  const examId = Number(id);

  const {
    data: questionsData,
    isLoading,
    error,
  } = useGetQuestionsByExamIdQuery({ exam_id: examId });

  const questions = questionsData?.questions;
  const examTime = questionsData?.exam_time;

  const [saveExamResponse] = useSaveExamResponseMutation();
  const [updateExamStatus] = useUpdateExamStatusMutation();
  const [clearExamSession] = useClearExamSessionMutation();

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [examResponses, setExamResponses] = useState<ExamResponse[]>([]);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isBookmarked, setIsBookmarked] = useState<Record<number, boolean>>({});
  const [questionTimesSpent, setQuestionTimesSpent] = useState<Record<number, number>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();

  // Add refs to prevent multiple submissions
  const isSubmittingRef = useRef(false);
  const hasSubmittedRef = useRef(false);
  const questionStartTimeRef = useRef<number>(Date.now());

  // Effect to initialize questionTimesSpent and set initial startTime when questions are loaded
  useEffect(() => {
    if (questionsData?.questions) {
      const initialTimers: Record<number, number> = {};
      questionsData.questions.forEach((q: any) => {
        initialTimers[q.s_no] = 0;
      });
      setQuestionTimesSpent(initialTimers);
      questionStartTimeRef.current = Date.now();
    }
  }, [questionsData]);

  // Effect to mark question as visited when currentQIndex changes
  useEffect(() => {
    if (questions && questions[currentQIndex]) {
      const currentQuestion = questions[currentQIndex];
      setExamResponses((prev) => {
        const existingIndex = prev.findIndex((res) => res.qId === currentQuestion.s_no);
        if (existingIndex === -1) {
          return [
            ...prev,
            {
              qId: currentQuestion.s_no,
              ans: "",
              mr: false,
              saved: false,
              visited: true,
            },
          ];
        }
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], visited: true };
        return updated;
      });
    }
  }, [currentQIndex, questions]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentQIndex]);

  const calculateTimeSpentOnCurrentQuestionSession = useCallback(() => {
    return Math.floor((Date.now() - questionStartTimeRef.current) / 1000);
  }, []);

  const getCurrentQuestionAccumulatedTime = useCallback(() => {
    if (!questions || !questions[currentQIndex] || !questionTimesSpent) return 0;
    const currentQuestionSNo = questions[currentQIndex].s_no;
    const timeOnCurrentSession = calculateTimeSpentOnCurrentQuestionSession();
    return (questionTimesSpent[currentQuestionSNo] || 0) + timeOnCurrentSession;
  }, [currentQIndex, questions, questionTimesSpent, calculateTimeSpentOnCurrentQuestionSession]);

  const saveResponseForCurrentQuestion = async ({
    includeAnswer = true,
    includeCorrectAns = true,
    timeTakenOverride,
  }: {
    includeAnswer?: boolean;
    includeCorrectAns?: boolean;
    timeTakenOverride?: number;
  }) => {
    if (!questions || !questions[currentQIndex]) return;

    const selectedAnswer = selectedAnswers[questions[currentQIndex].s_no];
    const selectedOptionId =
      includeAnswer && selectedAnswer ? getOptionIdFromKey(selectedAnswer) : "";
    const currentResponse = examResponses.find((res) => res.qId === questions[currentQIndex].s_no);
    const isMarkedForReview = currentResponse?.mr || false;

    if (!sessionUUID) {
      console.error("Missing session UUID");
      return;
    }

    const timeTakenToSend =
      timeTakenOverride !== undefined ? timeTakenOverride : getCurrentQuestionAccumulatedTime();

    const payload: ApiResponse = {
      uuid: sessionUUID,
      lastQuestionId: questions[currentQIndex].s_no,
      answer: selectedOptionId,
      mr: isMarkedForReview ? "true" : "",
      remainingTime,
      timeTaken: timeTakenToSend,
      correctAns: includeCorrectAns ? questions[currentQIndex].correct_opt : "",
    };

    await saveExamResponse(payload);
  };

  // Modified handleSubmitExam with proper guards
  const handleSubmitExam = useCallback(async () => {
    // Guard against multiple submissions
    if (hasSubmittedRef.current || isSubmittingRef.current) {
      console.log("Exam already submitted or submission in progress - returning early");
      return;
    }

    if (!sessionUUID) {
      console.error("Missing session UUID");
      return;
    }

    // Set flags to prevent multiple submissions
    isSubmittingRef.current = true;
    hasSubmittedRef.current = true;

    try {
      // Save current question's time before submitting
      if (questions && questions[currentQIndex]) {
        const timeSpentInCurrentSession = calculateTimeSpentOnCurrentQuestionSession();
        const currentQuestionSNo = questions[currentQIndex].s_no;
        const totalTimeForCurrentQuestion =
          (questionTimesSpent[currentQuestionSNo] || 0) + timeSpentInCurrentSession;

        setQuestionTimesSpent((prevTimers) => ({
          ...prevTimers,
          [currentQuestionSNo]: totalTimeForCurrentQuestion,
        }));
      }

      const res = await updateExamStatus({ uuid: sessionUUID }).unwrap();

      if (res.success && sessionUUID) {
        const userData = JSON.parse(localStorage.getItem("userDetails") || "{}");
        const userId = userData?.id;
        if (userId) {
          console.log("Navigating to result page...");
          navigate(`/exam/result/${sessionUUID}/${userId}`);
        } else {
          console.warn("User ID not found in localStorage");
        }
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      // Reset flags on error to allow retry
      isSubmittingRef.current = false;
      hasSubmittedRef.current = false;
    }
  }, [
    sessionUUID,
    questions,
    currentQIndex,
    questionTimesSpent,
    calculateTimeSpentOnCurrentQuestionSession,
    updateExamStatus,
    navigate,
  ]);

  const handleTimeUpdate = (timeLeft: number) => {
    setRemainingTime(timeLeft);
  };

  // Fixed handleTimeUp - removed useCallback and made it a regular function
  const handleTimeUp = async () => {
    console.log("⏰ TIME IS UP! Auto-submitting exam...");

    // Prevent multiple calls
    if (hasSubmittedRef.current || isSubmittingRef.current) {
      console.log("Exam already submitted or in progress, ignoring time up");
      return;
    }

    // Call handleSubmitExam directly
    await handleSubmitExam();
  };

  // Send periodic time updates to API
  useEffect(() => {
    if (
      sessionUUID &&
      questions &&
      questions.length > 0 &&
      questions[currentQIndex] &&
      remainingTime > 0 &&
      !hasSubmittedRef.current
    ) {
      const interval = setInterval(() => {
        // Skip if exam is submitted
        if (hasSubmittedRef.current) {
          clearInterval(interval);
          return;
        }

        saveResponseForCurrentQuestion({
          includeAnswer: false,
          includeCorrectAns: false,
          timeTakenOverride: getCurrentQuestionAccumulatedTime(),
        }).catch(console.error);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [sessionUUID, currentQIndex, questions, remainingTime]);

  if (isLoading) return <p>Loading questions...</p>;
  if (error || !questions) return <p>Error fetching questions</p>;

  const currentQuestion = questions[currentQIndex];

  const getOptionIdFromKey = (optionKey: string): string => {
    const option = currentQuestion.options.find((opt) => opt.optionKey === optionKey);
    return option?.optionId || "";
  };

  const handleNavigation = async (newIndex: number) => {
    // Prevent navigation if exam is submitted
    if (hasSubmittedRef.current) return;

    if (!currentQuestion) return;

    const timeSpentInCurrentSession = calculateTimeSpentOnCurrentQuestionSession();
    const currentQuestionSNo = currentQuestion.s_no;
    const totalTimeForCurrentQuestion =
      (questionTimesSpent[currentQuestionSNo] || 0) + timeSpentInCurrentSession;

    setQuestionTimesSpent((prevTimers) => ({
      ...prevTimers,
      [currentQuestionSNo]: totalTimeForCurrentQuestion,
    }));

    // For navigation without explicit save, send empty answer
    try {
      setIsSaving(true);
      await saveResponseForCurrentQuestion({
        includeAnswer: false,
        includeCorrectAns: true,
        timeTakenOverride: totalTimeForCurrentQuestion,
      });

      questionStartTimeRef.current = Date.now();
      setCurrentQIndex(newIndex);
    } catch (err) {
      toast({
        title: "Failed to save",
        description: "Could not mark question as not saved. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    if (currentQIndex < questions.length - 1 && !hasSubmittedRef.current) {
      await handleNavigation(currentQIndex + 1);
    }
  };

  const handlePrev = async () => {
    if (currentQIndex > 0 && !hasSubmittedRef.current) {
      await handleNavigation(currentQIndex - 1);
    }
  };

  const handleLeaveExam = async () => {
    // Prevent leaving if submission is in progress
    if (isSubmittingRef.current) return;

    const localStorageKey = `exam_session_uuid_${examId}`;
    const uuid = localStorage.getItem(localStorageKey);
    if (uuid) {
      try {
        await clearExamSession({ uuid }).unwrap();
      } catch (err) {
        console.error("❌ Failed to clear session on backend:", err);
      }
      localStorage.removeItem(localStorageKey);
    }
    navigate("/exams");
  };

  const handleSaveAndNext = async () => {
    if (hasSubmittedRef.current) return;

    try {
      setIsSaving(true);

      // Calculate and persist time for current question
      const timeSpentInCurrentSession = calculateTimeSpentOnCurrentQuestionSession();
      const currentQuestionSNo = currentQuestion.s_no;
      const totalTimeForCurrentQuestion =
        (questionTimesSpent[currentQuestionSNo] || 0) + timeSpentInCurrentSession;

      setQuestionTimesSpent((prevTimers) => ({
        ...prevTimers,
        [currentQuestionSNo]: totalTimeForCurrentQuestion,
      }));

      // Save with selected answer
      await saveResponseForCurrentQuestion({
        includeAnswer: true,
        includeCorrectAns: true,
        timeTakenOverride: totalTimeForCurrentQuestion,
      });

      // Update local saved state for UI badges
      const selectedAnswer = selectedAnswers[currentQuestion.s_no];
      const currentResponse = examResponses.find((res) => res.qId === currentQuestion.s_no);
      const isMarkedForReview = currentResponse?.mr || false;

      setExamResponses((prev) => {
        const existingIndex = prev.findIndex((res) => res.qId === currentQuestion.s_no);
        const newResponse: ExamResponse = {
          qId: currentQuestion.s_no,
          ans: selectedAnswer || "",
          mr: isMarkedForReview,
          saved: !!selectedAnswer,
          visited: true,
        };

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], ...newResponse };
          return updated;
        } else {
          return [...prev, newResponse];
        }
      });

      // Advance to next question on success
      if (currentQIndex < questions.length - 1) {
        questionStartTimeRef.current = Date.now();
        setCurrentQIndex(currentQIndex + 1);
      }
    } catch (err) {
      toast({ title: "Failed to save", description: "Could not save answer. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkForReview = () => {
    if (hasSubmittedRef.current) return;

    setExamResponses((prev) => {
      const existingIndex = prev.findIndex((res) => res.qId === currentQuestion.s_no);
      const selectedAnswer = selectedAnswers[currentQuestion.s_no];
      const newResponse: ExamResponse = {
        qId: currentQuestion.s_no,
        ans: selectedAnswer || prev[existingIndex]?.ans || "",
        mr: true,
        saved: !!selectedAnswer || !!prev[existingIndex]?.saved,
        visited: true,
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], mr: true };
        return updated;
      } else {
        return [...prev, newResponse];
      }
    });
  };

  const handleQuestionSelect = async (questionIndex: number) => {
    if (currentQIndex !== questionIndex && !hasSubmittedRef.current) {
      await handleNavigation(questionIndex);
    }
  };

  const handleAnswerSelect = (optionKey: string) => {
    if (hasSubmittedRef.current) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.s_no]: optionKey,
    }));
  };

  const handleBookmarkToggle = () => {
    if (hasSubmittedRef.current) return;

    setIsBookmarked((prev) => ({
      ...prev,
      [currentQuestion.s_no]: !prev[currentQuestion.s_no],
    }));
  };

  const getCurrentSelectedAnswer = () => {
    const tempAnswer = selectedAnswers[currentQuestion.s_no];
    if (tempAnswer) return tempAnswer;
    const savedResponse = examResponses.find((res) => res.qId === currentQuestion.s_no);
    return savedResponse?.ans || undefined;
  };

  return (
    <>
      <div className="absolute right-4 top-4 z-50 lg:hidden">
        <button
          onClick={handleLeaveExam}
          disabled={isSubmittingRef.current || isSaving}
          className="bg-red-600 text-white px-4 py-2 rounded shadow disabled:opacity-50"
        >
          Leave
        </button>
      </div>
      <Timer
        className="block lg:hidden"
        examTime={examTime}
        onTimeUp={handleTimeUp}
        onTimeUpdate={handleTimeUpdate}
      />
      <div className="w-[100%] mb-[100px] flex flex-row justify-between relative">
        <div className="gap-5 w-[100%] lg:max-w-[65%] max-w-[100%] mt-[3.2rem] lg:mt-0">
          <QuestionCard
            index={currentQIndex}
            total={questions.length}
            question={currentQuestion.question}
            difficulty={currentQuestion.difficulty}
            isBookmarked={isBookmarked[currentQuestion.s_no] || false}
            onBookmarkToggle={handleBookmarkToggle}
          />
          <OptionCard
            options={currentQuestion.options}
            questionId={currentQuestion.s_no}
            selected={getCurrentSelectedAnswer()}
            onSelect={handleAnswerSelect}
          />
        </div>
        <div className="w-[100%] max-w-[30%] hidden lg:block">
          <Timer examTime={examTime} onTimeUp={handleTimeUp} onTimeUpdate={handleTimeUpdate} />
          <div className="mt-4">
            <SubjectComponent
              questions={questions}
              currentQIndex={currentQIndex}
              examResponses={examResponses}
              onQuestionSelect={handleQuestionSelect}
            />
          </div>
        </div>
        <Footer
          onPrev={handlePrev}
          onNext={handleNext}
          onSubmitExam={handleSubmitExam}
          onSaveAndNext={handleSaveAndNext}
          onMarkForReview={handleMarkForReview}
          onLeaveExam={handleLeaveExam}
          disablePrev={currentQIndex === 0 || hasSubmittedRef.current || isSaving}
          disableNext={currentQIndex === questions.length - 1 || hasSubmittedRef.current || isSaving}
          isBusy={isSaving || isSubmittingRef.current}
        />
      </div>
    </>
  );
};

export default ExamPage;
