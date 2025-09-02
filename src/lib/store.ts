import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authApi } from "@/api/auth/authApi";
import { apiSlice } from "@/api/api/apiSlice";
import { questionBankApi } from "@/api/api/question-bank-api";

const apiMiddlewares = [
  apiSlice.middleware,
  authApi.middleware,
  questionBankApi.middleware,
];

// Create the Redux store with the API slice and any other reducers
export const store = configureStore({
  reducer: {
    // Add the generated reducers as specific top-level slices
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [questionBankApi.reducerPath]: questionBankApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling, and other useful features
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...apiMiddlewares),
  devTools: process.env.NODE_ENV !== "production",
});

// Setup listeners for RTK Query hooks
setupListeners(store.dispatch);

// Export hooks for each API slice
export const { useLoginMutation } = authApi;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
