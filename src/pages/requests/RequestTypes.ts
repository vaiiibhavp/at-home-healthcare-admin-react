export interface Doctor {
  name: string;
  specialty: string;
  avatar: string;
}

export interface RequestData {
  id: string;
  requestId: string;
  doctorName: string;
  doctorSpeciality: string;
  doctorProfileImage: string | null;
  patientName: string;
  serviceName: string;
  status: 'pending' | 'completed' | 'inprogress' | 'returned' | 'draft';
  createdAt: string;
  updatedAt: string;
  priorityLevel: string;
  requestedDate: string;
  requestedTime: string;
  assignedProviderName: string;
  digitalSignature: {
    signatureData: string | null;
    signedAt: string | null;
    signedBy: string | null;
  } | null;
  formData: any | null;
  providerFormData: any | null;
  signedPdfUrl: string | null;
  isReadyForDoctorReview: boolean;
  statusDuration: number;
  statusDurationDays: number;
  statusHistory: any[];
  // Detailed API response fields
  doctorId?: {
    _id: string;
    email: string;
    rppsNumber: string;
    finessNumber: string;
    specialty: string;
    businessAddress: string;
    practiceType: string;
    fName: string;
    lName: string;
  };
  patientId?: {
    _id: string;
    fullName: string;
    dateOfBirth: string;
    phoneNumber: string;
    email: string;
    streetAddress: string;
    city: string;
    zip: string;
    medicalDescription: string;
    gender?: string;
    bloodGroup?: string;
  };
  serviceId?: {
    _id: string;
    serviceName: string;
    description: string;
    category: string | null;
    isActive: boolean;
    formTemplateId: string | null;
  };
  initialNotes?: string | null;
  formTemplateId?: string | null;
  createdType?: string;
  providerFormCreatedAt?: string | null;
  providerFormUpdatedAt?: string | null;
  docusignEnvelopeId?: string | null;
  docusignDocumentId?: string | null;
  isLocked?: boolean;
  signatureMetadata?: {
    signatureMethod: string;
    signatureStatus: string;
    expiresAt: string | null;
  };
  lastModifiedAt?: string | null;
  returnComments?: string | null;
  statusTimestamps?: {
    draft: number;
    submitted: number | null;
    inProgress: number | null;
    returned: number | null;
    completed: number | null;
  };
  lastAdminAction?: {
    actionType: string | null;
    performedBy: string | null;
    performedAt: string | null;
    reason: string | null;
  };
  staleFlags?: {
    isStale: boolean;
    staleSince: string | null;
    staleReason: string | null;
  };
  createdBy?: {
    _id: string;
    email: string;
    fName: string;
    lName: string;
  };
  updatedBy?: {
    _id: string;
    email: string;
    fName: string;
    lName: string;
  };
  deleted?: {
    status: boolean;
    by: string | null;
    at: number | null;
  };
  viewedByProviders?: any[];
  auditLogs?: any[];
  // Computed properties for backward compatibility
  doctor?: Doctor;
  patient?: string;
  serviceType?: string;
  dateCreated?: string;
  lastUpdated?: string;
  serviceColor?: string;
  formStatus?: string;
}

export interface TimelineEvent {
  status: string;
  date: string;
  icon: string;
  color: string;
}
