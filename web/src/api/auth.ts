import { apiClient } from './client';
import type { User } from '../types';

export const authApi = {
  me: () => apiClient<User>('/auth/me'),
  login: (data: any) => apiClient<User>('/auth/login', { method: 'POST', bodyData: data }),
  register: (data: any) => apiClient<User>('/auth/register', { method: 'POST', bodyData: data }),
  logout: () => apiClient<void>('/auth/logout', { method: 'POST' }),
};
