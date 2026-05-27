import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuthNoBaseUrl } from '../utils/baseQuery';

export interface NotificationMetadata {
  doctorId?: string;
  doctorName?: string;
  rppsNumber?: string;
  finessNumber?: string;
  specialty?: string;
  email?: string;
  phoneNumber?: string;
}

export interface Notification {
  userId: string;
  type: string;
  title: string;
  message: string;
  referenceType: string;
  referenceId: string;
  actionUrl: string;
  status: 'unread' | 'read';
  readAt: string | null;
  channels: string[];
  priority: string;
  metadata: NotificationMetadata;
  createdAt: string;
  updatedAt: string;
  id: string;
  creator: string | null;
}

export interface Pagination {
  total: number;
  page: number;
  size: number;
  totalPages: number;
  totalRange: string;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface NotificationsResponse {
  status: number;
  message: string;
  data: {
    notifications: Notification[];
    pagination: Pagination;
  };
  timestamp: string;
}

export interface UnreadCountResponse {
  status: number;
  message: string;
  data: {
    unreadCount: number;
  };
  timestamp: string;
}

export interface MarkAsReadResponse {
  status: number;
  message: string;
  data: {
    status: string;
    readAt: string;
  };
  timestamp: string;
}

export interface MarkAllReadResponse {
  status: number;
  message: string;
  data: {
    markedAsRead: number;
  };
  timestamp: string;
}

export interface GetNotificationsParams {
  page?: number;
  size?: number;
}

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: baseQueryWithAuthNoBaseUrl,
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, GetNotificationsParams>({
      query: (params) => ({
        url: '/notifications',
        params: params || { page: 1, size: 10 },
      }),
      providesTags: ['Notification'],
    }),
    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => '/notifications/unread-count',
      providesTags: ['Notification'],
    }),
    markAsRead: builder.mutation<MarkAsReadResponse, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    markAllAsRead: builder.mutation<MarkAllReadResponse, void>({
      query: () => ({
        url: '/notifications/mark-all-read',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationsApi;
