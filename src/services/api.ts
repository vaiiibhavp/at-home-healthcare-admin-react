import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginRequest, LoginResponse, ForgotPasswordRequest, ForgotPasswordResponse, ChangePasswordRequest, ChangePasswordResponse } from '../types/auth';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL || (process.env.NODE_ENV === 'production' ? '' : ''),
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/admin/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (emailData) => ({
        url: '/admin/forgotPassword',
        method: 'POST',
        body: emailData,
      }),
    }),
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (passwordData) => ({
        url: '/admin/changePassword',
        method: 'POST',
        body: passwordData,
      }),
    }),
  }),
});

export const { useLoginMutation, useForgotPasswordMutation, useChangePasswordMutation } = api;
