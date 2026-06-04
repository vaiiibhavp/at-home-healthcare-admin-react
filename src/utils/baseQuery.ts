import { fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: (process.env.REACT_APP_API_BASE_URL || 'http://163.227.92.122:3047').replace(/\/+$/, ''),
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token || localStorage.getItem('authToken');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithAuth: BaseQueryFn = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized errors
  if (result.error && result.error.status === 401) {
    // Dispatch logout action
    api.dispatch(logout());
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Redirect to login
    window.location.href = '/login';
  }

  return result;
};

export const baseQueryWithAuthNoBaseUrl: BaseQueryFn = async (args, api, extraOptions) => {
  const baseQueryNoBaseUrl = fetchBaseQuery({
    baseUrl: (process.env.REACT_APP_API_BASE_URL || '').replace(/\/+$/, ''),
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token || localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  const result = await baseQueryNoBaseUrl(args, api, extraOptions);

  // Handle 401 Unauthorized errors
  if (result.error && result.error.status === 401) {
    // Dispatch logout action
    api.dispatch(logout());
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Redirect to login
    window.location.href = '/login';
  }

  return result;
};
