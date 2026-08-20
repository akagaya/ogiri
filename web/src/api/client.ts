const API_BASE = '/api/v1';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface FetchOptions extends RequestInit {
  bodyData?: any;
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { bodyData, ...customConfig } = options;
  const headers = new Headers(customConfig.headers || {});

  if (bodyData) {
    headers.set('Content-Type', 'application/json');
    customConfig.body = JSON.stringify(bodyData);
  }

  const config: RequestInit = {
    ...customConfig,
    headers,
    credentials: 'include', // Cookie (JWT) を送信するため
  };

  const url = `${API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, config);
    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    if (!response.ok) {
      throw new ApiError(response.status, data.message || 'API Error');
    }

    if (data && data.data !== undefined) {
      if (data.meta !== undefined) {
        // PaginatedResponse の場合は { data: [...], meta: {...} } 全体を返す
        return data;
      }
      // 単一リソースの場合は data の中身を剥がして返す
      return data.data;
    }
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error instanceof Error ? error.message : 'Unknown network error');
  }
}
