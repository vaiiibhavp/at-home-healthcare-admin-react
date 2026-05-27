import { createApi } from '@reduxjs/toolkit/query/react';
import { DoctorsResponse, DoctorsListParams, DoctorDetailResponse, DoctorStatusUpdateRequest, DoctorStatusUpdateResponse, InternalNotesRequest, InternalNotesResponse } from '../types/doctor';
import { baseQueryWithAuth } from '../utils/baseQuery';

export const doctorsApi = createApi({
  reducerPath: 'doctorsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Doctors'],
  endpoints: (builder) => ({
    getDoctors: builder.query<DoctorsResponse, DoctorsListParams>({
      query: (params) => ({
        url: '/admin/doctors',
        method: 'GET',
        params,
      }),
      providesTags: ['Doctors'],
    }),
    getDoctorDetails: builder.query<DoctorDetailResponse, string>({
      query: (doctorId) => ({
        url: `/admin/doctors/${doctorId}`,
        method: 'GET',
      }),
      providesTags: ['Doctors'],
    }),
    updateDoctorStatus: builder.mutation<DoctorStatusUpdateResponse, { doctorId: string; statusData: DoctorStatusUpdateRequest }>({
      query: ({ doctorId, statusData }) => ({
        url: `/admin/doctors/${doctorId}/status`,
        method: 'POST',
        body: statusData,
      }),
      invalidatesTags: ['Doctors'],
    }),
    updateInternalNotes: builder.mutation<InternalNotesResponse, { doctorId: string; notesData: InternalNotesRequest }>({
      query: ({ doctorId, notesData }) => ({
        url: `/admin/doctors/${doctorId}/internal-notes`,
        method: 'PUT',
        body: notesData,
      }),
      invalidatesTags: ['Doctors'],
    }),
  }),
});

export const { useGetDoctorsQuery, useGetDoctorDetailsQuery, useUpdateDoctorStatusMutation, useUpdateInternalNotesMutation } = doctorsApi;
