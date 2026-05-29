import React from "react";
import { Create } from "@refinedev/mui";
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
import { useAppSettings } from "../../contexts/app-settings";

export const FaqCreate = () => {
  const t = useTranslate();
  const { defaultLang } = useAppSettings();

  const methods = useForm({
    defaultValues: {
      question: { [defaultLang]: "" },
      answer: { [defaultLang]: "" },
      order_index: 0,
      is_active: true,
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
      title={t("faq.titles.create", "Create FAQ")}
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
                  defaultValue={true}
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
    </Create>
  );
};
