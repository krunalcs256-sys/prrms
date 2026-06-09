import api from './axios';
import type { ApiResponse, DoctorResponse } from '../types';

export const getDoctors = async (): Promise<DoctorResponse[]> => {
  const res = await api.get<ApiResponse<DoctorResponse[]>>('/doctors');
  return res.data.data;
};
