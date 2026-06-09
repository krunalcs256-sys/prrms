import api from './axios';
import type { ApiResponse, NotificationResponse, Page } from '../types';

export const getNotifications = async (): Promise<NotificationResponse[]> => {
  const res = await api.get<ApiResponse<Page<NotificationResponse>>>('/notifications');
  return res.data.data.content;
};

export const getUnreadCount = async (): Promise<number> => {
  const res = await api.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count');
  return res.data.data.unreadCount;
};

export const markAsRead = async (id: number): Promise<NotificationResponse> => {
  const res = await api.patch<ApiResponse<NotificationResponse>>(`/notifications/${id}/read`);
  return res.data.data;
};

export const markAllAsRead = async (): Promise<void> => {
  await api.patch('/notifications/read-all');
};
