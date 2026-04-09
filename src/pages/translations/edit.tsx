import React from "react";
import { Edit } from "@refinedev/mui";
import { Box, TextField, Grid } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslate } from "@refinedev/core";
import { FormProvider } from "react-hook-form"; // 👈 ИМПОРТИРУЕМ FormProvider

// Наши компоненты
import { FormLanguageProvider } from "../../contexts/form-language";
import { LanguageTabs } from "../../components/form/language-tabs";
import { LocalizedInput } from "../../components/form/localized-input";

export const TranslationEdit = () => {
  const t = useTranslate();

  // 👇 Сохраняем весь объект useForm
  const methods = useForm() as any;

  const {
    saveButtonProps,
    register,
    refineCore: { queryResult },
    formState: { errors },
  } = methods;

  const isLoading = queryResult?.isLoading;

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={isLoading}>
      {/* 👇 ОБЕРТЫВАЕМ В FormProvider */}
      <FormProvider {...methods}>
        <FormLanguageProvider>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            autoComplete="off"
          >
            {/* KEY INPUT */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  {...register("key", { required: t("errors.required.field") })}
                  error={!!errors.key}
                  helperText={errors.key?.message as string}
                  fullWidth
                  label={t("translations.fields.key", "Key (e.g. ui_btn_save)")}
                  variant="outlined"
                  required
                />
              </Grid>
            </Grid>

            {/* LOCALIZED VALUES */}
            <Box
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Box mb={2}>
                <LanguageTabs />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <LocalizedInput
                    baseName="value"
                    label={t("translations.fields.value", "Translation text")}
                    multiline
                    rows={3}
                    required
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </FormLanguageProvider>
      </FormProvider>
    </Edit>
  );
};
