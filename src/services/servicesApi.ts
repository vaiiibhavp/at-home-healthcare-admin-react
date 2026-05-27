import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../utils/baseQuery';

export interface FormMapping {
  status: 'Mapped' | 'Unmapped';
  templateId: string | null;
  templateName: string | null;
  version: string | null;
}

export interface Provider {
  id: string;
  name: string;
}

export interface ProviderGroup {
  total: number;
  providers: Provider[];
}

export interface Service {
  id: string;
  serviceName: string;
  description: string;
  icon: string | null;
  formTemplateId: string | null;
  category: string | null;
  isActive: boolean;
  assignedProviders: ProviderGroup[];
  formMapping: FormMapping;
  createdBy?: {
    id: string;
  };
  updatedBy?: {
    id: string;
  };
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

export interface ServiceResponse {
  status: number;
  message: string;
  data: Service;
  timestamp: string;
}

export interface ServicesListResponse {
  status: number;
  message: string;
  data: {
    services: Service[];
    pagination: Pagination;
  };
  timestamp: string;
}

export interface ServiceStatsResponse {
  status: number;
  message: string;
  data: {
    totalServices: number;
    activeServices: number;
    inactiveServices: number;
    mappedForms: number;
    unmappedServices: number;
  };
  timestamp: string;
}

export const servicesApi = createApi({
  reducerPath: 'servicesApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Services'],
  endpoints: (builder) => ({
    getServices: builder.query<ServicesListResponse, { page?: number; size?: number }>({
      query: ({ page = 1, size = 10 }) => ({
        url: '/services/admin/form-mappings',
        params: { page, size },
      }),
      providesTags: ['Services'],
    }),
    getServiceStats: builder.query<ServiceStatsResponse, void>({
      query: () => ({
        url: '/services/stats/admin',
      }),
      providesTags: ['Services'],
    }),
    getServiceById: builder.query<ServiceResponse, string>({
      query: (id) => ({
        url: `/services/${id}`,
      }),
      providesTags: ['Services'],
    }),
    downloadServices: builder.query<Blob, void>({
      query: () => ({
        url: '/services/download',
        responseHandler: (response) => response.blob(),
        cache: 'no-cache',
      }),
    }),
  }),
});

export const { useGetServicesQuery, useGetServiceByIdQuery, useGetServiceStatsQuery, useLazyDownloadServicesQuery } = servicesApi;
