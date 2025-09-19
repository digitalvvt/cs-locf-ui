"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Upload, FileText, Clock, Calendar } from "lucide-react"
import { useNavigate } from "react-router-dom"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import SelectDropdown from "@/components/Common/SelectDropdown"
import { GenericType } from "@/types"
import { useUploadQuestionPaperMutation, useUploadAnswerSheetsMutation, useGetAnswerSheetResultsByQuestionIdQuery, type QuestionPaperUploadPayload } from "@/api/api/admin/question-paper"
import AnswerSheetTable from './AnswerSheetTable'
import { useToast } from "@/hooks/use-toast"
import { v4 as uuidv4 } from "uuid"

// Zod validation schema
const examFormSchema = z.object({
  examTitle: z
    .string()
    .min(1, "Exam title is required")
    .max(100, "Exam title must be less than 100 characters"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(50, "Subject must be less than 50 characters"),
  class: z
    .string()
    .min(1, "Class is required")
    .max(20, "Class must be less than 20 characters"),
  gradeLevel: z
    .object({ id: z.number(), name: z.string() })
    .nullable()
    .refine((val) => val !== null, { message: "Grade level is required" }),
  examDate: z.string().min(1, "Exam date is required"),
  duration: z
    .string()
    .min(1, "Duration is required")
    .regex(/^\d+$/, "Duration must be a numeric value"),
  description: z.string().optional(),
  file: z.any().optional(),
})

type ExamFormValues = z.infer<typeof examFormSchema>

// Mock data for edit mode
const mockExamData: ExamFormValues = {
  examTitle: "Mid-term Mathematics Exam",
  subject: "Mathematics",
  class: "10th Grade",
  gradeLevel: { id: 1, name: "Elementry" },
  examDate: "2024-03-15T10:00",
  duration: "120",
  description: "This is a comprehensive mathematics exam covering algebra, geometry, and trigonometry topics.",
}

const gradeOptions: GenericType[] = [
  { id: 1, name: "Elementry" },
  { id: 2, name: "Middle School" },
  { id: 3, name: "High School" },
  { id: 4, name: "College" },
]

const difficultyOptions: GenericType[] = [
  { id: 1, name: "EASY" },
  { id: 2, name: "MEDIUM" },
  { id: 3, name: "HARD" },
]

interface ExamFormProps {
  type: "create" | "edit"
  onSubmit?: (data: ExamFormValues) => void
  initialData?: any
  loadingInitial?: boolean
}

export function CreateQuestionUploadForm({ type, onSubmit, initialData, loadingInitial }: ExamFormProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [uploadQuestionPaper, { isLoading: isUploadingQuestion }] = useUploadQuestionPaperMutation()
  const [uploadAnswerSheets, { isLoading: isUploadingAnswers }] = useUploadAnswerSheetsMutation()
  const [difficulty, setDifficulty] = React.useState<GenericType | null>(null)
  const questionId = initialData?.id as number | undefined
  const navigate = useNavigate()
  const { data: answerRows, isLoading: isLoadingAnswers, isFetching: isFetchingAnswers, error: errorAnswers, refetch: refetchAnswers } = useGetAnswerSheetResultsByQuestionIdQuery(
    { questionId: questionId as number },
    { skip: !(type === 'edit' && questionId) }
  ) as any

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues:
      type === "edit"
        ? mockExamData
        : {
            examTitle: "",
            subject: "",
            class: "",
            gradeLevel: null,
            examDate: "",
            duration: "60",
            description: "",
          },
  })

  React.useEffect(() => {
    if (type === 'edit' && initialData) {
      const mapped: ExamFormValues = {
        examTitle: initialData.examTitle ?? initialData.ExamTitle ?? "",
        subject: initialData.subject ?? initialData.Subject ?? "",
        class: initialData.className ?? initialData.Class ?? "",
        gradeLevel: initialData.gradeLevel
          ? gradeOptions.find(g => g.name === initialData.gradeLevel) || null
          : null,
        examDate: initialData.examDate ?? initialData.ExamDate ?? "",
        duration: String(initialData.durationMinutes ?? initialData.Duration ?? ""),
        description: initialData.description ?? initialData.Description ?? "",
      }
      form.reset(mapped)
    }
  }, [type, initialData])

  const handleSubmit = async (data: ExamFormValues) => {
    try {
      const isEditMode = isEdit
      const fileInput = fileInputRef.current
      const files = fileInput?.files
      if (!files || files.length === 0) {
        toast({ title: "No file selected", description: isEditMode ? "Please choose one or more PDF files." : "Please choose a PDF file to upload.", variant: "destructive" })
        return
      }

      // Build payloads and FormData
      const formData = new FormData()
      const debugForm = new FormData()

      if (isEditMode) {
        if (!difficulty) {
          toast({ title: "Select difficulty", description: "Please choose EASY, MEDIUM, or HARD.", variant: "destructive" })
          return
        }
        if (!initialData?.id) {
          toast({ title: "Missing question ID", description: "Cannot upload answer sheets without questionId.", variant: "destructive" })
          return
        }
        Array.from(files).forEach((f) => {
          formData.append("file", f)
          debugForm.append("file", f)
        })
        formData.append("questionId", String(initialData.id))
        debugForm.append("questionId", String(initialData.id))
        formData.append("aiDifficulty", difficulty.name)
        debugForm.append("aiDifficulty", difficulty.name)
      } else {
        // Question paper create: include metadata and single file
        const payload: QuestionPaperUploadPayload = {
          ExamTitle: data.examTitle,
          Subject: data.subject,
          Class: data.class,
          ExamDate: data.examDate,
          Duration: Number(data.duration || 0),
          GradeLevel: data.gradeLevel?.name || "",
          Description: data.description || "",
          uuid: uuidv4(),
        }
        formData.append("file", files[0])
        debugForm.append("file", files[0])
        Object.entries(payload).forEach(([k, v]) => {
          formData.append(k, String(v ?? ""))
          debugForm.append(k, String(v ?? ""))
        })
      }

      Array.from(formData.entries()).forEach(([k, v]) =>
        console.log(
          k,
          v instanceof File ? `[File] ${v.name} (${v.type}, ${v.size}B)` : v
        )
      )

      const res = isEditMode
        ? await uploadAnswerSheets(formData).unwrap()
        : await uploadQuestionPaper(formData).unwrap()

      toast({
        title: `${isEditMode ? "Answer sheets" : "Question paper"} uploaded`,
        description: `Upload successful${res?.name ? `: ${res.name}` : ""}.`,
      })

      onSubmit?.(data)
      // Optionally clear file after success
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""

      if (isEditMode) {
        refetchAnswers()
      } else {
        navigate('/admin/grader')
      }
    } catch (err: any) {
      toast({ title: "Upload failed", description: err?.data?.message || err?.message || "Please try again.", variant: "destructive" })
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setSelectedFile(file)
    } else {
      alert("Please select a PDF file")
      event.target.value = ""
    }
  }

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type === "application/pdf") {
      setSelectedFile(file)
    } else {
      alert("Please select a PDF file")
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const isEdit = type === "edit"
  const uploadTitle = isEdit ? "Answer Sheet" : "Question Paper"
  const uploadDescription = isEdit
    ? "Upload a PDF of the answer sheet to auto-generate answer keys"
    : "Upload a PDF of the question paper to auto-generate answer keys"
  const submitLabel = isEdit ? "Upload Answer Sheets" : "Upload Question Paper"

  return (
    <div className=" mx-auto space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Exam Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Exam Details
              </CardTitle>
              <CardDescription>
                {loadingInitial ? 'Loading details...' : 'Basic information about the exam'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="examTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mid-term Mathematics Exam" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mathematics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 10th Grade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gradeLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade Level</FormLabel>
                      <SelectDropdown
                        options={gradeOptions}
                        value={field.value as GenericType | null}
                        onChange={(option) => field.onChange(option)}
                        placeholder="Select grade level"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="examDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="datetime-local"
                            id="examDate"
                            {...field}
                            onClick={(e) => e.currentTarget.showPicker()}
                            className={`h-11 w-full rounded-sm border-border text-sm pr-10 ${field.value ? "text-black" : "text-[#4B4B4B]"} [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-clear-button]:hidden [&::-webkit-inner-spin-button]:hidden`}
                            placeholder="Select date and time"
                            value={field.value || ""}
                          />
                          <label
                            htmlFor="examDate"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
                            aria-label="Open date & time picker"
                          >
                            <Calendar className="h-5 w-5 pointer-events-none" />
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 mb-4 mt-1">
                        <Clock className="h-4 w-4" />
                        Duration (minutes)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="120"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.replace(/[^0-9]/g, ""))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional details about the exam..."
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {uploadTitle}
              </CardTitle>
              <CardDescription>{uploadDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
              >
                <div className="flex flex-col items-center gap-4">
                  {isEdit && (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      <div>
                        <FormLabel>Difficulty</FormLabel>
                        <div className="mt-2">
                          <SelectDropdown
                            options={difficultyOptions}
                            value={difficulty}
                            onChange={(opt) => setDifficulty(opt as GenericType)}
                            placeholder="Select difficulty"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-4 bg-muted rounded-full">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>

                  {selectedFile ? (
                    <div className="text-center">
                      <p className="font-medium text-foreground">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="font-medium text-foreground mb-1">Upload {uploadTitle}</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop a PDF file here, or click to browse
                      </p>
                    </div>
                  )}

                  <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" multiple={type === "edit" ? true : false} onChange={handleFileSelect} className="hidden" />

                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    Choose File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" color={"primary"} variant="default" className="min-w-[160px]" disabled={isUploadingQuestion || isUploadingAnswers || (isEdit && (!initialData?.id || !difficulty))}>
              {isUploadingQuestion || isUploadingAnswers ? "Uploading..." : submitLabel}
            </Button>
          </div>
        </form>
      </Form>
      {isEdit && (
        <AnswerSheetTable
          rows={answerRows}
          isLoading={isLoadingAnswers}
          isFetching={isFetchingAnswers}
          error={errorAnswers}
          onRetry={() => refetchAnswers()}
          questionId={questionId}
        />)
      }
    </div>
  )
}
