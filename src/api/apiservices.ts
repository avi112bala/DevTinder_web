import axios from 'axios';
import type { AxiosError, AxiosProgressEvent, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

interface IPostProps {
  url: string;
  payload?: object;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

interface MyErrorResponse {
  message: string;
  data?: { message?: string };
}

const apiResource = () => {
  let hasShownNetworkError = false;

  const service = axios.create({
    baseURL: `${import.meta.env.VITE_DEVELOP_BASE_URL ?? ''}/`,
    withCredentials: true, // Required for cookie-based auth
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  // ── Request interceptor ────────────────────────────────────────────────────
  service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = token;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  });

  // ── Response interceptor ───────────────────────────────────────────────────
  service.interceptors.response.use(
    (response: AxiosResponse) => response?.data ?? [],
    (error: AxiosError) => {
      const errorData = error?.response?.data as MyErrorResponse | undefined;

      // Network / no-response errors
      if (error?.response === undefined) {
        console.error('Network error:', error);

        if (!hasShownNetworkError) {
          hasShownNetworkError = true;
          let errorMessage = 'Connection failed. Please try again.';
          const msg = error?.message?.toLowerCase() ?? '';

          if (msg.includes('cors') || msg.includes('access-control')) {
            errorMessage = 'Server connection blocked. Please contact support.';
          } else if (msg.includes('network error')) {
            errorMessage = navigator.onLine
              ? 'Unable to reach server. Please try again later.'
              : 'No internet connection. Please check your network.';
          } else if (error?.code === 'ECONNABORTED' || msg.includes('timeout')) {
            errorMessage = 'Request timeout. Please try again.';
          } else if (msg.includes('getaddrinfo') || msg.includes('enotfound')) {
            errorMessage = 'Server not found. Please check your connection.';
          }

          toast.error(errorMessage, { position: 'top-right' });
          setTimeout(() => (hasShownNetworkError = false), 5000);
        }

        return Promise.reject(error);
      }

      // HTTP error responses
      const status = error?.response?.status;
      const message = errorData?.data?.message ?? errorData?.message ?? 'Something went wrong.';

      if (status === 400) {
        toast.error(message, { position: 'top-right' });
      } else if (status === 401) {
        const token = localStorage.getItem('token');
        if (token) {
          toast.error('Session expired. Please login again.', { position: 'top-right' });
          localStorage.clear();
          sessionStorage.clear();
          window.location.replace('/login');
          return Promise.reject(error);
        }
        toast.error(message, { position: 'top-right' });
      } else if (status === 440) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      }

      return Promise.reject(error);
    },
  );

  return {
    get: async (url: string) => {
      const data = await service.get(url);
      return data;
    },

    post: async ({ url, payload, onUploadProgress }: IPostProps & { config?: object }) => {
      const data = await service.post(url, payload, { onUploadProgress });
      return data;
    },

    patch: async ({ url, payload }: IPostProps) => {
      const data = await service.patch(url, payload);
      return data;
    },

    delete: async ({ url, payload }: IPostProps) => {
      const data = await service.delete(url, { data: payload });
      return data;
    },

    put: async ({ url, payload }: IPostProps) => {
      const data = await service.put(url, payload);
      return data;
    },
  };
};

export const apiService = apiResource();
