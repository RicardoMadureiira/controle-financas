import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url as string | undefined;
    if (error.response?.status === 401 && url && !url.startsWith("/auth/")) {
      window.dispatchEvent(new Event("finance:session-expired"));
    }
    return Promise.reject(error);
  },
);
