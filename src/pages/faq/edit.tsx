import React from "react";
import { Edit } from "@refinedev/mui";
import {
  Box,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Typography,
  Stack,
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslate } from "@refinedev/core";
import { FormProvider, Controller } from "react-hook-form";

import { FormLanguageProvider } from "../../contexts/form-language";
import { LanguageTabs } from "../../components/form/language-tabs";
import { LocalizedInput } from "../../components/form/localized-input";

export const FaqEdit = () => {
  const t = useTranslate();

  const methods = useForm() as any;

  const {
    saveButtonProps,
    register,
    refineCore: { queryResult },
    formState: { errors },
  } = methods;

  const isLoading = queryResult?.isLoading;

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      isLoading={isLoading}
      title={t("faq.titles.edit", "Edit FAQ")}
    >
      <FormProvider {...methods}>
        <FormLanguageProvider>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            autoComplete="off"
          >
            <Box
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  {t("faq.sections.question", "Question")}
                </Typography>
                <LanguageTabs />
              </Stack>
              <LocalizedInput
                baseName="question"
                label={t("faq.fields.question", "Question")}
                required
                multiline
                rows={2}
              />
            </Box>

            <Box
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  {t("faq.sections.answer", "Answer")}
                </Typography>
                <LanguageTabs />
              </Stack>
              <LocalizedInput
                baseName="answer"
                label={t("faq.fields.answer", "Answer")}
                required
                multiline
                rows={5}
              />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  {...register("order_index", {
                    valueAsNumber: true,
                  })}
                  fullWidth
                  label={t("faq.fields.order_index", "Order")}
                  type="number"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.order_index}
                  helperText={errors.order_index?.message as string}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="is_active"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={!!field.value} />}
                      label={t("faq.fields.is_active", "Active")}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </FormLanguageProvider>
      </FormProvider>
    </Edit>
  );
};
