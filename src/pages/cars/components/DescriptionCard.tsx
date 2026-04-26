import React from "react";
import { Box, Typography, Stack, Paper } from "@mui/material";
import { useTranslate } from "@refinedev/core";
import { FormLanguageProvider } from "../../../contexts/form-language";
import { LanguageTabs } from "../../../components/form/language-tabs";
import { LocalizedInput } from "../../../components/form/localized-input";

export const DescriptionCard = () => {
  const t = useTranslate();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 0,
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <FormLanguageProvider>
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "action.hover",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold">
              {t("cars.titles.description", "Описание")}
            </Typography>
            <LanguageTabs />
          </Stack>
        </Box>
        <Box sx={{ p: 3 }}>
          <LocalizedInput
            baseName="description"
            label={t("cars.fields.description", "Description")}
            multiline
            rows={5}
          />
        </Box>
      </FormLanguageProvider>
    </Paper>
  );
};
