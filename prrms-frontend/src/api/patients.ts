import api from './axios';
import type { ApiResponse, CreatePatientRequest, Page, PatientResponse } from '../types';

export interface GetPatientsParams {
  name?: string;
  fromDate?: string;
  toDate?: string;
  department?: string;
  status?: string;
  page?: number;
  size?: number;
}

export const getPatients = async (params: GetPatientsParams): Promise<Page<PatientResponse>> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
  );
  const res = await api.get<ApiResponse<Page<PatientResponse>>>('/patients', { params: cleanParams });
  return res.data.data;
};

export const getPatientById = async (id: number): Promise<PatientResponse> => {
  const res = await api.get<ApiResponse<PatientResponse>>(`/patients/${id}`);
  return res.data.data;
};

export const createPatient = async (data: CreatePatientRequest): Promise<PatientResponse> => {
  const res = await api.post<ApiResponse<PatientResponse>>('/patients', data);
  return res.data.data;
};