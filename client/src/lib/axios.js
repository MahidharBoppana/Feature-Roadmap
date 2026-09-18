import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/signup") ||
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/logout");

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then(() => {
        return api(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      await api.post("/auth/refresh-token");

      processQueue(null);

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      return Promise.reject({
        ...refreshError,
        isAuthError: true,
      });
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
