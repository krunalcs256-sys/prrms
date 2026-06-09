import api from './axios';
import type { ApiResponse, BulkReferralRequest, BulkReferralResponse, Page, ReferralResponse } from '../types';

export const bulkRefer = async (data: BulkReferralRequest): Promise<BulkReferralResponse> => {
  const res = await api.post<ApiResponse<BulkReferralResponse>>('/referrals/bulk', data);
  return res.data.data;
};

export const getOutgoing = async (page = 0, size = 20): Promise<Page<ReferralResponse>> => {
  const res = await api.get<ApiResponse<Page<ReferralResponse>>>('/referrals/outgoing', {
    params: { page, size },
  });
  return res.data.data;
};

export const getIncoming = async (page = 0, size = 20): Promise<Page<ReferralResponse>> => {
  const res = await api.get<ApiResponse<Page<ReferralResponse>>>('/referrals/incoming', {
    params: { page, size },
  });
  return res.data.data;
};

export const updateReferralStatus = async (
  id: number,
  status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED'
): Promise<ReferralResponse> => {
  const res = await api.patch<ApiResponse<ReferralResponse>>(`/referrals/${id}/status`, { status });
  return res.data.data;
};