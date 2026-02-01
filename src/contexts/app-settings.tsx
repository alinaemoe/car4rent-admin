import React, { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../utility/axios-instance";

export interface ILanguage {
  code: string;
  name: string;
  is_active: boolean;
  icon_url?: string;
}

interface AppSettingsContextType {
  languages: ILanguage[];
  defaultLang: string;
  isLoading: boolean;
}

export const AppSettingsContext = createContext<AppSettingsContextType>({
  languages: [],
  defaultLang: "en",
  isLoading: true,
});

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [languages, setLanguages] = useState<ILanguage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Запрашиваем языки с бэкенда
        const { data } = await axiosInstance.get("/languages");
        // Фильтруем только активные (если бэк отдает все)
        const activeLangs = Array.isArray(data)
          ? data.filter((l: any) => l.is_active)
          : [];

        setLanguages(activeLangs);
      } catch (error) {
        console.error("Failed to load languages:", error);
        // Фоллбэк, чтобы админка не умерла, если бэк лежит
        setLanguages([{ code: "en", name: "English", is_active: true }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <AppSettingsContext.Provider
      value={{
        languages,
        defaultLang: languages[0]?.code || "en",
        isLoading,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => useContext(AppSettingsContext);
