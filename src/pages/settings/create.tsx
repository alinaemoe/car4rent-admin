import React from "react";
import { Create } from "@refinedev/mui";
import {
  Box,
  TextField,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslate } from "@refinedev/core";
import { FormProvider } from "react-hook-form";

export const SettingCreate = () => {
  const t = useTranslate();

  const methods = useForm({
    defaultValues: {
      key: "",
      value: "",
      description: "",
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
      title={t("settings.titles.create", "Create Setting")}
    >
      <FormProvider {...methods}>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          autoComplete="off"
        >
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              {t("settings.sections.details", "Details")}
            </Typography>

            <Stack spacing={2}>
              <TextField
                {...register("key", {
                  required: t("errors.required.field"),
                })}
                fullWidth
                label={t("settings.fields.key", "Key")}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={t("settings.placeholders.key", "e.g. support_phone, currency")}
                error={!!errors.key}
                helperText={errors.key?.message as string}
              />

              <TextField
                {...register("value")}
                fullWidth
                label={t("settings.fields.value", "Value")}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={t("settings.placeholders.value", "Setting value (plain text or JSON)")}
                multiline
                minRows={4}
                maxRows={12}
                error={!!errors.value}
                helperText={errors.value?.message as string}
              />

              <TextField
                {...register("description")}
                fullWidth
                label={t("settings.fields.description", "Description")}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={t("settings.placeholders.description", "What this setting controls")}
                multiline
                minRows={2}
                maxRows={4}
                error={!!errors.description}
                helperText={errors.description?.message as string}
              />
            </Stack>
          </Paper>
        </Box>
      </FormProvider>
    </Create>
  );
};
