import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";

interface QualityMetrics {
  clarity: number;
  relevance: number;
  bloom_alignment: number;
  difficulty_match: number;
  indian_context: number;
  overall: number;
}

interface QuestionQualityIndicatorProps {
  questionText: string;
  questionType: string;
  difficulty: number;
  bloomLevel?: string;
  hasExplanation?: boolean;
  compact?: boolean;
}

const QuestionQualityIndicator: React.FC<QuestionQualityIndicatorProps> = ({
  questionText,
  questionType,
  difficulty,
  bloomLevel,
  hasExplanation = false,
  compact = false,
}) => {
  const qualityMetrics = React.useMemo(() => {
    return calculateQualityMetrics(
      questionText,
      questionType,
      difficulty,
      bloomLevel,
      hasExplanation
    );
  }, [questionText, questionType, difficulty, bloomLevel, hasExplanation]);

  const getQualityColor = (score: number) => {
    if (score >= 0.8) return "text-green-600 bg-green-50";
    if (score >= 0.6) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const getQualityIcon = (score: number) => {
    if (score >= 0.8) return <CheckCircle className="h-4 w-4" />;
    if (score >= 0.6) return <AlertCircle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge className={getQualityColor(qualityMetrics.overall)}>
              {getQualityIcon(qualityMetrics.overall)}
              <span className="ml-1">
                {Math.round(qualityMetrics.overall * 100)}%
              </span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p className="font-medium">Quality Breakdown:</p>
              <p>Clarity: {Math.round(qualityMetrics.clarity * 100)}%</p>
              <p>Relevance: {Math.round(qualityMetrics.relevance * 100)}%</p>
              <p>
                Bloom Alignment:{" "}
                {Math.round(qualityMetrics.bloom_alignment * 100)}%
              </p>
              <p>
                Difficulty Match:{" "}
                {Math.round(qualityMetrics.difficulty_match * 100)}%
              </p>
              <p>
                Indian Context:{" "}
                {Math.round(qualityMetrics.indian_context * 100)}%
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Question Quality Score</h4>
            <Badge className={getQualityColor(qualityMetrics.overall)}>
              {Math.round(qualityMetrics.overall * 100)}%
            </Badge>
          </div>

          <div className="space-y-2">
            {Object.entries(qualityMetrics).map(([metric, score]) => {
              if (metric === "overall") return null;

              return (
                <div
                  key={metric}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="capitalize">{metric.replace("_", " ")}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          score >= 0.8
                            ? "bg-green-500"
                            : score >= 0.6
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${score * 100}%` }}
                      />
                    </div>
                    <span className="text-xs w-8 text-right">
                      {Math.round(score * 100)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {qualityMetrics.overall < 0.7 && (
            <div className="mt-3 p-2 bg-amber-50 rounded-md">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-xs text-amber-800">
                  <p className="font-medium">Suggestions for improvement:</p>
                  <ul className="mt-1 space-y-1">
                    {qualityMetrics.clarity < 0.7 && (
                      <li>• Improve question clarity and remove vague terms</li>
                    )}
                    {qualityMetrics.relevance < 0.7 && (
                      <li>• Add more business/commerce context</li>
                    )}
                    {qualityMetrics.bloom_alignment < 0.7 && (
                      <li>• Align with appropriate Bloom's taxonomy level</li>
                    )}
                    {qualityMetrics.indian_context < 0.7 && (
                      <li>• Include Indian business examples</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

function calculateQualityMetrics(
  questionText: string,
  questionType: string,
  difficulty: number,
  bloomLevel?: string,
  hasExplanation?: boolean
): QualityMetrics {
  const text = questionText.toLowerCase();

  // Clarity assessment
  let clarity = 1.0;
  const vagueTerms = ["some", "many", "few", "several", "various"];
  if (vagueTerms.some((term) => text.includes(term))) clarity -= 0.2;
  if (questionText.length < 20) clarity -= 0.3;
  if (questionText.length > 500) clarity -= 0.2;
  clarity = Math.max(0, clarity);

  // Relevance assessment
  let relevance = 0.6;
  const businessTerms = [
    "business",
    "commerce",
    "trade",
    "market",
    "financial",
    "accounting",
    "management",
  ];
  const foundTerms = businessTerms.filter((term) => text.includes(term));
  if (foundTerms.length === 0) relevance -= 0.3;
  else if (foundTerms.length >= 2) relevance += 0.3;
  relevance = Math.min(1.0, Math.max(0, relevance));

  // Bloom alignment (simplified)
  let bloom_alignment = 0.7;
  if (bloomLevel) {
    const bloomKeywords = {
      remember: ["define", "list", "recall", "identify"],
      understand: ["explain", "summarize", "interpret"],
      apply: ["apply", "demonstrate", "solve", "use"],
      analyze: ["analyze", "examine", "compare"],
      evaluate: ["evaluate", "assess", "judge"],
      create: ["create", "design", "develop"],
    };

    const levelKeywords = bloomKeywords[bloomLevel.toLowerCase()] || [];
    if (levelKeywords.some((keyword) => text.includes(keyword))) {
      bloom_alignment = 0.9;
    }
  }

  // Difficulty match (simplified)
  let difficulty_match = 0.8;
  if (questionType === "MCQ" && difficulty > 4) difficulty_match -= 0.2;
  if (questionType === "essay" && difficulty < 3) difficulty_match -= 0.2;

  // Indian context
  let indian_context = 0.5;
  const indianTerms = [
    "indian",
    "india",
    "rupee",
    "gst",
    "companies act",
    "mumbai",
    "delhi",
  ];
  if (indianTerms.some((term) => text.includes(term))) indian_context += 0.4;
  if (text.includes("case study") || text.includes("example"))
    indian_context += 0.1;
  indian_context = Math.min(1.0, indian_context);

  // Bonus for explanation
  if (hasExplanation) {
    clarity += 0.1;
    relevance += 0.1;
  }

  const overall =
    (clarity +
      relevance +
      bloom_alignment +
      difficulty_match +
      indian_context) /
    5;

  return {
    clarity: Math.min(1.0, clarity),
    relevance: Math.min(1.0, relevance),
    bloom_alignment: Math.min(1.0, bloom_alignment),
    difficulty_match: Math.min(1.0, difficulty_match),
    indian_context: Math.min(1.0, indian_context),
    overall: Math.min(1.0, overall),
  };
}

export default QuestionQualityIndicator;
