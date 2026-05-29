import React from "react";
import { Edit } from "@refinedev/mui";
import {
  Box,
  TextField,
  Grid,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslate } from "@refinedev/core";
import { FormProvider } from "react-hook-form";
import { FormLanguageProvider, useFormLanguage } from "../../contexts/form-language";
import { LanguageTabs } from "../../components/form/language-tabs";
import { LocalizedInput } from "../../components/form/localized-input";

const DescriptionSection = () => {
  const t = useTranslate();
  const { activeLang } = useFormLanguage();

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold">
          {t("features.sections.description", "Description")}
        </Typography>
        <LanguageTabs />
      </Stack>
      <LocalizedInput
        baseName="description"
        label={t("features.fields.description", "Description")}
        required
      />
    </Paper>
  );
};

export const FeatureEdit = () => {
  const t = useTranslate();

  const methods = useForm() as any;

  const {
    saveButtonProps,
    register,
    refineCore: { query },
    formState: { errors },
  } = methods;

  const isLoading = query?.isLoading;

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      isLoading={isLoading}
      title={t("features.titles.edit", "Edit Feature")}
    >
      <FormProvider {...methods}>
        <FormLanguageProvider>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            autoComplete="off"
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    {t("features.sections.details", "Details")}
                  </Typography>

                  <Stack spacing={2}>
                    <TextField
                      {...register("internal_name", {
                        required: t("errors.required.field"),
                      })}
                      fullWidth
                      label={t(
                        "features.fields.internal_name",
                        "Internal Name",
                      )}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      placeholder="e.g. climate_control"
                      error={!!errors.internal_name}
                      helperText={
                        errors.internal_name?.message as string
                      }
                    />

                    <TextField
                      {...register("icon_url")}
                      fullWidth
                      label={t("features.fields.icon_url", "Icon URL")}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      placeholder="https://example.com/icon.svg"
                    />
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <DescriptionSection />
              </Grid>
            </Grid>
          </Box>
        </FormLanguageProvider>
      </FormProvider>
    </Edit>
  );
};
