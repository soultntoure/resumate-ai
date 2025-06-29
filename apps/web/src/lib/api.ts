import { QueryClient } from '@tanstack/react-query';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 2,
      onError: (error) => {
        console.error('Query Error:', error);
        // Optionally trigger a toast or error message
      },
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation Error:', error);
        // Optionally trigger a toast or error message
      },
    },
  },
});

// Generic fetcher for TanStack Query
export const fetcher = async <TData = unknown>(url: string, options?: RequestInit): Promise<TData> => {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An API error occurred');
  }

  return response.json() as TData;
};
