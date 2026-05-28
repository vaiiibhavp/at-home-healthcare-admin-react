import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../utils/baseQuery';

export interface AssignedProvider {
  id: string;
  name: string;
}

export interface ProviderGroup {
  total: number;
  providers: AssignedProvider[];
}

export interface FormMapping {
  status: 'Mapped' | 'Unmapped';
  templateId: string | null;
  templateName: string | null;
  version: string | null;
}

export interface ApiService {
  serviceName: string;
  description: string;
  icon: string | null;
  formTemplateId: string | null;
  category: string | null;
  isActive: boolean;
  assignedProviders: ProviderGroup;
  formMapping: FormMapping;
  id: string;
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

export interface FormMappingsResponse {
  status: number;
  message: string;
  data: {
    services: ApiService[];
    pagination: Pagination;
  };
  timestamp: string;
}

export const formMappingsApi = createApi({
  reducerPath: 'formMappingsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['FormMappings'],
  endpoints: (builder) => ({
    getFormMappings: builder.query<FormMappingsResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/services/admin/form-mappings',
        params: { page, limit },
      }),
    }),
  }),
});

export const { useGetFormMappingsQuery } = formMappingsApi;
