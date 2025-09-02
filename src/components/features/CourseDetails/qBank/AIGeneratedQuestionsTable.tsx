// ✅ Updated QuestionsTable.tsx with cascading filters
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import QuestionFilters from "./QuestionFilters";
import { Question } from "./index";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MarkdownForBot from "@/components/MarkdownForBot";
import MarkDown from "@/components/ui/MarkDown";
import MarkdownWithLatex from "@/components/MarkDownLatex";

export interface FilterOption {
  id: number;
  name: string;
}

const QuestionsTable = ({
  questions,
  onEditQuestion,
  questionTypes,
  difficulties,
  bloomsLevels,
  coLevels,
}: {
  questions: Question[];
  onEditQuestion: (id: number) => void;
  questionTypes: FilterOption[];
  difficulties: FilterOption[];
  bloomsLevels: FilterOption[];
  coLevels: FilterOption[];
}) => {
  const [filteredData, setFilteredData] = useState<Question[]>([]);
  const [filters, setFilters] = useState({
    type: "0",
    difficulty: "0",
    bloom: "0",
    co: "0",
  });

  const handleCascadingFilterChange = (key: keyof typeof filters, value: string) => {
    const resetFilters = { ...filters };
    const keys = Object.keys(filters);
    const index = keys.indexOf(key);
    keys.slice(index).forEach((k, i) => {
      resetFilters[k as keyof typeof filters] = i === 0 ? value : "0";
    });
    setFilters(resetFilters);
  };

  useEffect(() => {
    let filtered = [...(questions || [])];

    if (filters.type !== "0") {
      filtered = filtered.filter((q) => String(q.question_type.s_no) === filters.type);
    }
    if (filters.difficulty !== "0") {
      filtered = filtered.filter((q) => String(q.difficulty) === filters.difficulty);
    }
    if (filters.bloom !== "0") {
      filtered = filtered.filter((q) => String(q.cognitive_level.s_no) === filters.bloom);
    }
    if (filters.co !== "0") {
      filtered = filtered.filter((q) => String(q.co_outcome.id) === filters.co);
    }

    setFilteredData(filtered);
  }, [filters, questions]);

  const getBloomLevel = (number: number) => {
    switch (number) {
      case 1:
        return "Remembering";
      case 2:
        return "Understanding";
      case 3:
        return "Application";
      case 4:
        return "Analyzing";
      case 5:
        return "Evaluating";
      case 6:
        return "Creating";
      default:
        return "Invalid";
    }
  };

  const getDifficultyLevel = (number: number) => {
    switch (number) {
      case 1:
        return "Easy";
      case 2:
        return "Medium";
      case 3:
        return "Hard";
      default:
        return "N/A";
    }
  };

  return (
    <>
      <QuestionFilters
        questionTypes={questionTypes}
        difficulties={difficulties}
        bloomsLevels={bloomsLevels}
        coLevels={coLevels}
        filters={filters}
        onFiltersChange={handleCascadingFilterChange}
      />

      <ScrollArea className="w-full h-[835px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sl. No</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Bloom</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>CO</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((q, index) => (
                <TableRow key={q.s_no}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {" "}
                    <MarkdownForBot content={q.question} />
                    {/* <MarkdownWithLatex content={q.question} /> */}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{q.question_type.question_type}</Badge>
                  </TableCell>
                  <TableCell>{getDifficultyLevel(q.difficulty)}</TableCell>
                  <TableCell>{getBloomLevel(q.cognitive_level.s_no)}</TableCell>
                  <TableCell>{q.estimated_time} mins</TableCell>
                  <TableCell>{q.co_outcome.co_number}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onEditQuestion(q.s_no)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-full py-8 text-gray-500">
                  No questions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
};

export default QuestionsTable;
