// ─── Request Types ───

export interface LoginRequest {
  email: string;
  password: string;
  token: string;
}

export interface ChangePasswordRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

// ─── Response Types ───

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImageUrl: string | null;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  type: number;
  logoUrl: string | null;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: User;
  requiresPasswordChange: boolean;
  organization: Organization;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: LoginData;
}

export interface ApiError {
  message: string;
  details?: string[];
  errors?: Array<{ field: string; message: string }>;
}
