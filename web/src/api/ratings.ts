import { apiClient } from './client';
import type { Rating } from '../types';

export const ratingsApi = {
  listByAnswer: (answerId: string) => apiClient<Rating[]>(`/answers/${answerId}/ratings`),
  
  upsert: (answerId: string, data: { score: number }) => 
    apiClient<Rating>(`/answers/${answerId}/rating`, { method: 'PUT', bodyData: data }),
};
