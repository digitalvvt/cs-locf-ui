import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Plus, ArrowLeft, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { skipToken } from "@reduxjs/toolkit/query";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateProgramOutcomeMutation,
  useGetProgramOutComesByIdQuery,
  useGetCoursesByProgramIdQuery,
  useGetPdfExtractedDataByProgramIdQuery,
} from "@/api/api/program-outcomes-api";
import { useGetSyllabusQuery, useUploadSyllabusMutation } from "@/api/api/file-upload-api";
import { toast } from "sonner";
import { SyllabusCard } from "./SyllabusItem";
import ExtractedPdfSection from "./ExtractedPdfSection";

const ProgramOutComes = () => {
  const { programId } = useParams<{ programId: string }>();
  const subjectIds = localStorage.getItem("subjectIds");
  const {
    data: outcomes = [],
    isLoading,
    error,
    refetch,
  } = useGetProgramOutComesByIdQuery(programId!, {
    skip: !programId, // 🚀 Key Fix
  });
  const {
    data: courses = [],
    isLoading: isCoursesLoading,
    error: courseError,
  } = useGetCoursesByProgramIdQuery(
    programId ? { programId, subjectIds: subjectIds || undefined } : skipToken // ⬅️ skip the query if programId is undefined
  );
  const {
    data: pdfData,
    isLoading: isPdfLoading,
    error: pdfError,
    // refetch: refetchCourses,
  } = useGetPdfExtractedDataByProgramIdQuery(programId!, {
    skip: !programId,
  });
  const [createProgramOutcome, { isLoading: isCreating }] = useCreateProgramOutcomeMutation();

  const navigate = useNavigate();
  const [isOutcomeDialogOpen, setIsOutcomeDialogOpen] = useState(false);
  const [outcomeFormData, setOutcomeFormData] = useState({
    code: "",
    description: "",
  });
  const [uploadSyllabus, { isLoading: isUploading }] = useUploadSyllabusMutation();

  const {
    data,
    isError,
    refetch: refetchSyllabus,
  } = useGetSyllabusQuery(
    { programId: Number(programId), organization_id: "1" },
    { skip: !programId }
  );

  const handleOutcomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!programId) return;

    try {
      const res = await createProgramOutcome({
        program_id: Number(programId),
        code: outcomeFormData.code,
        description: outcomeFormData.description,
      }).unwrap();
      refetch();
      // Reset form and close modal
      setOutcomeFormData({ code: "", description: "" });
      setIsOutcomeDialogOpen(false);
    } catch (err) {
      console.error("Failed to create outcome:", err);
      // Optionally: show a toast or alert
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* <div>
              <h1 className="text-3xl font-bold text-gray-900">Computer Science B.Tech</h1>
              <div className="flex items-center gap-2 mt-5">
                <Badge variant="secondary">2024-2028</Badge>
              </div>
            </div> */}
          </div>
        </div>

        <Tabs defaultValue="program-overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="program-overview">Program Overview</TabsTrigger>
            <TabsTrigger value="outcomes">Program Outcomes</TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="outcomes">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Program Outcomes
                    </CardTitle>
                    <CardDescription>Define the learning outcomes for this program</CardDescription>
                  </div>
                  <Dialog open={isOutcomeDialogOpen} onOpenChange={setIsOutcomeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="default" color="primary" size="default">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Outcome
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <form onSubmit={handleOutcomeSubmit}>
                        <DialogHeader>
                          <DialogTitle>Create Program Outcome</DialogTitle>
                          <DialogDescription>
                            Add a new learning outcome for this program.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="code">Outcome Code</Label>
                            <Input
                              id="code"
                              value={outcomeFormData.code}
                              onChange={(e) =>
                                setOutcomeFormData({
                                  ...outcomeFormData,
                                  code: e.target.value,
                                })
                              }
                              required
                              placeholder="e.g., PO1"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={outcomeFormData.description}
                              onChange={(e) =>
                                setOutcomeFormData({
                                  ...outcomeFormData,
                                  description: e.target.value,
                                })
                              }
                              required
                              placeholder="Describe the outcome..."
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOutcomeDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Create Outcome</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {outcomes.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {outcomes.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.code}</TableCell>
                          <TableCell>{item.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Program Outcomes
                    </h3>
                    <p className="text-gray-600 mb-4">Start by adding the first outcome.</p>
                    <Button onClick={() => setIsOutcomeDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Outcome
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Courses
                    </CardTitle>
                    <CardDescription>Courses offered under this program</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {courses?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Semester</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{course.code}</TableCell>
                          <TableCell>{course.name}</TableCell>
                          <TableCell>{course.semesters}</TableCell>
                          <TableCell>
                            <Button
                              variant="active_outline"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/program-outcomes/${programId}/courses/${course.courseId}`
                                )
                              }
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses</h3>
                    <p className="text-gray-600 mb-4">Start by adding courses to this program.</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Course
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="syllabus">
            <Card>
              <CardHeader>
                <CardTitle>Syllabus Upload</CardTitle>
                <CardDescription>Upload the program syllabus in PDF format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Input
                      id="syllabus"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Handle file selection
                        }
                      }}
                    />

                    <p className="text-sm text-muted-foreground">
                      Only PDF files are accepted (Max size: 5MB)
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isUploading}
                      variant="default"
                      size="default"
                      color="primary"
                      onClick={async () => {
                        const fileInput = document.getElementById("syllabus") as HTMLInputElement;
                        const file = fileInput.files?.[0];

                        if (!file) {
                          toast.error("Please select a file");
                          return;
                        }

                        try {
                          const uuid = Math.floor(Math.random() * 1e10)
                            .toString()
                            .padStart(10, "0");

                          const formData = new FormData();
                          formData.append("file", file);
                          formData.append("organization_id", "1");
                          formData.append("program_id", programId);
                          formData.append("uuid", uuid);

                          const response = await uploadSyllabus(formData).unwrap();

                          toast.success("Syllabus uploaded successfully!");
                          // refetchCourses();
                          refetchSyllabus();
                          fileInput.value = ""; // Reset file input
                        } catch (error) {
                          console.error("Error uploading file:", error);
                          toast.error("Failed to upload syllabus. Please try again.");
                        }
                      }}
                    >
                      {isUploading ? "Uploading..." : "Upload Syllabus"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-4">
              {/* Safely Render Syllabus Cards */}
              {Array.isArray(data) && data.length > 0 ? (
                data.map((syllabus) => (
                  <SyllabusCard
                    key={syllabus.id}
                    fileName={syllabus.original_filename}
                    uploadedDate={syllabus.created_at || new Date().toISOString()}
                    status={syllabus.processing_status}
                    courseOutcomeCount={5} // Static for now, can be dynamic
                    onReprocess={() => console.log(`Reprocess ${syllabus.id}`)}
                    onReview={() => console.log(`Review ${syllabus.id}`)}
                    fileId={syllabus.id}
                  />
                ))
              ) : (
                <p>No syllabus uploaded yet.</p> // Fallback message if no data is available
              )}
            </div>
          </TabsContent>
          <TabsContent value="program-overview">
            {pdfData ? (
              <ExtractedPdfSection pdfData={pdfData} />
            ) : (
              <p className="text-center text-muted-foreground text-sm py-4">No data found.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProgramOutComes;
