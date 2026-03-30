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
        const { data } = await axiosInstance.get("/languages");

        // 👇 Умная распаковка: если бэк обернул в { data: [...] }, достаем оттуда
        const rawList = Array.isArray(data) ? data : data?.data;

        const activeLangs = Array.isArray(rawList)
          ? rawList.filter((l: any) => l.is_active)
          : [];

        setLanguages(activeLangs);
      } catch (error) {
        console.error("Failed to load languages:", error);
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
