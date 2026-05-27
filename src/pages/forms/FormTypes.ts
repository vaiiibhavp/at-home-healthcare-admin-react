export interface Service {
  id: string;
  name: string;
  service_name?: string; // Alternative name field from API
  description?: string;
  formName?: string;
  status: 'mapped' | 'unmapped';
  isActive?: boolean;
  category?: string | null;
  icon?: string | null;
  assignedProviders?: any[];
}

export interface FormData {
  title: string;
  description: string;
  fields: FormField[];
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'checkbox' | 'select' | 'radio';
  required?: boolean;
  section?: string;
  options?: string[];
}

export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  mappedServices?: Service[];
  unmappedServices?: Service[];
  totalServices?: number;
  createdAt?: string;
  updatedAt?: string;
  // Add any other fields that might come from API
  [key: string]: any;
}

export interface FormTemplatesResponse {
  templates: FormTemplate[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}
