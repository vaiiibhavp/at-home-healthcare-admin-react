import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface DashboardOverviewResponse {
  status: number;
  message: string;
  data: {
    totalDoctors: number;
    pendingApprovals: number;
    activeRequests: number;
    totalProviders: number;
    trends: {
      doctors: {
        percentage: number;
        isPositive: boolean;
      };
      requests: {
        percentage: number;
        isPositive: boolean;
      };
    };
  };
  timestamp: string;
}

export interface RequestsOverTimeResponse {
  status: number;
  message: string;
  data: Array<{
    date: string;
    day: string;
    count: number;
  }>;
  timestamp: string;
}

export interface RequestsByStatusResponse {
  status: number;
  message: string;
  data: {
    breakdown: Array<{
      status: string;
      label: string;
      count: number;
      color: string;
    }>;
    total: number;
  };
  timestamp: string;
}

export interface RecentActivityResponse {
  status: number;
  message: string;
  data: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    user: string;
    referenceType: string;
    referenceId: string;
    actionUrl: string;
  }>;
  timestamp: string;
  total: number;
}

export interface ExportResponse {
  status: number;
  message: string;
  data: {
    generatedAt: string;
    overview: {
      totalDoctors: number;
      pendingApprovals: number;
      activeRequests: number;
      totalProviders: number;
      trends: {
        doctors: {
          percentage: number;
          isPositive: boolean;
        };
        requests: {
          percentage: number;
          isPositive: boolean;
        };
      };
    };
    requestsByStatus: {
      breakdown: Array<{
        status: string;
        label: string;
        count: number;
        color: string;
      }>;
      total: number;
    };
    requestsByService: Array<{
      serviceName: string;
      count: number;
    }>;
  };
  timestamp: string;
}

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://163.227.92.122:3047',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<DashboardOverviewResponse, void>({
      query: () => '/admin/dashboard/overview',
      providesTags: ['Dashboard'],
    }),
    getRequestsOverTime: builder.query<RequestsOverTimeResponse, { days?: number }>({
      query: ({ days = 7 }) => `/admin/dashboard/requests-over-time?days=${days}`,
      providesTags: ['Dashboard'],
    }),
    getRequestsByStatus: builder.query<RequestsByStatusResponse, void>({
      query: () => '/admin/dashboard/requests-by-status',
      providesTags: ['Dashboard'],
    }),
    getRecentActivity: builder.query<RecentActivityResponse, { size?: number; page?: number }>({
      query: ({ size = 10, page = 0 }) => `/admin/dashboard/recent-activity?size=${size}&page=${page}`,
      providesTags: ['Dashboard'],
    }),
    exportDashboard: builder.query<ExportResponse, void>({
      query: () => '/admin/dashboard/export',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardOverviewQuery, useGetRequestsOverTimeQuery, useGetRequestsByStatusQuery, useGetRecentActivityQuery, useExportDashboardQuery } = dashboardApi;
