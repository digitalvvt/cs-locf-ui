import { API_BASE_URL } from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base API service that can be extended by other API slices
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: API_BASE_URL,
    baseUrl: "https://locf.vvtsolutions.in/api/",
    // baseUrl: "http://localhost:3004/api/",

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Common tag types can be defined here
  tagTypes: ["Program", "Course", "Syllabus", "Exams", "Questions", "Student", "Profile"],
  // No endpoints defined here - they'll be injected by other slices
  endpoints: () => ({}),
});
