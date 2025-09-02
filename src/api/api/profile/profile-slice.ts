// services/profileApi.ts

import { apiSlice } from "../apiSlice";

export type Role = "student" | "faculty" | "admin";

export interface BaseProfile {
  id: number;
  role: Role;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  section?: string | null;
  shiftId?: number | null;
  org_id?: number | null;
}

export interface StudentProfile extends BaseProfile {
  role: "student";
  p_id: number;
  semester: number;
  year: number;
  register_number: string;
  admission_number: string;
}

export interface FacultyProfile extends BaseProfile {
  role: "faculty";
  subjectIds?: string | null;
  subjectNames?: string[]; // ← add
  programs?: { id: number; name: string }[]; // ← add
}

export interface AdminProfile extends BaseProfile {
  role: "admin";
}

export type AnyProfile = StudentProfile | FacultyProfile | AdminProfile;

export type ChangePasswordPayload = {
  userId: number;
  role: Role; // 'student' | 'faculty' (admin usually not allowed)
  current: string; // current password
  next: string; // new password
};

export type ChangePasswordResponse = {
  success: boolean;
  message: string;
};

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudentProfile: builder.query<
      StudentProfile,
      {
        id: number;
        p_id: number;
        semester: number;
        year: number;
        shiftId?: number | null;
        section?: string | null;
      }
    >({
      query: ({ id, p_id, semester, year, shiftId, section }) => {
        const qs = new URLSearchParams({
          userId: String(id),
          p_id: String(p_id),
          semester: String(semester),
          year: String(year),
        });
        if (shiftId != null) qs.append("shiftId", String(shiftId));
        if (section) qs.append("section", section);
        return `profile/student?${qs.toString()}`;
      },
      providesTags: ["Profile"],
    }),
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordPayload>({
      query: ({ userId, role, current, next }) => ({
        // If your backend uses a single endpoint:
        url: `profile/change-password`,
        method: "POST",
        body: {
          userId,
          role,
          currentPassword: current,
          newPassword: next,
        },
      }),
    }),
    getFacultyProfile: builder.query<
      FacultyProfile,
      { id: number; shiftId?: number | null; section?: string | null }
    >({
      query: ({ id, shiftId, section }) => {
        const qs = new URLSearchParams({ userId: String(id) });
        if (shiftId != null) qs.append("shiftId", String(shiftId));
        if (section) qs.append("section", section);
        return `profile/faculty?${qs.toString()}`;
      },
      providesTags: ["Profile"],
    }),

    getAdminProfile: builder.query<AdminProfile, { id: number }>({
      query: ({ id }) => `profile/admin?userId=${id}`,
      providesTags: ["Profile"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStudentProfileQuery,
  useGetFacultyProfileQuery,
  useGetAdminProfileQuery,
  useChangePasswordMutation,
} = profileApi;
