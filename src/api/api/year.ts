import { apiSlice } from "./apiSlice";

export interface IYearProps {
  id: number;
  createdAt: string;
  updatedAt: string;
  year: string;
}

export const programManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getYearsList: builder.query<IYearProps[], void>({
      query: () => "/years",
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetYearsListQuery,
} = programManagementApi;
