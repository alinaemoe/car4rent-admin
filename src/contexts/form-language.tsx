import React, { createContext, useContext, useState, useEffect } from "react";
import { useAppSettings } from "./app-settings";

interface FormLanguageContextType {
  activeLang: string;
  setActiveLang: (lang: string) => void;
}

const FormLanguageContext = createContext<FormLanguageContextType>({
  activeLang: "en",
  setActiveLang: () => {},
});

export const FormLanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { defaultLang } = useAppSettings();
  const [activeLang, setActiveLang] = useState(defaultLang);

  // Синхронизируем, если defaultLang загрузился позже
  useEffect(() => {
    if (defaultLang) setActiveLang(defaultLang);
  }, [defaultLang]);

  return (
    <FormLanguageContext.Provider value={{ activeLang, setActiveLang }}>
      {children}
    </FormLanguageContext.Provider>
  );
};

export const useFormLanguage = () => useContext(FormLanguageContext);
