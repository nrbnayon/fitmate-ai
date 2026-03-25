// redux/services/dashboardApi.ts
// Dashboard endpoints for admin dashboard

import { apiSlice } from "../features/apiSlice";
import type { DashboardApiResponse } from "@/types/dashboard.types";

export const dashboardApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ── Dashboard Data ────────────────────────────────────────────────────────
    // GET /auth/admin/dashboard/
    // Returns: { cards, revenue_trend, user_growth, top_creators }
    getDashboardData: builder.query<DashboardApiResponse, void>({
      query: () => ({
        url: "/auth/admin/dashboard/",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApi;
