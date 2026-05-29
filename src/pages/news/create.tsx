import React, { useState } from "react";
import { Create } from "@refinedev/mui";
import {
  Box,
  Grid,
  FormControlLabel,
  Switch,
  Typography,
  Stack,
  Button,
  Avatar,
  CircularProgress,
  Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslate } from "@refinedev/core";
import { FormProvider, Controller } from "react-hook-form";
import { axiosInstance } from "../../utility/axios-instance";
import { API_URL } from "../../utility/axios-instance";

import { FormLanguageProvider } from "../../contexts/form-language";
import { LanguageTabs } from "../../components/form/language-tabs";
import { LocalizedInput } from "../../components/form/localized-input";
import { useAppSettings } from "../../contexts/app-settings";

export const NewsCreate = () => {
  const t = useTranslate();
  const { defaultLang } = useAppSettings();
  const [uploading, setUploading] = useState(false);

  const methods = useForm({
    defaultValues: {
      title: { [defaultLang]: "" },
      text: { [defaultLang]: "" },
      badge: { [defaultLang]: "" },
      image_url: "",
      is_active: true,
    },
  }) as any;

  const { saveButtonProps, watch, setValue } = methods;

  const imageUrl = watch("image_url");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axiosInstance.post(`${API_URL}/news/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setValue("image_url", res.data.url, { shouldDirty: true });
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setValue("image_url", "", { shouldDirty: true });
  };

  return (
    <Create
      saveButtonProps={saveButtonProps}
      title={t("news.titles.create", "Create News")}
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
                  {t("news.sections.title", "Title")}
                </Typography>
                <LanguageTabs />
              </Stack>
              <LocalizedInput
                baseName="title"
                label={t("news.fields.title", "Title")}
                required
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
                  {t("news.sections.text", "Text")}
                </Typography>
                <LanguageTabs />
              </Stack>
              <LocalizedInput
                baseName="text"
                label={t("news.fields.text", "Text")}
                required
                multiline
                rows={6}
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
                  {t("news.sections.badge", "Badge")}
                </Typography>
                <LanguageTabs />
              </Stack>
              <LocalizedInput
                baseName="badge"
                label={t("news.fields.badge", "Badge")}
                required
              />
            </Box>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, textAlign: "center" }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                {t("news.sections.image", "Image")}
              </Typography>

              {imageUrl ? (
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Avatar
                    src={imageUrl}
                    variant="rounded"
                    sx={{ width: 280, height: 180, borderRadius: 2 }}
                  />
                  <Button
                    size="small"
                    color="error"
                    variant="contained"
                    onClick={handleRemoveImage}
                    sx={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      minWidth: 32,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      boxShadow: 2,
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={uploading ? <CircularProgress size={18} /> : <CloudUploadIcon />}
                  disabled={uploading}
                  sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
                >
                  {uploading
                    ? t("news.uploading", "Uploading...")
                    : t("news.uploadImage", "Upload Image")}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </Button>
              )}
            </Paper>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Controller
                  name="is_active"
                  control={methods.control}
                  defaultValue={true}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={!!field.value} />}
                      label={t("news.fields.is_active", "Active")}
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
