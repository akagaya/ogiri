import { apiClient } from './client';
import type { Comment, PaginatedResponse } from '../types';

export const commentsApi = {
  listByAnswer: (answerId: string, params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const qs = searchParams.toString();
    const url = `/answers/${answerId}/comments${qs ? `?${qs}` : ''}`;
    return apiClient<PaginatedResponse<Comment>>(url);
  },
  
  create: (answerId: string, data: { body: string }) => 
    apiClient<Comment>(`/answers/${answerId}/comments`, { method: 'POST', bodyData: data }),
    
  delete: (answerId: string, commentId: string) => 
    apiClient<void>(`/answers/${answerId}/comments/${commentId}`, { method: 'DELETE' }),
};
