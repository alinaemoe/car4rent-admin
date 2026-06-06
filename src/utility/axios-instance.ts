import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (config.headers && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isLoginRequest = originalRequest?.url?.includes("/auth/login");
    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh");
    const isLogoutRequest = originalRequest?.url?.includes("/auth/logout");

    if (
      error.response?.status === 401 &&
      !originalRequest._isRetry &&
      !isLoginRequest &&
      !isRefreshRequest &&
      !isLogoutRequest
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._isRetry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        isRefreshing = false;
        window.dispatchEvent(
          new CustomEvent("auth:session_expired", { detail: { canRetry: false } }),
        );
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        processQueue(null, data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        window.dispatchEvent(new CustomEvent("auth:session_expired"));
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string | null) => {
              if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                axiosInstance(originalRequest).then(resolve).catch(reject);
              }
            },
            reject,
          });
        });
      }
    }

    return Promise.reject(error);
  },
);

(window as any).__retrySession = async (): Promise<boolean> => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return false;
  try {
    const { data } = await axios.post(`${API_URL}/auth/refresh`, {
      refresh_token: refreshToken,
    });
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    processQueue(null, data.access_token);
    return true;
  } catch {
    return false;
  } finally {
    isRefreshing = false;
  }
};

(window as any).__endSession = () => {
  processQueue(new Error("Session expired"));
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  isRefreshing = false;
  window.location.href = "/login?session_expired=1";
};

export { axiosInstance };
