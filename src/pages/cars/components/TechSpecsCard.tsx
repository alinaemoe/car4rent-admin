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
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslate } from "@refinedev/core";

interface DictItem {
  id: string;
  label: string;
}

interface Props {
  transmissionsDict: DictItem[];
  fuelsDict: DictItem[];
  bodiesDict: DictItem[]; // 👈 Добавили
  drivesDict: DictItem[]; // 👈 Добавили
}

export const TechSpecsCard = ({
  transmissionsDict,
  fuelsDict,
  bodiesDict,
  drivesDict,
}: Props) => {
  const t = useTranslate();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, borderRadius: 2, bgcolor: "background.paper" }}
    >
      <Typography variant="h6" mb={3} fontWeight="bold">
        {t("cars.titles.tech_specs", "Технические характеристики")}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register("license_plate", { required: true })}
            fullWidth
            label={t("cars.fields.plate", "License Plate")}
            InputLabelProps={{ shrink: true }}
            error={!!errors.license_plate}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register("vin", { required: true })}
            fullWidth
            label="VIN"
            InputLabelProps={{ shrink: true }}
            error={!!errors.vin}
          />
        </Grid>

        {/* 👇 ТИП КУЗОВА */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.body_type}>
            <InputLabel>{t("cars.fields.body_type", "Body Type")}</InputLabel>
            <Controller
              name="body_type"
              control={control}
              rules={{ required: t("errors.required.field", "Required") }}
              render={({ field }) => (
                <Select
                  {...field}
                  label={t("cars.fields.body_type", "Body Type")}
                >
                  {bodiesDict.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        {/* 👇 ТИП ПРИВОДА */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.drive_type}>
            <InputLabel>{t("cars.fields.drive_type", "Drive Type")}</InputLabel>
            <Controller
              name="drive_type"
              control={control}
              rules={{ required: t("errors.required.field", "Required") }}
              render={({ field }) => (
                <Select
                  {...field}
                  label={t("cars.fields.drive_type", "Drive Type")}
                >
                  {drivesDict.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.transmission}>
            <InputLabel>
              {t("cars.fields.transmission", "Transmission")}
            </InputLabel>
            <Controller
              name="transmission"
              control={control}
              rules={{ required: t("errors.required.field", "Required") }}
              render={({ field }) => (
                <Select
                  {...field}
                  label={t("cars.fields.transmission", "Transmission")}
                >
                  {transmissionsDict.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.fuel_type}>
            <InputLabel>{t("cars.fields.fuel", "Fuel")}</InputLabel>
            <Controller
              name="fuel_type"
              control={control}
              rules={{ required: t("errors.required.field", "Required") }}
              render={({ field }) => (
                <Select {...field} label={t("cars.fields.fuel", "Fuel")}>
                  {fuelsDict.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};
