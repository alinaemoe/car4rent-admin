import React, { useCallback, useState, useEffect } from "react";
import { Edit } from "@refinedev/mui";
import {
  Box,
  TextField,
  Typography,
  Stack,
  Paper,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslate } from "@refinedev/core";
import { FormProvider } from "react-hook-form";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import DataObjectIcon from "@mui/icons-material/DataObject";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

function tryFormatJson(value: string): { formatted: string; valid: boolean; type: "string" | "object" | "array" | null } {
  if (!value || !value.trim()) {
    return { formatted: value, valid: true, type: null };
  }
  try {
    const parsed = JSON.parse(value);
    let type: "string" | "object" | "array" | null = null;
    if (Array.isArray(parsed)) type = "array";
    else if (typeof parsed === "object" && parsed !== null) type = "object";
    return { formatted: JSON.stringify(parsed, null, 2), valid: true, type };
  } catch {
    return { formatted: value, valid: false, type: null };
  }
}

const SmartValueField = () => {
  const t = useTranslate();
  const { register, watch, setValue } = useForm() as any;

  const value: string = watch("value") ?? "";
  const { formatted, valid, type } = tryFormatJson(value);
  const [useFormatted, setUseFormatted] = useState(false);

  useEffect(() => {
    if (valid && type && formatted !== value) {
      setUseFormatted(true);
    } else {
      setUseFormatted(false);
    }
  }, [valid, type, formatted, value]);

  const handleFormat = useCallback(() => {
    const { formatted: pretty } = tryFormatJson(value);
    if (pretty !== value) {
      setValue("value", pretty, { shouldDirty: true });
    }
  }, [value, setValue]);

  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <TextField
          {...register("value")}
          fullWidth
          label={t("settings.fields.value", "Value")}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          placeholder={t("settings.placeholders.value", "Setting value (plain text or JSON)")}
          multiline
          minRows={4}
          maxRows={20}
          sx={{
            "& .MuiInputBase-root": {
              fontFamily: type ? "monospace" : "inherit",
              fontSize: type ? 13 : undefined,
            },
          }}
        />
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
        {type && (
          <Chip
            icon={type === "object" ? <DataObjectIcon /> : <FormatAlignLeftIcon />}
            label={type === "object" ? t("settings.messages.jsonMode", "JSON") : t("settings.messages.textMode", "Text")}
            size="small"
            color={type === "object" || type === "array" ? "warning" : "info"}
            variant="outlined"
          />
        )}
        {type && (
          <Chip
            icon={<CheckCircleIcon />}
            label={t("settings.messages.jsonValid", "Valid JSON")}
            size="small"
            color="success"
            variant="outlined"
          />
        )}
        {!valid && value && value.trim() && (
          <Chip
            icon={<ErrorIcon />}
            label={t("settings.messages.invalidJson", "Invalid JSON")}
            size="small"
            color="error"
            variant="outlined"
          />
        )}
        {valid && type && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<FormatAlignLeftIcon />}
            onClick={handleFormat}
          >
            {t("settings.messages.jsonFormat", "Format JSON")}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export const SettingEdit = () => {
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
      title={t("settings.titles.edit", "Edit Setting")}
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
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    bgcolor: "action.hover",
                  },
                }}
              />

              <SmartValueField />

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
    </Edit>
  );
};
