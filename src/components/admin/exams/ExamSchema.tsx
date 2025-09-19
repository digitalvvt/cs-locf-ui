import { z } from "zod"

const bloomLevels = ["Remembering", "Understanding", "Applying", "Analyzing", "Evaluating", "Creating"] as const

const difficultyTiers = ["Easy", "Medium", "Hard"] as const

const difficultyDistributionSchema = z.object({
  Easy: z.number().min(0).max(100),
  Medium: z.number().min(0).max(100),
  Hard: z.number().min(0).max(100),
})

export const examSchema = (isAdmin: boolean) =>
  z
    .object({
      name: z.string().min(1, "Exam name is required"),
      year: z.number().min(1, "Year is required"),
      semester: z.number().min(1, "Semester is required"),
      programme: z.number().min(1, "Programme is required"),
      course: z.number().min(1, "Course is required"),
      chapters: z.array(z.number()).min(1, "At least one chapter is required"),
      topics: z.array(z.number()).min(1, "At least one topic is required"),

      // ✅ numeric-only positive integers
      question_count: z
        .string()
        .regex(/^[1-9]\d*$/, "Question count must be a number"),

      duration: z
        .string()
        .regex(/^[1-9]\d*$/, "Exam time must be a number"),

      start_date: z.string().min(1, "Start time is required"),
      end_date: z.string().min(1, "End time is required"),
      test_mode: z.number().min(1, "Test mode is required"),

      // optional in shape; enforced below for non-admins
      section: z.string().optional(),

      // students selection
      studentsIds: z.array(z.number()).min(1, "Select at least one student"),

      // shift handling (required for admin only)
      shiftId: z.number().optional(),

      online_instructions: z.string().optional(),
      offline_instructions: z.string().optional(),

      bloomDistribution: z.record(z.number()).superRefine((data, ctx) => {
        const total = Object.values(data).reduce((sum, val) => sum + val, 0)
        if (total < 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Bloom's distribution values must be non-negative",
          })
        }
      }),

      difficultyDistribution: difficultyDistributionSchema,
    })
    .superRefine((data, ctx) => {
      // date check
      const start = Date.parse(data.start_date)
      const end = Date.parse(data.end_date)
      if (!isNaN(start) && !isNaN(end) && end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["end_date"],
          message: "End date must be after start date",
        })
      }

      // conditional section requirement
      if (!isAdmin) {
        if (!data.section || data.section.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["section"],
            message: "Section is required",
          })
        }
        // For faculty, shiftId will be injected externally; do not require here
      } else {
        // Admin must provide a shiftId
        if (typeof data.shiftId !== "number" || data.shiftId <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["shiftId"],
            message: "Shift is required",
          })
        }
      }

      const questionCount = Number.parseInt(data.question_count)
      if (!isNaN(questionCount)) {
        const bloomTotal = Object.values(data.bloomDistribution).reduce((sum, val) => sum + val, 0)
        if (bloomTotal !== questionCount) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["bloomDistribution"],
            message: `Bloom's distribution must total ${questionCount} questions`,
          })
        }
      }

      // difficulty distribution should sum to 100%
      const diffTotal =
        data.difficultyDistribution.Easy +
        data.difficultyDistribution.Medium +
        data.difficultyDistribution.Hard
      if (diffTotal !== 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["difficultyDistribution"],
          message: "Difficulty distribution must total 100%",
        })
      }
    })

// ✅ Type helper
export type ExamSchema = z.infer<ReturnType<typeof examSchema>>
