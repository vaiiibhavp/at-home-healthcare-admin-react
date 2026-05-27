export interface ServiceDetail {
  serviceName: string;
  category: string | null;
  createdBy: {
    fName: string;
    lName: string;
    id: string;
  };
  updatedBy: {
    fName: string;
    lName: string;
    id: string;
  };
  id: string;
}

export interface Provider {
  providerName: string;
  email: string;
  phoneNumber: string;
  countryCode?: string;
  assignedServices: string[];
  registrationId: string;
  emailNotificationsEnabled: boolean;
  status: 'approved' | 'pending' | 'rejected' | 'inactive';
  isVerified: boolean;
  createdAt: string;
  id: string;
  serviceDetails: ServiceDetail[];
  deleted?: {
    status: boolean;
    by: string | null;
    at: number;
  };
  digitalSignatureKey?: string | null;
  submittedFormCount?: number;
  roles?: string[];
  isFirstLogin?: boolean;
  isBlocked?: boolean;
  createdBy?: {
    fName: string;
    lName: string;
    id: string;
  };
  updatedBy?: {
    fName: string;
    lName: string;
    id: string;
  };
  updatedAt?: string;
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

export interface ProvidersResponse {
  status: number;
  message: string;
  data: {
    providers: Provider[];
    pagination: Pagination;
  };
  timestamp: string;
}

export interface ProvidersListParams {
  page?: number;
  size?: number;
  status?: string;
  search?: string;
  service?: string;
}

export interface CreateProviderRequest {
  providerName: string;
  email: string;
  phoneNumber: string;
  countryCode?: string;
  registrationId: string;
  assignedServices: string[];
}

export interface CreateProviderResponse {
  status: number;
  message: string;
  data: {
    provider: Provider;
  };
  timestamp: string;
}

export interface UpdateProviderRequest {
  providerName: string;
  phoneNumber: string;
  countryCode?: string;
  registrationId: string;
  emailNotificationsEnabled: boolean;
}

export interface GetProviderResponse {
  status: number;
  message: string;
  data: Provider;
  timestamp: string;
}

export interface DeactivateProviderRequest {
  status: 'inactive';
}

export interface DeactivateProviderResponse {
  status: number;
  message: string;
  data: {
    status: 'inactive';
    updatedBy: string;
    updatedAt: number;
  };
  timestamp: string;
}

export interface ActivateProviderRequest {
  status: 'approved';
}

export interface ActivateProviderResponse {
  status: number;
  message: string;
  data: {
    status: 'approved';
    updatedBy: string;
    updatedAt: number;
  };
  timestamp: string;
}

export interface BulkDeactivateRequest {
  providerIds: string[];
}

export interface BulkDeactivateResponse {
  status: number;
  message: string;
  data: {
    deactivatedCount: number;
  };
  timestamp: string;
}

export interface UpdateProviderResponse {
  status: number;
  message: string;
  data: {
    updatedBy: string;
    updatedAt: number;
    providerName: string;
    phoneNumber: string;
    registrationId: string;
    emailNotificationsEnabled: boolean;
  };
  timestamp: string;
}
