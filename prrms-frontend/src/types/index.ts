export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'DOCTOR' | 'ADMIN';
  department?: string | null;
}

export interface AuthUser {
  token: string;
  tokenType: string;
  userId: number;
  name: string;
  email: string;
  role: 'DOCTOR' | 'ADMIN';
  department: string | null;
}

export interface PatientResponse {
  id: number;
  uhid: string;
  name: string;
  age: number;
  gender: string;
  encounterId: string;
  department: string;
  assignedDoctorId: number;
  assignedDoctorName: string;
  appointmentDate: string;
  status: string;
  createdAt: string;
}

export interface CreatePatientRequest {
  uhid: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  encounterId: string;
  department: string;
  appointmentDate: string;
}

export interface ReferralResponse {
  id: number;
  sourceDoctorId: number;
  sourceDoctorName: string;
  targetDoctorId: number;
  targetDoctorName: string;
  patientId: number;
  patientName: string;
  patientUhid: string;
  encounterId: string;
  remarks: string;
  priority: 'NORMAL' | 'URGENT';
  status: 'PENDING_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;
}

export interface NotificationResponse {
  id: number;
  message: string;
  referralId: number | null;
  isRead: boolean;
  createdAt: string;
}

export interface DoctorResponse {
  id: number;
  name: string;
  email: string;
  department: string | null;
}

export interface BulkReferralRequest {
  patientIds: number[];
  targetDoctorId: number;
  targetDoctorName: string;
  remarks?: string;
  priority: 'NORMAL' | 'URGENT';
}

export interface BulkReferralResponse {
  totalReferred: number;
  message: string;
  referrals: ReferralResponse[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}