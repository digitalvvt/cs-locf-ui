import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type LoginRequest = {
  email?: string;
  registration_number?: string;
  password: string;
  role: string;
};
type LoginResponse = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    subjectIds: string;
    role: string;
  };
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://locf.vvtsolutions.in/api/",
    // baseUrl: "http://localhost:3004/api/",
    prepareHeaders: (headers) => {
      // You can add default headers here
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
