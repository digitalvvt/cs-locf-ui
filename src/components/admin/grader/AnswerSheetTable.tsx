import React from 'react';
import { AlertCircle, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export type AnswerRow = {
  rollNo?: string;
  roll_number?: string;
  rollNumber?: string;
  name?: string;
  studentName?: string;
  totalMark?: number;
  totalMarks?: number;
  total?: number;
  maxMarks?: number;
  marksObtained?: number;
  obtained?: number;
  score?: number;
  confidenceLevel?: number;
  confidence?: number;
  studentId?: number;
  qpId?: number;
};

interface AnswerSheetTableProps {
  rows: AnswerRow[] | undefined;
  isLoading?: boolean;
  isFetching?: boolean;
  error?: any;
  onRetry?: () => void;
  questionId?: number;
}

const AnswerSheetTable: React.FC<AnswerSheetTableProps> = ({ rows, isLoading, isFetching, error, onRetry, questionId }) => {
  const navigate = useNavigate();
  const normalizedRows: AnswerRow[] = Array.isArray(rows) ? rows : rows ? [rows] : [];

  const getRoll = (r: AnswerRow) => r.rollNo || r.roll_number || r.rollNumber || '';
  const getName = (r: AnswerRow) => r.name || r.studentName || '';
  const getTotal = (r: AnswerRow) => r.totalMarks ?? r.totalMark ?? r.total ?? r.maxMarks ?? '';
  const getObtained = (r: AnswerRow) => r.marksObtained ?? r.obtained ?? r.score ?? '';
  const getConfidence = (r: AnswerRow) => r.confidenceLevel ?? r.confidence ?? '';

  return (
    <div className="w-full mx-auto mt-6">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Answer Sheet Results</h2>
          <p className="text-sm text-gray-600 mt-1">Processed results from uploaded answer sheets</p>
        </div>

        <div className="overflow-x-auto">
          <div className="max-h-[520px] overflow-y-auto">
            <Table className="min-w-max w-full">
              <TableHeader className="sticky top-0 z-20 bg-gray-50">
                <TableRow>
                  <TableHead className="w-24 min-w-24 sticky top-0 z-20 bg-gray-50 text-center">Sl.No</TableHead>
                  <TableHead className="min-w-40 sticky top-0 z-20 bg-gray-50">Roll No</TableHead>
                  <TableHead className="min-w-60 sticky top-0 z-20 bg-gray-50">Name</TableHead>
                  <TableHead className="min-w-32 text-center sticky top-0 z-20 bg-gray-50">Total Mark</TableHead>
                  <TableHead className="min-w-40 text-center sticky top-0 z-20 bg-gray-50">Marks Obtained</TableHead>
                  <TableHead className="min-w-40 text-center sticky top-0 z-20 bg-gray-50">Confidence Level</TableHead>
                  <TableHead className="min-w-40 text-center sticky top-0 z-20 bg-gray-50">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody aria-live="polite">
                {(isLoading || isFetching) &&
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell colSpan={7}>
                        <div className="h-4 w-full animate-pulse bg-gray-100 rounded" />
                      </TableCell>
                    </TableRow>
                  ))}

                {!isLoading && error && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                        <div className="flex items-center gap-2 text-red-700">
                          <AlertCircle className="h-5 w-5" />
                          <span>Couldn’t load answer sheet results. Please try again.</span>
                        </div>
                        {onRetry && (
                          <Button variant="outline" onClick={onRetry}>
                            Retry
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !error && normalizedRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="flex flex-col items-center justify-center p-10 text-center">
                        <AlertCircle className="h-6 w-6 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">No data found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !error && normalizedRows.length > 0 &&
                  normalizedRows.map((row, index) => (
                    <TableRow key={`${getRoll(row)}-${index}`} className={cn('hover:bg-gray-50')}>
                      <TableCell className="font-medium text-center">{index + 1}</TableCell>
                      <TableCell className="font-medium">{getRoll(row)}</TableCell>
                      <TableCell className="font-medium">{getName(row)}</TableCell>
                      <TableCell className="text-center">{getTotal(row)}</TableCell>
                      <TableCell className="text-center">{getObtained(row)}</TableCell>
                      <TableCell className="text-center">{getConfidence(row) !== '' ? `${getConfidence(row)}%` : ''}</TableCell>
                      <TableCell className="text-center">
                        {questionId ? (
                          <button
                            onClick={() => navigate(`/admin/grader/answer-keys/${row.studentId}/${row.qpId}`)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Answers
                          </button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnswerSheetTable;


