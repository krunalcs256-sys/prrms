import api from './axios';
import type { ApiResponse, AuthUser, LoginRequest, RegisterRequest } from '../types';

export const login = async (data: LoginRequest): Promise<AuthUser> => {
  const res = await api.post<ApiResponse<AuthUser>>('/auth/login', data);
  return res.data.data;
};

export const register = async (data: RegisterRequest): Promise<AuthUser> => {
  const res = await api.post<ApiResponse<AuthUser>>('/auth/register', data);
  return res.data.data;
};