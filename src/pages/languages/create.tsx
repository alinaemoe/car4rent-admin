import React, { useState } from "react";
import { Create } from "@refinedev/mui";
import {
  Box,
  FormControlLabel,
  Switch,
  Typography,
  Stack,
  Button,
  Avatar,
  CircularProgress,
  Paper,
  TextField,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslate } from "@refinedev/core";
import { FormProvider, Controller } from "react-hook-form";
import { axiosInstance, API_URL } from "../../utility/axios-instance";

export const LanguageCreate = () => {
  const t = useTranslate();
  const [uploading, setUploading] = useState(false);

  const methods = useForm({
    defaultValues: {
      code: "",
      name: "",
      icon_url: "",
      is_active: true,
    },
  }) as any;

  const { saveButtonProps, watch, setValue, register, formState: { errors } } = methods;

  const imageUrl = watch("icon_url");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axiosInstance.post(`${API_URL}/languages/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setValue("icon_url", res.data.url, { shouldDirty: true });
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setValue("icon_url", "", { shouldDirty: true });
  };

  return (
    <Create
      saveButtonProps={saveButtonProps}
      title={t("languages.titles.create", "Create Language")}
    >
      <FormProvider {...methods}>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          autoComplete="off"
        >
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              {t("languages.sections.details", "Details")}
            </Typography>

            <Stack spacing={2}>
              <TextField
                {...register("code", {
                  required: t("errors.required.field"),
                })}
                fullWidth
                label={t("languages.fields.code", "Code")}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={t("languages.placeholders.code", "e.g. ru, en, de")}
                error={!!errors.code}
                helperText={errors.code?.message as string}
              />

              <TextField
                {...register("name", {
                  required: t("errors.required.field"),
                })}
                fullWidth
                label={t("languages.fields.name", "Name")}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                placeholder={t("languages.placeholders.name", "e.g. Russian, English")}
                error={!!errors.name}
                helperText={errors.name?.message as string}
              />
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, textAlign: "center" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              {t("languages.sections.flag", "Flag Icon")}
            </Typography>

            {imageUrl ? (
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={imageUrl}
                  variant="rounded"
                  sx={{ width: 120, height: 80, borderRadius: 1, border: "1px solid", borderColor: "divider" }}
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
                    minWidth: 28,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    boxShadow: 2,
                    p: 0,
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
                sx={{ borderRadius: 2, textTransform: "none", px: 3, minHeight: 48 }}
              >
                {uploading
                  ? t("languages.messages.uploading", "Uploading...")
                  : t("languages.messages.uploadFlag", "Upload Flag")}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </Button>
            )}
          </Paper>

          <Box>
            <Controller
              name="is_active"
              control={methods.control}
              defaultValue={true}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={!!field.value} />}
                  label={t("languages.fields.is_active", "Active")}
                />
              )}
            />
          </Box>
        </Box>
      </FormProvider>
    </Create>
  );
};
