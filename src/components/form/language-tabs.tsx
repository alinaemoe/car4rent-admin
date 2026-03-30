import React from "react";
import { Stack, Chip, Skeleton } from "@mui/material"; // 👈 Добавили Skeleton
import TranslateIcon from "@mui/icons-material/Translate";
import { useAppSettings } from "../../contexts/app-settings";
import { useFormLanguage } from "../../contexts/form-language";

export const LanguageTabs = () => {
  const { languages, isLoading } = useAppSettings(); // 👈 Достаем isLoading
  const { activeLang, setActiveLang } = useFormLanguage();

  // 1. Пока запрос летит, показываем заглушку (чтобы UI не прыгал)
  if (isLoading) {
    return (
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <TranslateIcon color="action" />
        <Skeleton variant="rounded" width={60} height={32} />
        <Skeleton variant="rounded" width={60} height={32} />
      </Stack>
    );
  }

  // 2. Запрос завершен. Если язык всего один (или ноль) — прячем табы
  if (languages.length <= 1) return null;

  // 3. Рисуем реальные табы
  return (
    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
      <TranslateIcon color="action" />
      {languages.map((lang) => (
        <Chip
          key={lang.code}
          label={lang.code.toUpperCase()}
          onClick={() => setActiveLang(lang.code)}
          color={activeLang === lang.code ? "primary" : "default"}
          variant={activeLang === lang.code ? "filled" : "outlined"}
          clickable
        />
      ))}
    </Stack>
  );
};
