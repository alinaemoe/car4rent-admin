import React from "react";
import { Edit } from "@refinedev/mui";
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
  Avatar,
  Typography,
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslate } from "@refinedev/core";
import { Controller } from "react-hook-form";

export const UserEdit = () => {
  const t = useTranslate();

  const {
    saveButtonProps,
    refineCore: { queryResult },
    register,
    control,
    formState: { errors },
    // 👇 РЕШЕНИЕ: Убираем <...>, добавляем 'as any' в конце
  } = useForm({
    defaultValues: {
      status: "ACTIVE",
      roles: ["CLIENT"],
      is_email_verified: false, // 👈
      is_documents_verified: false, // 👈
    },
  }) as any; // 👈 ВОТ ТУТ МАГИЯ, КОТОРАЯ ЗАТЫКАЕТ TS

  const userData = queryResult?.data?.data;

  return (
    <Edit saveButtonProps={saveButtonProps}>
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
        {/* ===== HEADER / USER INFO ===== */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={userData?.avatar_url}
            alt={userData?.first_name}
            sx={{ width: 64, height: 64 }}
          />
          <Box>
            <Typography variant="h6">
              {userData ? `${userData.first_name} ${userData.last_name}` : "—"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userData ? `ID: ${userData.id} • ${userData.email}` : "—"}
            </Typography>
          </Box>
        </Stack>

        {/* ===== NAMES ===== */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            // 👇 TS больше не ругается, так как useForm<any>
            {...register("first_name", {
              required: t("errors.required.field"),
            })}
            error={!!errors.first_name}
            helperText={errors.first_name?.message as string}
            fullWidth
            InputLabelProps={{ shrink: true }}
            label={t("users.fields.firstName")}
          />

          <TextField
            {...register("last_name", {
              required: t("errors.required.field"),
            })}
            error={!!errors.last_name}
            helperText={errors.last_name?.message as string}
            fullWidth
            InputLabelProps={{ shrink: true }}
            label={t("users.fields.lastName")}
          />
        </Stack>

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
    </Edit>
  );
};
