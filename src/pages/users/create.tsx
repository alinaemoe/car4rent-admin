import React from "react";
import { Create } from "@refinedev/mui";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Stack,
  Typography,
} from "@mui/material";
// 👇 Не забываем правильный импорт
import { useForm } from "@refinedev/react-hook-form";
import { useTranslate } from "@refinedev/core";
import { Controller } from "react-hook-form";

export const UserCreate = () => {
  const t = useTranslate();

  const {
    saveButtonProps,
    register,
    control,
    formState: { errors },
    // 👇 Хак для TS, который мы утвердили
  } = useForm({
    defaultValues: {
      status: "ACTIVE",
      roles: ["CLIENT"],
      is_email_verified: false, // 👈
      is_documents_verified: false, // 👈
      first_name: "",
      last_name: "",
      email: "",
      password: "", // Новое поле для создания
      phone: "",
    },
  }) as any;

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        autoComplete="off"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          maxWidth: 600,
        }}
      >
        <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
          Заполните данные для создания нового пользователя. Пароль обязателен.
        </Typography>

        {/* ===== NAMES ===== */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            {...register("first_name", {
              required: t("errors.required.field"),
            })}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
            fullWidth
            InputLabelProps={{ shrink: true }}
            label={t("users.fields.firstName")}
            placeholder="Ivan"
          />

          <TextField
            {...register("last_name", {
              required: t("errors.required.field"),
            })}
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
            fullWidth
            InputLabelProps={{ shrink: true }}
            label={t("users.fields.lastName")}
            placeholder="Ivanov"
          />
        </Stack>

        {/* ===== EMAIL & PASSWORD ===== */}
        {/* Email и пароль критичны для входа */}
        <TextField
          {...register("email", {
            required: t("errors.required.field"),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
          InputLabelProps={{ shrink: true }}
          label={t("users.fields.email")}
          type="email"
        />

        <TextField
          {...register("password", {
            required: t("errors.required.field"),
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Password" // Можно добавить в переводы t("users.fields.password")
          type="password"
          autoComplete="new-password"
        />

        {/* ===== PHONE ===== */}
        <TextField
          {...register("phone")}
          fullWidth
          InputLabelProps={{ shrink: true }}
          label={t("users.fields.phone")}
        />

        {/* ===== STATUS ===== */}
        <FormControl fullWidth>
          <InputLabel>{t("users.fields.status")}</InputLabel>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select {...field} label={t("users.fields.status")}>
                <MenuItem value="ACTIVE">
                  {t("users.enums.status.ACTIVE")}
                </MenuItem>
                <MenuItem value="BANNED">
                  {t("users.enums.status.BANNED")}
                </MenuItem>
                <MenuItem value="PENDING_VERIFICATION">
                  {t("users.enums.status.PENDING_VERIFICATION")}
                </MenuItem>
              </Select>
            )}
          />
        </FormControl>

        {/* ===== ROLES ===== */}
        <FormControl fullWidth>
          <InputLabel>{t("users.fields.roles")}</InputLabel>
          <Controller
            name="roles"
            control={control}
            render={({ field }) => (
              <Select {...field} multiple label={t("users.fields.roles")}>
                <MenuItem value="CLIENT">
                  {t("users.enums.roles.CLIENT")}
                </MenuItem>
                <MenuItem value="ADMIN">
                  {t("users.enums.roles.ADMIN")}
                </MenuItem>
                <MenuItem value="MANAGER">
                  {t("users.enums.roles.MANAGER")}
                </MenuItem>
              </Select>
            )}
          />
        </FormControl>

        {/* ===== VERIFIED ===== */}
        {/* ===== EMAIL VERIFIED ===== */}
        <Controller
          name="is_email_verified"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              label={t("users.fields.emailVerified", "Email Verified")}
              control={
                <Checkbox
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
            />
          )}
        />

        {/* ===== DOCUMENTS VERIFIED ===== */}
        <Controller
          name="is_documents_verified"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              label={t("users.fields.documentsVerified", "Docs Verified")}
              control={
                <Checkbox
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
            />
          )}
        />

        {/* ===== ADMIN COMMENT ===== */}
        <TextField
          {...register("admin_comment")}
          fullWidth
          multiline
          rows={3}
          InputLabelProps={{ shrink: true }}
          label={t("users.fields.adminComment")}
          placeholder={t("users.placeholders.adminComment")}
        />
      </Box>
    </Create>
  );
};
