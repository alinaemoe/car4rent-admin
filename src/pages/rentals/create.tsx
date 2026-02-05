import React from "react";
import { Create, useAutocomplete } from "@refinedev/mui";
import { Box, TextField, Grid, Autocomplete, Alert } from "@mui/material";
import { Controller } from "react-hook-form";

import { useTranslate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
// 👇 Импорты для дат
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export const RentalCreate = () => {
  const t = useTranslate();

  const {
    saveButtonProps,
    refineCore: { formLoading },
    control,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      user_id: null,
      car_id: null,
      start_date: null,
      end_date: null,
    },
  });

  const { autocompleteProps: userAutocompleteProps } = useAutocomplete({
    resource: "users",
  });

  const { autocompleteProps: carAutocompleteProps } = useAutocomplete({
    resource: "cars",
  });

  const startDate = watch("start_date");
  const endDate = watch("end_date");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          autoComplete="off"
        >
          {/* USER & CAR */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Controller
                control={control}
                name="user_id"
                rules={{ required: t("errors.required.field") }}
                // 👇 ДОБАВИЛ : any к field
                render={({ field }: any) => (
                  <Autocomplete
                    {...userAutocompleteProps}
                    {...field}
                    // 👇 ДОБАВИЛ : any к аргументам
                    onChange={(_, value: any) => {
                      field.onChange(value?.id);
                    }}
                    getOptionLabel={(item: any) =>
                      item
                        ? `${item.first_name} ${item.last_name} (${item.email})`
                        : ""
                    }
                    isOptionEqualToValue={(option: any, value: any) =>
                      option?.id === value?.id || option?.id === value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("rentals.fields.user", "Client")}
                        margin="normal"
                        variant="outlined"
                        error={!!errors.user_id}
                        helperText={errors.user_id?.message as string}
                        required
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                control={control}
                name="car_id"
                rules={{ required: t("errors.required.field") }}
                // 👇 ДОБАВИЛ : any
                render={({ field }: any) => (
                  <Autocomplete
                    {...carAutocompleteProps}
                    {...field}
                    onChange={(_, value: any) => {
                      field.onChange(value?.id);
                    }}
                    getOptionLabel={(item: any) =>
                      item
                        ? `${item.brand} ${item.model} (${item.license_plate})`
                        : ""
                    }
                    isOptionEqualToValue={(option: any, value: any) =>
                      option?.id === value?.id || option?.id === value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("rentals.fields.car", "Car")}
                        margin="normal"
                        variant="outlined"
                        error={!!errors.car_id}
                        helperText={errors.car_id?.message as string}
                        required
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* DATES */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Controller
                control={control}
                name="start_date"
                rules={{ required: "Start date is required" }}
                // 👇 ДОБАВИЛ : any
                render={({ field }: any) => (
                  <DateTimePicker
                    label={t("rentals.fields.startDate", "Start Date")}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => {
                      field.onChange(newValue ? newValue.toISOString() : null);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: "normal",
                        error: !!errors.start_date,
                        helperText: errors.start_date?.message as string,
                        required: true,
                      },
                    }}
                    disablePast
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                control={control}
                name="end_date"
                rules={{ required: "End date is required" }}
                // 👇 ДОБАВИЛ : any
                render={({ field }: any) => (
                  <DateTimePicker
                    label={t("rentals.fields.endDate", "End Date")}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => {
                      field.onChange(newValue ? newValue.toISOString() : null);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: "normal",
                        error: !!errors.end_date,
                        helperText: errors.end_date?.message as string,
                        required: true,
                      },
                    }}
                    minDateTime={
                      startDate ? dayjs(startDate).add(1, "hour") : dayjs()
                    }
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* INFO ALERT */}
          {startDate && endDate && (
            <Alert severity="info">
              Duration: {dayjs(endDate).diff(dayjs(startDate), "day")} days
              (approx). The final price will be calculated by the server.
            </Alert>
          )}
        </Box>
      </Create>
    </LocalizationProvider>
  );
};
