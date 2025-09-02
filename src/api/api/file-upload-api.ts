import { apiSlice } from "./apiSlice";

interface FileUploadResponse {
  message: string;
  filePath: string;
  fileName: string;
}
export interface ISyllabusFile {
  id: number;
  file_path: string;
  file_size: number;
  original_filename: string;
  program_id: number;
  stored_filename: string;
  processing_status: "success" | "failed" | "processing"; // adjust as per actual enum
  created_at: string | null;
  updated_at: string | null;
  uploader_id: number | null;
  organization_id: string;
}
[];

export const fileUploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<FileUploadResponse, FormData>({
      query: (formData) => ({
        url: "upload",
        method: "POST",
        body: formData,
      }),
    }),
    uploadSyllabus: builder.mutation<FileUploadResponse, FormData>({
      query: (formData) => ({
        url: "file-upload/upload",
        method: "POST",
        body: formData,
      }),
    }),
    getSyllabus: builder.query<ISyllabusFile, { programId: number; organization_id: string }>({
      query: ({ programId, organization_id }) => `/syllabus/${programId}/${organization_id}`,
      providesTags: (result, error, { programId, organization_id }) => [
        { type: "Syllabus", id: `${programId}-${organization_id}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useUploadFileMutation, useUploadSyllabusMutation, useGetSyllabusQuery } =
  fileUploadApi;
