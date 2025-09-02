"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import SelectDropdown from "@/components/Common/SelectDropdown";
import { GenericType } from "@/types";
import { SearchInput } from "@/components/Common/DebouncedSearchbar";
import { PaginationServer } from "@/components/ui/pagination-server-side";
import { useGetExamSummaryMutation } from "@/api/api/admin/dashboard";
import { useNavigate } from "react-router-dom";
// your hook

// ---- Types ----
type Exam = {
  examId: string | number;
  examName: string;
  programName: string;
  completedCount: number;
  attemptedCount: number;
  ownerName: string;
  targetStudentsCount: number;
  // add other fields as your API returns (e.g., start_date, etc.)
};

// If your backend already defines this, you can delete this local type.
// This shape is a common pattern; adapt the field names if your API differs.
type ExamResponse = {
  items: Exam[]; // list of rows
  totalItems: number; // total across all pages
  page: number; // 1-based
  limit: number; // per page
  totalPages?: number; // optional from server
};

// ---- Constants ----
const filters: GenericType[] = [
  { id: 0, name: "All" },
  { id: 1, name: "Latest" }, // previous 7 days (handled server-side)
  { id: 2, name: "Last Week" }, // handled server-side
  { id: 3, name: "Last Month" }, // handled server-side
];

const DEFAULT_LIMIT = 10;

const ExamsOverviewTable = () => {
  const navigate = useNavigate();
  // UI state
  const [selectedFilter, setSelectedFilter] = React.useState<GenericType>(filters[0]);
  const [search, setSearch] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(DEFAULT_LIMIT);

  // RTK Mutation (POST)
  const [getExamSummary, { data, isLoading, isError, error }] = useGetExamSummaryMutation();

  // Kick off server fetch whenever page/limit/filter/search changes
  React.useEffect(() => {
    getExamSummary({
      page,
      limit,
      filter: Number(selectedFilter?.id ?? 0),
      search: search ?? "",
    });
  }, [page, limit, selectedFilter, search, getExamSummary]);

  // Normalize server response
  const server = (data as unknown as ExamResponse) || ({} as ExamResponse);
  const rows: Exam[] =
    (server.items as Exam[]) ||
    // fallback common names if your API differs
    ((data as any)?.rows as Exam[]) ||
    ((data as any)?.data as Exam[]) ||
    [];
  const totalItems: number = server.totalItems ?? (data as any)?.total ?? (data as any)?.count ?? 0;

  const totalPages =
    server.totalPages ?? Math.max(1, Math.ceil((totalItems || 0) / (limit || DEFAULT_LIMIT)));

  // Handlers
  const onPageChange = (newPage: number) => setPage(newPage);
  const onPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // reset to first page on size change
  };

  const handleFilterChange = (filter: GenericType) => {
    setSelectedFilter(filter);
    setPage(1); // reset pagination on filter
  };

  const handleSearch = (q: string) => {
    setSearch(q);
    setPage(1); // reset pagination on search
  };

  const handleViewAnalysis = (exam: Exam) => {
    navigate(`/admin/exams/analytics/${exam.examId}`);
  };

  // For a nice stable Sl. No regardless of server providing it
  const serialOffset = (page - 1) * limit;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-balance">Exam Summary</CardTitle>

        <div className="flex flex-row gap-2 w-full sm:w-auto">
          <SearchInput
            onSearch={handleSearch}
            placeholder="Search programme or exam..."
            debounceMs={400}
            defaultValue={search}
            fireOnMount={false}
            className="w-full sm:w-[280px]"
          />
          <SelectDropdown
            options={filters}
            value={selectedFilter}
            onChange={handleFilterChange}
            className="w-[150px]"
            disabled={isLoading}
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap text-center">Sl. No</TableHead>
                <TableHead className="whitespace-nowrap">Exam Name</TableHead>
                <TableHead className="whitespace-nowrap">Programme Name</TableHead>
                <TableHead className="whitespace-nowrap">Faculty Name</TableHead>
                <TableHead className="whitespace-nowrap text-right">Overall Students</TableHead>
                <TableHead className="whitespace-nowrap text-right">Attended Students</TableHead>
                <TableHead className="whitespace-nowrap text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Loading state */}
              {isLoading && (
                <>
                  {Array.from({ length: Math.min(limit, 5) }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell className="text-center">
                        <div className="h-4 w-8 animate-pulse bg-muted rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-48 animate-pulse bg-muted rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-40 animate-pulse bg-muted rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-40 animate-pulse bg-muted rounded" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-4 ml-auto w-16 animate-pulse bg-muted rounded" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-4 ml-auto w-16 animate-pulse bg-muted rounded" />
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="h-8 w-24 mx-auto animate-pulse bg-muted rounded" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}

              {/* Error state */}
              {!isLoading && isError && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-red-600">
                    {(error as any)?.data?.message ||
                      (error as any)?.error ||
                      "Failed to load exams. Please try again."}
                  </TableCell>
                </TableRow>
              )}

              {/* Empty state */}
              {!isLoading && !isError && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                    No exams found for the selected filter.
                  </TableCell>
                </TableRow>
              )}

              {/* Data rows */}
              {!isLoading &&
                !isError &&
                rows.map((exam, idx) => (
                  <TableRow key={String(exam.examId ?? `${serialOffset + idx + 1}`)}>
                    <TableCell className="align-middle text-center">
                      {serialOffset + idx + 1}
                    </TableCell>
                    <TableCell className="align-middle">{exam.examName}</TableCell>
                    <TableCell className="align-middle">{exam.programName}</TableCell>
                    <TableCell className="align-middle">{exam.ownerName}</TableCell>
                    <TableCell className="align-middle text-center">
                      {exam.targetStudentsCount}
                    </TableCell>
                    <TableCell className="align-middle text-center">
                      {exam.attemptedCount}
                    </TableCell>
                    <TableCell className="align-middle text-center">
                      <Button
                        size="sm"
                        variant="default"
                        color={"primary"}
                        onClick={() => handleViewAnalysis(exam)}
                        aria-label={`View analysis for ${exam.examName}`}
                      >
                        View analysis
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-center mt-7">
          <PaginationServer
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            perPage={limit}
            onPerPageChange={onPerPageChange}
            totalItems={totalItems}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamsOverviewTable;
