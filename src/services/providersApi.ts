import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ProvidersResponse, ProvidersListParams, CreateProviderRequest, CreateProviderResponse, UpdateProviderRequest, UpdateProviderResponse, GetProviderResponse, DeactivateProviderRequest, DeactivateProviderResponse, ActivateProviderRequest, ActivateProviderResponse, BulkDeactivateRequest, BulkDeactivateResponse } from '../types/provider';

export const providersApi = createApi({
  reducerPath: 'providersApi',
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
  tagTypes: ['Providers'],
  endpoints: (builder) => ({
    getProviders: builder.query<ProvidersResponse, ProvidersListParams>({
      query: (params) => ({
        url: '/admin/providers',
        method: 'GET',
        params,
      }),
      providesTags: ['Providers'],
    }),
    createProvider: builder.mutation<CreateProviderResponse, CreateProviderRequest>({
      query: (body) => ({
        url: '/admin/providers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Providers'],
    }),
    getProviderById: builder.query<GetProviderResponse, string>({
      query: (id) => ({
        url: `/admin/providers/${id}`,
        method: 'GET',
      }),
      providesTags: ['Providers'],
    }),
    deactivateProvider: builder.mutation<DeactivateProviderResponse, { id: string; body: DeactivateProviderRequest }>({
      query: ({ id, body }) => ({
        url: `/admin/providers/${id}/status`,
        method: 'PATCH',
        body,
      }),
    }),
    activateProvider: builder.mutation<ActivateProviderResponse, { id: string; body: ActivateProviderRequest }>({
      query: ({ id, body }) => ({
        url: `/admin/providers/${id}/status`,
        method: 'PATCH',
        body,
      }),
    }),
    bulkDeactivateProviders: builder.mutation<BulkDeactivateResponse, BulkDeactivateRequest>({
      query: (body) => ({
        url: '/admin/providers/bulk/deactivate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Providers'],
    }),
    exportProvidersCSV: builder.mutation<Blob, void>({
      query: () => ({
        url: '/admin/providers/export/csv',
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
    updateProvider: builder.mutation<UpdateProviderResponse, { id: string; body: UpdateProviderRequest }>({
      query: ({ id, body }) => ({
        url: `/admin/providers/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Providers'],
    }),
  }),
});

export const { useGetProvidersQuery, useGetProviderByIdQuery, useCreateProviderMutation, useUpdateProviderMutation, useDeactivateProviderMutation, useActivateProviderMutation, useBulkDeactivateProvidersMutation, useExportProvidersCSVMutation } = providersApi;
