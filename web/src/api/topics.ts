import { apiClient } from './client';
import type { Topic, PaginatedResponse } from '../types';

export const topicsApi = {
  list: (params?: { sort?: 'latest' | 'popular'; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const qs = searchParams.toString();
    const url = `/topics${qs ? `?${qs}` : ''}`;
    return apiClient<PaginatedResponse<Topic>>(url);
  },
  
  get: (id: string) => apiClient<Topic>(`/topics/${id}`),
  
  create: (data: { body: string }) => apiClient<Topic>('/topics', { method: 'POST', bodyData: data }),
  
  delete: (id: string) => apiClient<void>(`/topics/${id}`, { method: 'DELETE' })
};
