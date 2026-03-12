// types/dashboard.types.ts
// Dashboard API response types

export interface DashboardCard {
  monthly_revenue: number;
  total_users: number;
  total_views: number;
  videos_posted: number;
}

export interface ChartDataPoint {
  month: string;
  total: number;
}

export interface TopCreator {
  id: string;
  name: string;
  email: string;
  image?: string;
  videos: number;
  sales: number;
  commission: number;
}

export interface DashboardApiResponse {
  cards: DashboardCard;
  revenue_trend: ChartDataPoint[];
  user_growth: ChartDataPoint[];
  top_creators: TopCreator[];
}
