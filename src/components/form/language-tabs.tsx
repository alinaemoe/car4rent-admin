import React from "react";
import { Stack, Chip } from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import { useAppSettings } from "../../contexts/app-settings";
import { useFormLanguage } from "../../contexts/form-language"; // 👈 Наш новый хук

export const LanguageTabs = () => {
  const { languages } = useAppSettings();
  const { activeLang, setActiveLang } = useFormLanguage();

  if (languages.length <= 1) return null; // Если язык один, табы не нужны

  return (
    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
      <TranslateIcon color="action" />
      {languages.map((lang) => (
        <Chip
          key={lang.code}
          label={lang.code.toUpperCase()}
          onClick={() => setActiveLang(lang.code)}
          // Выделяем активный язык
          color={activeLang === lang.code ? "primary" : "default"}
          variant={activeLang === lang.code ? "filled" : "outlined"}
          clickable
        />
      ))}
    </Stack>
  );
};
