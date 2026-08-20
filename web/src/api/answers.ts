import { apiClient } from './client';
import type { Answer, PaginatedResponse } from '../types';

export const answersApi = {
  listByTopic: (topicId: string, params?: { sort?: 'latest' | 'top_rated' }) => {
    const searchParams = new URLSearchParams();
    if (params?.sort) searchParams.append('sort', params.sort);
    
    const qs = searchParams.toString();
    const url = `/topics/${topicId}/answers${qs ? `?${qs}` : ''}`;
    return apiClient<PaginatedResponse<Answer>>(url);
  },
  
  create: (topicId: string, data: { body: string }) => 
    apiClient<Answer>(`/topics/${topicId}/answers`, { method: 'POST', bodyData: data }),
    
  get: (id: string) => apiClient<Answer>(`/answers/${id}`),
  
  delete: (id: string) => apiClient<void>(`/answers/${id}`, { method: 'DELETE' }),
};
