// redux/services/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

// Define the base URL for your API
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create the base API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    // Prepare headers with authentication token
    prepareHeaders: (headers, { getState }) => {
      // Get token from state or cookies
      const state = getState() as RootState;
      const token = state.auth.token;
      
      // If we have a token, include it in the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  // Define tag types for cache invalidation
  tagTypes: ['User', 'Auth'],
  // Define endpoints in separate files and inject them here
  endpoints: () => ({}),
});

// Export hooks for usage in functional components
export const {} = apiSlice;
