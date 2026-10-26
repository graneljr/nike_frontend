
import axios from "axios";

const backendApiUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "/api"
    : "https://nike-backend-cz93.vercel.app/api");

const api = axios.create({
  baseURL: backendApiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Session expired or user is not authenticated");
    }

    return Promise.reject(error);
  }
);

export default api;
