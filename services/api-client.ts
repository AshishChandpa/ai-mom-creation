export const API_BASE_URL =
  (process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');

export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: BodyInit | null;
};

const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(
      typeof data === 'string' ? data : 'Request failed',
      response.status,
      data
    );
  }

  return data;
};

export const apiClient = {
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
    });
    return handleResponse(response) as Promise<T>;
  },

  async postForm<T>(path: string, formData: FormData): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response) as Promise<T>;
  },
};
