import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterOption } from "./AIGeneratedQuestionsTable";

interface QuestionFiltersProps {
  filters: {
    type: string;
    difficulty: string;
    co: string;
    bloom: string;
  };
  onFiltersChange: (
    key: keyof QuestionFiltersProps["filters"],
    value: string
  ) => void;
  questionTypes: FilterOption[];
  difficulties: FilterOption[];
  bloomsLevels: FilterOption[];
  coLevels: FilterOption[];
}

const QuestionFilters: React.FC<QuestionFiltersProps> = ({
  filters,
  onFiltersChange,
  questionTypes,
  difficulties,
  bloomsLevels,
  coLevels,
}) => {
  return (
    <div className="flex gap-4 items-end mb-3 flex-wrap">
      {/* Question Type */}
      <div>
        <Label>Question Type</Label>
        <Select
          value={filters.type}
          onValueChange={(value) => onFiltersChange("type", value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All">
              {questionTypes.find((item) => String(item.id) === filters.type)
                ?.name || "All"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {questionTypes.map((type) => (
              <SelectItem key={type.id} value={String(type.id)}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Difficulty */}
      <div>
        <Label>Difficulty</Label>
        <Select
          value={filters.difficulty}
          onValueChange={(value) => onFiltersChange("difficulty", value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All">
              {difficulties.find(
                (item) => String(item.id) === filters.difficulty
              )?.name || "All"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {difficulties.map((d) => (
              <SelectItem key={d.id} value={String(d.id)}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bloom's Level */}
      <div>
        <Label>Bloom's Level</Label>
        <Select
          value={filters.bloom}
          onValueChange={(value) => onFiltersChange("bloom", value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All">
              {bloomsLevels.find((item) => String(item.id) === filters.bloom)
                ?.name || "All"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {bloomsLevels.map((b) => (
              <SelectItem key={b.id} value={String(b.id)}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Course Outcome */}
      <div>
        <Label>Course Outcome</Label>
        <Select
          value={filters.co}
          onValueChange={(value) => onFiltersChange("co", value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All">
              {coLevels.find((item) => String(item.id) === filters.co)?.name ||
                "All"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {coLevels.map((co) => (
              <SelectItem key={co.id} value={String(co.id)}>
                {co.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default QuestionFilters;
