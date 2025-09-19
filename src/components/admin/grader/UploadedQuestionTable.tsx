import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, AlertCircle, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetQuestionPaperQuery } from '@/api/api/admin/question-paper';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Row = { id: number; name?: string; exam_name?: string };

const UploadedQuestionTable: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: questionPaperData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetQuestionPaperQuery();

  // Normalize API result into an array of rows
  const rows: Row[] = Array.isArray(questionPaperData)
    ? questionPaperData
    : questionPaperData
    ? [questionPaperData as Row]
    : [];

  const handleView = (id: number) => {
    navigate(`/admin/grader/edit?id=${id}`);
  };

  const handleViewAnswers = (id: number) => {
    navigate(`/admin/grader/answer-keys/${id}`);
  };

  return (
    <div className="w-full mx-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Uploaded Question Papers</h2>
            <p className="text-sm text-gray-600 mt-1">Manage uploaded question papers</p>
          </div>
          {/* <Button
            variant="default"
            onClick={() => navigate('/admin/grader/create')}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Upload Question Paper
          </Button> */}
        </div>

        {/* Horizontal scroll for narrow screens */}
        <div className="overflow-x-auto">
          {/* SHRINK-TO-CONTENT until max height, then scroll */}
          <div className="max-h-[520px] overflow-y-auto">
            <Table className="min-w-max w-full">
              {/* Sticky header stays visible while vertical scrolling */}
              <TableHeader className="sticky top-0 z-20 bg-gray-50">
                <TableRow>
                  <TableHead className="w-24 min-w-24 sticky top-0 z-20 bg-gray-50 text-center">
                    Sl.No
                  </TableHead>
                  <TableHead className="min-w-48 sticky top-0 z-20 bg-gray-50">
                    Name
                  </TableHead>
                  <TableHead className="text-center min-w-52 sticky top-0 z-20 bg-gray-50">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody aria-live="polite">
                {/* Loading skeleton */}
                {(isLoading || isFetching) &&
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell colSpan={3}>
                        <div className="h-4 w-full animate-pulse bg-gray-100 rounded" />
                      </TableCell>
                    </TableRow>
                  ))}

                {/* Error state */}
                {!isLoading && error && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                        <div className="flex items-center gap-2 text-red-700">
                          <AlertCircle className="h-5 w-5" />
                          <span>Couldn’t load question papers. Please try again.</span>
                        </div>
                        <Button variant="outline" onClick={() => refetch()}>
                          Retry
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Empty state (container collapses to fit this block) */}
                {!isLoading && !error && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <div className="flex flex-col items-center justify-center p-10 text-center">
                        <AlertCircle className="h-6 w-6 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">No question papers found yet.</p>
                        <Button className="mt-3" onClick={() => navigate('/admin/grader/create')}>
                          Upload Question Paper
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Data rows (shrinks when 1–2 items; scrolls when many) */}
                {!isLoading &&
                  !error &&
                  rows.length > 0 &&
                  rows.map((item, index) => (
                    <TableRow key={item.id} className={cn('hover:bg-gray-50')}>
                      <TableCell className="font-medium text-center">{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {item.exam_name ?? item.name ?? `Paper ${item.id}`}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleView(item.id)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Upload Answer Sheet
                          </button>
                          <button
                            onClick={() => handleViewAnswers(item.id)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Questions
                          </button>
                        </div>
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
};

export default UploadedQuestionTable;
