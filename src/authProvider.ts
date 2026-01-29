import { AuthProvider } from "@refinedev/core";
import { axiosInstance } from "./utility/axios-instance";

export const authProvider: AuthProvider = {
  // 1. ВХОД
  login: async ({ email, password }) => {
    try {
      // Стучимся на твой бэкенд
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      // Сохраняем токен, который вернул NestJS
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);

        // (Опционально) Сохраним роль или юзера, если бэкенд отдает
        // localStorage.setItem("user", JSON.stringify(data.user));

        return {
          success: true,
          redirectTo: "/",
        };
      }
      return {
        success: false,
        error: { message: "Login failed", name: "Invalid credentials" },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: "Login failed",
          name: error.response?.data?.message || "Invalid email or password",
        },
      };
    }
  },

  // 2. ВЫХОД
  logout: async () => {
    localStorage.removeItem("access_token");
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  // 3. ПРОВЕРКА ПРИ ЗАГРУЗКЕ (Залогинен ли?)
  check: async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      return { authenticated: true };
    }
    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },

  // 4. ПОЛУЧЕНИЕ ПРАВ (Роли)
  getPermissions: async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // Тут можно декодировать JWT и достать роль
      // Либо сделать запрос на /auth/profile
      return ["ADMIN"]; // Пока заглушка
    }
    return null;
  },

  // 5. ПОЛУЧЕНИЕ ПРОФИЛЯ (Для аватарки в углу)
  getIdentity: async () => {
    try {
      // Если у тебя есть эндпоинт /users/profile или /auth/profile
      // const { data } = await axiosInstance.get("/users/profile");
      // return data;

      return {
        id: 1,
        name: "Admin User",
        avatar: "https://i.pravatar.cc/300",
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  // Обработка ошибок
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }
    return { error };
  },
};
