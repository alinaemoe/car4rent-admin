import React from "react";
import { Create } from "@refinedev/mui";
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
import { FormLanguageProvider } from "../../contexts/form-language";
import { LanguageTabs } from "../../components/form/language-tabs";
import { LocalizedInput } from "../../components/form/localized-input";
import { useAppSettings } from "../../contexts/app-settings";

export const FeatureCreate = () => {
  const t = useTranslate();
  const { defaultLang } = useAppSettings();

  const methods = useForm({
    defaultValues: {
      internal_name: "",
      description: { [defaultLang]: "" },
      icon_url: "",
    },
  }) as any;

  const {
    saveButtonProps,
    register,
    formState: { errors },
  } = methods;

  return (
    <Create
      saveButtonProps={saveButtonProps}
      title={t("features.titles.create", "Create Feature")}
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
              </Grid>
            </Grid>
          </Box>
        </FormLanguageProvider>
      </FormProvider>
    </Create>
  );
};
