export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  status: number;
  message: string;
  data: null;
  timestamp: string;
}

export interface ForgotPasswordResponse {
  status: number;
  message: string;
  data: {
    fName: string;
    lName: string;
    id: string;
  };
  timestamp: string;
}

export interface User {
  assignedServices: any[];
  digitalSignatureKey: null;
  fName: string;
  lName: string;
  email: string;
  phoneNumber: string;
  roles: string[];
  status: string;
  isVerified: boolean;
  isFirstLogin: boolean;
  isBlocked: boolean;
  emailNotificationsEnabled: boolean;
  submittedFormCount: number;
  createdAt: string;
  updatedAt: string;
  accessToken: string;
  id: string;
  refreshToken: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: User;
  timestamp: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
