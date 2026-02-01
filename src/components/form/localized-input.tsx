import React from "react";
import { useAppSettings } from "../../contexts/app-settings";
import { useFormLanguage } from "../../contexts/form-language"; // 👈
import { Box, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

interface LocalizedInputProps {
  baseName: string; // "color", "description"
  label: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

export const LocalizedInput = ({
  baseName,
  label,
  required = false,
  multiline = false,
  rows,
}: LocalizedInputProps) => {
  const { languages, defaultLang } = useAppSettings(); // 👈 Берем дефолтный язык
  const { activeLang } = useFormLanguage();
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const formErrors = errors as any;

  return (
    <Box>
      {languages.map((lang) => {
        // Мы рендерим ВСЕ инпуты, но показываем только АКТИВНЫЙ.
        // Это важно, чтобы useForm регистрировал все поля.
        const isActive = activeLang === lang.code;
        const isFieldRequired = required && lang.code === defaultLang;

        return (
          <Box key={lang.code} sx={{ display: isActive ? "block" : "none" }}>
            <TextField
              {...register(`${baseName}.${lang.code}`, {
                required: isFieldRequired
                  ? "This translation is required"
                  : false,
              })}
              fullWidth
              multiline={multiline}
              rows={rows}
              // Добавляем флаг языка к лейблу для ясности
              label={`${label} (${lang.code.toUpperCase()})${
                isFieldRequired ? " *" : ""
              }`}
              placeholder={`Enter ${label.toLowerCase()} in ${lang.name}`}
              InputLabelProps={{ shrink: true }}
              error={!!formErrors?.[baseName]?.[lang.code]}
              helperText={
                formErrors?.[baseName]?.[lang.code]?.message as string
              }
            />
          </Box>
        );
      })}
    </Box>
  );
};
