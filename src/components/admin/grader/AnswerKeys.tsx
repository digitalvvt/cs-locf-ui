"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useGetAnswerSheetByIdQuery } from "@/api/api/admin/question-paper"
import { useParams } from "react-router-dom"
import { AlertCircle } from "lucide-react"
import * as React from "react"
import MarkdownQABot from "@/components/AnswerSheetMarkDown" // ⬅️ adjust path if needed
import { useGetAnswerSheetResultsByStudentIdAndQuestionIdQuery } from "@/api/api/admin/question-paper"

interface AnswerKey {
  id: string | number
  questionNumber: number
  maxMarks: number
  marksAwarded?: number
  questionText: string
  expectedAnswer: string
  studentAnswer?: string
  keyPoints: string[]
  markingScheme: string
  optionA?: string
  optionB?: string
  optionC?: string
  optionD?: string
}

interface ServerAnswerKey {
  id: number
  question_number: number
  max_marks: number
  marks_awarded?: number | null
  question: string
  expected_answer: string
  student_answer?: string | null
  key_points?: string[] | string | null
  marking_scheme?: string | null
  option_a?: string | null
  option_b?: string | null
  option_c?: string | null
  option_d?: string | null
}

interface AnswerSheetProps {
  answerKeys?: AnswerKey[]
  student?: boolean
}

function normalizeKeyPoints(kp: ServerAnswerKey["key_points"]): string[] {
  if (!kp) return []
  if (Array.isArray(kp)) return kp.filter(Boolean)
  return kp
    .split(/\r?\n|•|- |\u2022/g)
    .map((s) => s.trim())
    .filter(Boolean)
}

function mapServerToClient(s: ServerAnswerKey): AnswerKey {
  return {
    id: s.id,
    questionNumber: s.question_number,
    maxMarks: s.max_marks,
    marksAwarded: s.marks_awarded ?? undefined,
    questionText: s.question,
    expectedAnswer: s.expected_answer,
    studentAnswer: s.student_answer ?? undefined,
    keyPoints: normalizeKeyPoints(s.key_points),
    markingScheme: s.marking_scheme ?? "",
    optionA: s.option_a ?? undefined,
    optionB: s.option_b ?? undefined,
    optionC: s.option_c ?? undefined,
    optionD: s.option_d ?? undefined,
  }
}

export function AnswerSheet({ answerKeys = [], student = false }: AnswerSheetProps) {
  const params = useParams()
  const qpIdParam = student ? params.qpId : params.id
  const studentIdParam = student ? params.studentId : undefined

  const { data, isLoading, error, refetch } = useGetAnswerSheetByIdQuery(
    { id: Number(qpIdParam) },
    { skip: !qpIdParam || !!student }
  )

  const { data: studentData } = useGetAnswerSheetResultsByStudentIdAndQuestionIdQuery(
    { studentId: Number(studentIdParam), questionId: Number(qpIdParam) },
    { skip: !student || !studentIdParam || !qpIdParam }
  ) as any

  const apiItems: ServerAnswerKey[] = React.useMemo(() => {
    if (student) {
      // Expecting array of items with student-specific fields; fallback to []
      return Array.isArray(studentData) ? (studentData as ServerAnswerKey[]) : []
    }
    if (!data) return []
    return Array.isArray(data) ? (data as ServerAnswerKey[]) : [data as ServerAnswerKey]
  }, [student, studentData, data])

  const items: AnswerKey[] = apiItems.length ? apiItems.map(mapServerToClient) : answerKeys

  const chipClasses = [
    "bg-blue-50 text-blue-700 border border-blue-200",
    "bg-green-50 text-green-700 border border-green-200",
    "bg-amber-50 text-amber-800 border border-amber-200",
    "bg-purple-50 text-purple-700 border border-purple-200",
    "bg-rose-50 text-rose-700 border border-rose-200",
    "bg-teal-50 text-teal-700 border border-teal-200",
  ]

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-medium">◉</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Answer Keys</h1>
        </div>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          Define the expected answers and marking scheme for each question
        </p>
      </div>

      {/* States */}
      {isLoading && (
        <div className="w-full flex items-center justify-center py-10">
          <div className="animate-pulse text-sm text-muted-foreground">Loading answer sheet…</div>
        </div>
      )}

      {!isLoading && error && (
        <div className="w-full flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-md border p-4 text-red-700 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <span>Couldn’t load answers. Please try again.</span>
            <Button variant="outline" className="ml-2" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="w-full flex items-center justify-center py-10">
          <div className="text-sm text-muted-foreground">No answers available.</div>
        </div>
      )}

      {/* Answer Keys List */}
      {!isLoading && !error && items.length > 0 && (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-1">
          {items.map((answerKey) => (
            <Card key={answerKey.id} className="w-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Question {answerKey.questionNumber}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {/* {student && (
                      <Badge variant="secondary" className="text-sm">Marks awarded: {typeof answerKey.marksAwarded !== 'undefined' ? answerKey.marksAwarded : '-'}</Badge>
                    )} */}
                    <Badge variant="secondary" className="text-sm">Max: {answerKey.maxMarks} marks</Badge>
                    {/* {student && (
                      <Badge variant="secondary" className="text-sm">Obtained: {typeof answerKey.marksAwarded !== 'undefined' ? answerKey.marksAwarded : '-'}</Badge>
                    )} */}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Question Number</div>
                    <div className="p-3 bg-muted rounded-md text-sm font-medium">
                      {answerKey.questionNumber}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Max Marks</div>
                    <div className="p-3 bg-muted rounded-md text-sm font-medium">
                      {answerKey.maxMarks}
                    </div>
                  </div>

                  {student && <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Obtained Marks</div>
                    <div className="p-3 bg-muted rounded-md text-sm font-medium">
                      {answerKey.marksAwarded}
                    </div>
                  </div>}
                </div>

                <Separator />

                {/* ⬇️ Markdown bot rendering for Question + Expected Answer */}
                <MarkdownQABot
                  question={answerKey.questionText}
                  expectedAnswer={answerKey.expectedAnswer}
                  studentAnswer={student ? answerKey.studentAnswer : undefined}
                  options={[
                    ...(answerKey.optionA ? [{ label: 'A', content: answerKey.optionA }] : []),
                    ...(answerKey.optionB ? [{ label: 'B', content: answerKey.optionB }] : []),
                    ...(answerKey.optionC ? [{ label: 'C', content: answerKey.optionC }] : []),
                    ...(answerKey.optionD ? [{ label: 'D', content: answerKey.optionD }] : []),
                  ]}
                />

                {!student && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-muted-foreground">Key Points</div>
                    {answerKey.keyPoints.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {answerKey.keyPoints.map((point, idx) => {
                          const classes = chipClasses[idx % chipClasses.length]
                          return (
                            <span
                              key={idx}
                              className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-medium ${classes}`}
                              title={point}
                            >
                              {point}
                            </span>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">No key points provided.</div>
                    )}
                  </div>
                )}

                {!student && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Marking Scheme</div>
                    <div className="p-4 bg-muted rounded-md text-sm leading-relaxed whitespace-pre-line">
                      {answerKey.markingScheme || "—"}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
