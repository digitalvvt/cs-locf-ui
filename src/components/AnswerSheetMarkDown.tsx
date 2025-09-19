"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
// ⬇️ Adjust this import path to wherever your MarkdownForBot is located
import MarkdownForBot from "@/components/MarkdownForBot"
import { MessageSquare, CheckCircle2 } from "lucide-react"

interface MarkdownQABotProps {
  question: string
  expectedAnswer?: string
  className?: string
  showTitles?: boolean
  options?: { label: string; content: string }[]
  studentAnswer?: string
}

export default function MarkdownQABot({
  question,
  expectedAnswer,
  className,
  showTitles = true,
  options = [],
  studentAnswer,
}: MarkdownQABotProps) {
  const normalizedOptions = Array.isArray(options) ? options : []
  const shouldRenderOptions =
    normalizedOptions.length > 0 &&
    !normalizedOptions.some((opt) => String(opt?.content ?? "").trim().toUpperCase() === "NOT PROVIDED")
  return (
    <div className={cn("space-y-4", className)}>
      <section>
        {showTitles && (
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>Question</span>
          </div>
        )}
        <div className="rounded-md border bg-muted/60 p-3">
          <MarkdownForBot content={question ?? ""} />
        </div>
      </section>

      {shouldRenderOptions && (
        <section>
          {showTitles && (
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span>Options</span>
            </div>
          )}
          <div className="rounded-md border bg-muted/60 p-3 space-y-2">
            {options.map((opt) => (
              <div key={opt.label} className="flex items-start gap-2">
                <div className="text-sm font-semibold w-5 shrink-0">{opt.label}.</div>
                <div className="flex-1">
                  <MarkdownForBot content={opt.content ?? ""} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {studentAnswer != null && studentAnswer !== "" && (
        <section>
          {showTitles && (
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span>Student Answer</span>
            </div>
          )}
          <div className="rounded-md border bg-muted/60 p-3">
            <MarkdownForBot content={studentAnswer} />
          </div>
        </section>
      )}

      <section>
        {showTitles && (
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <span>Expected Answer</span>
          </div>
        )}
        <div className="rounded-md border bg-muted/60 p-3">
          <MarkdownForBot content={expectedAnswer ?? "—"} />
        </div>
      </section>
    </div>
  )
}
