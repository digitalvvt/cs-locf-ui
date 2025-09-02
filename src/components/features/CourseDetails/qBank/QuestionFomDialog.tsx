import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { ISingleQuestion } from "@/api/api/question-bank-api";
import { FilterOption } from "./AIGeneratedQuestionsTable";
import MarkdownForBot from "@/components/MarkdownForBot";

interface QuestionFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  questionTypes: FilterOption[];
  difficulties: FilterOption[];
  bloomsLevels: FilterOption[];
  courseId?: string;
  question?: ISingleQuestion | null;
  courseOutcomes?: any[];
  onCreate?: (data: any) => void;
  onUpdate?: (data: any) => void;
  isCreating?: boolean;
  isUpdating?: boolean;
}

const QuestionFormDialog: React.FC<QuestionFormDialogProps> = ({
  isOpen,
  onOpenChange,
  courseId,
  question,
  courseOutcomes,
  onCreate,
  onUpdate,
  isCreating,
  isUpdating,
  questionTypes,
  difficulties,
  bloomsLevels,
}) => {
  const [formData, setFormData] = React.useState<any>({
    question_text: "",
    question_type: "MCQ",
    difficulty: 3,
    marks: 1,
    solution_text: "",
    answer_explanation: "",
    options: [
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
    ],
    course_outcome_ids: [],
  });

  const isEditing = !!question;
  const isSubmitting = isCreating || isUpdating;

  const updateOption = (
    index: number,
    field: "option_text" | "is_correct",
    value: string | boolean
  ) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = (e: React.FormEvent) => {};

  React.useEffect(() => {
    if (question) {
      setFormData({
        question_text: question.question,
        question_type: question.question_type.toString(),
        difficulty: question.difficulty,
        marks: 1,
        solution_text: "",
        answer_explanation: question.answer_desc,
        options: [
          {
            option_text: question.option_a,
            is_correct: question.correct_opt === "1",
          },
          {
            option_text: question.option_b,
            is_correct: question.correct_opt === "2",
          },
          {
            option_text: question.option_c,
            is_correct: question.correct_opt === "3",
          },
          {
            option_text: question.option_d,
            is_correct: question.correct_opt === "4",
          },
        ],
        course_outcome_ids: [question.co_id],
        cognitive_level: question.cognitive_level,
      });
    }
  }, [question]);

  React.useEffect(() => {
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 0);
  }, []);

  if (question === null) return;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {/* {isEditing ? "Edit Question" : "Create Question"} */}
              View Question
            </DialogTitle>
            <DialogDescription>
              Add assessment questions aligned with course outcomes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 pt-4">
            <Label htmlFor="course_outcomes" className="text-lg">
              Course Outcome:{" "}
              {courseOutcomes?.find((co) => co.id === question?.co_id)?.name || "N/A"}
            </Label>
          </div>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="question_text">Question Text</Label>
              {/* <Textarea
                id="question_text"
                value={question.question}
                rows={3}
                readOnly
                className="focus:outline-none focus:ring-0"
              /> */}
              <div className="border rounded-md p-2 bg-gray-50">
                <MarkdownForBot content={question.question} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="question_type">Question Type</Label>
                <Select
                  disabled
                  value={formData.question_type?.toString()}
                  onValueChange={(value) => setFormData({ ...formData, question_type: value })}
                >
                  <SelectTrigger tabIndex={-1}>
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  disabled
                  value={formData.difficulty?.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, difficulty: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff.id} value={diff.id.toString()}>
                        {diff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="blooms_level">Blooms Level</Label>
              <Select
                disabled
                value={formData.cognitive_level?.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, cognitive_level: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Bloom’s level" />
                </SelectTrigger>
                <SelectContent>
                  {bloomsLevels.map((bloom) => (
                    <SelectItem key={bloom.id} value={bloom.id.toString()}>
                      {bloom.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* MCQ Options */}
            <Label>Answer Options</Label>

            {/* <div className="flex items-center gap-2 mb-2">
              <Checkbox checked={question.correct_opt === "1"} disabled />
              <Input readOnly value={question.option_a} placeholder="Option A" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Checkbox checked={question.correct_opt === "2"} disabled />
              <Input readOnly value={question.option_b} placeholder="Option B" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Checkbox checked={question.correct_opt === "3"} disabled />
              <Input readOnly value={question.option_c} placeholder="Option C" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Checkbox checked={question.correct_opt === "4"} disabled />
              <Input readOnly value={question.option_d} placeholder="Option D" />
            </div> */}
            <div className="flex items-start gap-2 mb-2">
              <Checkbox checked={question.correct_opt === "1"} disabled />
              <div className="flex-1 border rounded-md p-2 bg-gray-50 text-sm">
                <MarkdownForBot content={question.option_a} />
              </div>
            </div>

            <div className="flex items-start gap-2 mb-2">
              <Checkbox checked={question.correct_opt === "2"} disabled />
              <div className="flex-1 border rounded-md p-2 bg-gray-50 text-sm">
                <MarkdownForBot content={question.option_b} />
              </div>
            </div>

            <div className="flex items-start gap-2 mb-2">
              <Checkbox checked={question.correct_opt === "3"} disabled />
              <div className="flex-1 border rounded-md p-2 bg-gray-50 text-sm">
                <MarkdownForBot content={question.option_c} />
              </div>
            </div>

            <div className="flex items-start gap-2 mb-2">
              <Checkbox checked={question.correct_opt === "4"} disabled />
              <div className="flex-1 border rounded-md p-2 bg-gray-50 text-sm">
                <MarkdownForBot content={question.option_d} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="answer_explanation">Answer Explanation (Optional)</Label>
              {/* <Textarea
                id="answer_explanation"
                value={question.answer_desc}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    answer_explanation: e.target.value,
                  })
                }
                rows={2}
                readOnly
              /> */}
              <div className="border rounded-md p-3 bg-gray-50 text-sm">
                <MarkdownForBot content={question.answer_desc} />
              </div>
            </div>
          </div>
          {/* <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {isEditing ? "Update Question" : "Create Question"}
            </Button>
          </DialogFooter> */}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionFormDialog;
