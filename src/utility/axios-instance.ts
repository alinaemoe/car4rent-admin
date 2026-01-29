import axios from "axios";

// Адрес твоего бэкенда
export const API_URL = "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// 👇 Перехватчик: перед каждым запросом суем токен в заголовок
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

// 👇 Перехватчик: если токен протух (401), выкидываем юзера
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      // Можно сделать редирект на логин, но AuthProvider сам это обработает
    }
    return Promise.reject(error);
  },
);

export { axiosInstance };
