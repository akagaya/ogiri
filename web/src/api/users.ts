import { apiClient } from './client';
import type { User, Topic, Answer, Comment, PaginatedResponse } from '../types';

export const usersApi = {
  get: (id: string) => apiClient<User>(`/users/${id}`),
  
  getTopics: (id: string, params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const qs = searchParams.toString();
    const url = `/users/${id}/topics${qs ? `?${qs}` : ''}`;
    return apiClient<PaginatedResponse<Topic>>(url);
  },

  getAnswers: (id: string, params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const qs = searchParams.toString();
    const url = `/users/${id}/answers${qs ? `?${qs}` : ''}`;
    return apiClient<PaginatedResponse<Answer>>(url);
  },

  getComments: (id: string, params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const qs = searchParams.toString();
    const url = `/users/${id}/comments${qs ? `?${qs}` : ''}`;
    return apiClient<PaginatedResponse<Comment>>(url);
  }
};
