import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface NotificationStatsResponse {
  status: number;
  message: string;
  data: {
    total: number;
  };
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon: string;
  iconColor: string;
  actions?: {
    label: string;
    variant: 'primary' | 'secondary';
  }[];
}

export interface NotificationsResponse {
  status: number;
  message: string;
  data: {
    notifications: Notification[];
    total: number;
    unread: number;
  };
  timestamp: string;
}

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE_URL || ''}`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    getNotificationStats: builder.query<NotificationStatsResponse, void>({
      query: () => '/notifications/admin/stats',
      providesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationStatsQuery,
} = notificationsApi;
