import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, RotateCcw, FileText, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface SyllabusCardProps {
  fileName: string;
  uploadedDate: string; // ISO format date
  status: "success" | "pending" | "fail";
  courseOutcomeCount: number;
  onReprocess: () => void;
  onReview: () => void;
  fileId: number;
}

export function SyllabusCard({
  fileName,
  uploadedDate,
  status,
  courseOutcomeCount,
  onReprocess,
  onReview,
  fileId,
}: SyllabusCardProps) {
  const navigate = useNavigate();
  const statusMap = {
    success: {
      message: "AI Processing Complete",
      color: "text-green-600 bg-green-100 border-green-300",
      icon: CheckCircle,
    },
    pending: {
      message: "Processing Pending",
      color: "text-yellow-600 bg-yellow-100 border-yellow-300",
      icon: Clock,
    },
    fail: {
      message: "Processing Failed",
      color: "text-red-600 bg-red-100 border-red-300",
      icon: XCircle,
    },
  };

  const statusMeta = statusMap[status] ?? {
    message: "Unknown Status",
    color: "text-gray-600 bg-gray-100 border-gray-300",
    icon: XCircle,
  };
  const { message, color, icon: StatusIcon } = statusMeta;
  const handleReviewClick = (fileId: number) => {
    navigate(`/program-outcomes/extracted-syllabus/${fileId}`);
  };

  return (
    <div className="border rounded-xl p-4 flex justify-between items-start shadow-sm mt-10">
      <div className="space-y-1">
        <div className="flex items-center gap-2 font-medium text-lg">
          <FileText className="w-4 h-4 text-gray-500" />
          <span>
            {fileName} ({format(new Date(uploadedDate), "M/d/yyyy")})
          </span>
        </div>

        <div className="flex items-center gap-1 text-sm mt-1">
          <StatusIcon className={`w-4 h-4 ${color}`} />
          <span>{message}</span>
        </div>

        <p className="text-muted-foreground text-sm">
          Found {courseOutcomeCount} course outcome(s)
        </p>

        {(status === "success" || status === "fail") && (
          <div className="flex gap-2 mt-2">
            {status === "success" && (
              <Button size="sm" onClick={() => handleReviewClick(fileId)}>
                Review Extracted Data
              </Button>
            )}
          </div>
        )}
      </div>

      <Badge variant="secondary" className={`ml-auto ${color}`}>
        <StatusIcon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    </div>
  );
}
