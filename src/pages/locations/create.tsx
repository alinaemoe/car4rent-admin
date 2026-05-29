import React from "react";
import { Create } from "@refinedev/mui";
import { Box, TextField, Grid, Typography, Stack } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslate } from "@refinedev/core";
import { FormProvider, useWatch, useFormContext } from "react-hook-form";
import { LocationMap } from "../../components/locations/location-map";

const CoordinatesSection = () => {
  const { setValue } = useFormContext();
  const lat = useWatch({ name: "latitude" });
  const lng = useWatch({ name: "longitude" });

  return (
    <LocationMap
      latitude={lat}
      longitude={lng}
      onLatitudeChange={(v) => setValue("latitude", v)}
      onLongitudeChange={(v) => setValue("longitude", v)}
    />
  );
};

export const LocationCreate = () => {
  const t = useTranslate();

  const methods = useForm({
    defaultValues: {
      name: "",
      address: "",
      latitude: null,
      longitude: null,
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
      title={t("locations.titles.create", "Create Location")}
    >
      <FormProvider {...methods}>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          autoComplete="off"
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight="bold">
                  {t("locations.sections.details", "Details")}
                </Typography>

                <TextField
                  {...register("name", { required: t("errors.required.field") })}
                  fullWidth
                  label={t("locations.fields.name", "Name")}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.name}
                  helperText={errors.name?.message as string}
                />

                <TextField
                  {...register("address", { required: t("errors.required.field") })}
                  fullWidth
                  label={t("locations.fields.address", "Address")}
                  variant="outlined"
                  multiline
                  rows={3}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.address}
                  helperText={errors.address?.message as string}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                {t("locations.sections.coordinates", "Coordinates")}
              </Typography>
              <CoordinatesSection />
            </Grid>
          </Grid>
        </Box>
      </FormProvider>
    </Create>
  );
};
