import { AuthProvider } from "@refinedev/core";
import { axiosInstance } from "./utility/axios-instance";

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }
        return { success: true, redirectTo: "/" };
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

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // Если токен уже протух — всё равно чистим локально
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    const token = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    if (token) return { authenticated: true };
    if (refreshToken) {
      try {
        const { data } = await axiosInstance.post("/auth/refresh", {
          refresh_token: refreshToken,
        });
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          return { authenticated: true };
        }
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }
    return { authenticated: false, redirectTo: "/login" };
  },

  getPermissions: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;
    const payload = parseJwt(token);
    const roles: string[] = payload?.roles || [];
    if (roles.length > 0) return roles;
    return ["ADMIN"];
  },

  getIdentity: async () => {
    try {
      const { data } = await axiosInstance.get("/users/profile");
      return data;
    } catch {
      const token = localStorage.getItem("access_token");
      if (!token) return null;
      const payload = parseJwt(token);
      if (payload) {
        return { id: payload.sub, email: payload.email, name: payload.email };
      }
      return { id: 1, name: "Admin" };
    }
  },

  onError: async (error) => {
    if (error.response?.status === 401) {
      return { logout: true };
    }
    return { error };
  },
};
