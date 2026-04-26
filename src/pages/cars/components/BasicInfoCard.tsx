import React from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Stack,
  Box,
  Autocomplete,
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslate } from "@refinedev/core";
import { useAutocomplete } from "@refinedev/mui"; // 👈 Добавили

interface DictItem {
  id: string;
  label: string;
  hex?: string;
}

interface Props {
  colorsDict: DictItem[];
  reqOwnerId: string | null; // Передаем ID из заявки, чтобы подгрузить этого юзера
}

export const BasicInfoCard = ({ colorsDict, reqOwnerId }: Props) => {
  const t = useTranslate();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  // 👇 НАСТРАИВАЕМ AUTOCOMPLETE ДЛЯ ВЛАДЕЛЬЦЕВ
  const { autocompleteProps: ownerProps } = useAutocomplete({
    resource: "users",
    defaultValue: reqOwnerId || undefined, // Чтобы Refine скачал данные партнера сразу
  });

  const companyOption = {
    id: null,
    first_name: "Company",
    last_name: "(Our Fleet)",
    email: "system",
  };

  // Склеиваем опцию компании и юзеров с бэкенда
  const ownerOptions = [companyOption, ...(ownerProps?.options || [])] as any[];

  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, borderRadius: 2, bgcolor: "background.paper" }}
    >
      <Typography variant="h6" mb={3} fontWeight="bold">
        {t("cars.titles.basic_info", "Общая информация")}
      </Typography>
      <Grid container spacing={3}>
        {/* ВЛАДЕЛЕЦ АВТО */}
        <Grid item xs={12}>
          <Controller
            name="owner"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...ownerProps}
                options={ownerOptions}
                onChange={(_, value: any) => {
                  if (value?.id === null) field.onChange(null);
                  else field.onChange(value); // Записываем весь объект
                }}
                value={field.value || companyOption} // По умолчанию Company
                getOptionLabel={(item: any) => {
                  if (item.id === null) return "🏢 Company (Our Fleet)";
                  return item.first_name
                    ? `${item.first_name} ${item.last_name} (${item.email})`
                    : "";
                }}
                isOptionEqualToValue={(option: any, value: any) => {
                  return option?.id === value?.id;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("cars.fields.owner.label", "Owner")}
                    placeholder={t(
                      "cars.fields.owner.placeholder",
                      "Select User",
                    )}
                    variant="outlined"
                    helperText={t(
                      "cars.fields.owner.helperText",
                      "Who owns this car?",
                    )}
                  />
                )}
              />
            )}
          />
        </Grid>

        {/* ... ОСТАЛЬНЫЕ ИНПУТЫ ИЗ ПРОШЛОГО РАЗА ... */}
        <Grid item xs={12} sm={4}>
          <TextField
            {...register("brand", {
              required: t("errors.required.field", "Required"),
            })}
            error={!!errors.brand}
            helperText={errors.brand?.message as string}
            fullWidth
            label={t("cars.fields.brand", "Brand")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            {...register("model", {
              required: t("errors.required.field", "Required"),
            })}
            error={!!errors.model}
            helperText={errors.model?.message as string}
            fullWidth
            label={t("cars.fields.model", "Model")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            {...register("year", { required: true, valueAsNumber: true })}
            type="number"
            fullWidth
            label={t("cars.fields.year", "Year")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.color}>
            <InputLabel>{t("cars.fields.color", "Color")}</InputLabel>
            <Controller
              name="color"
              control={control}
              rules={{ required: t("errors.required.field", "Required") }}
              render={({ field }) => (
                <Select {...field} label={t("cars.fields.color", "Color")}>
                  {colorsDict.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            bgcolor: c.hex,
                            borderRadius: "50%",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                        <Typography>{c.label}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            {...register("current_mileage", { valueAsNumber: true })}
            type="number"
            fullWidth
            label={t("cars.fields.mileage", "Current Mileage (km)")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
