import React from "react";
import { Create, useAutocomplete } from "@refinedev/mui";
import {
  Box,
  TextField,
  Grid,
  Autocomplete,
  Typography,
  Paper,
  Stack,
  Rating,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { useTranslate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

export const ReviewCreate = () => {
  const t = useTranslate();

  const {
    saveButtonProps,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user_id: null,
      car_id: null,
      rating: 5,
      comment: "",
    },
  });

  const { autocompleteProps: userAutocompleteProps } = useAutocomplete({
    resource: "users",
  });

  const { autocompleteProps: carAutocompleteProps } = useAutocomplete({
    resource: "cars",
  });

  return (
    <Create
      saveButtonProps={saveButtonProps}
      title={t("reviews.titles.create", "Create Review")}
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        autoComplete="off"
      >
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" mb={2} fontWeight="bold">
            {t("reviews.sections.userAndCar", "User & Car")}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                control={control}
                name="user_id"
                rules={{ required: t("errors.required.field") }}
                render={({ field }: any) => (
                  <Autocomplete
                    {...userAutocompleteProps}
                    {...field}
                    onChange={(_, value: any) => {
                      field.onChange(value?.id ?? null);
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
                        label={t("reviews.fields.user", "User")}
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
                render={({ field }: any) => (
                  <Autocomplete
                    {...carAutocompleteProps}
                    {...field}
                    onChange={(_, value: any) => {
                      field.onChange(value?.id ?? null);
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
                        label={t("reviews.fields.car", "Car")}
                        margin="normal"
                        variant="outlined"
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" mb={2} fontWeight="bold">
            {t("reviews.sections.review", "Review")}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                control={control}
                name="rating"
                rules={{ required: t("errors.required.field") }}
                render={({ field }) => (
                  <FormControl>
                    <Typography variant="body2" gutterBottom>
                      {t("reviews.fields.rating", "Rating")} *
                    </Typography>
                    <Rating
                      value={field.value ?? 5}
                      precision={1}
                      onChange={(_, newValue) => {
                        field.onChange(newValue ?? 5);
                      }}
                      size="large"
                    />
                    <FormHelperText>
                      {field.value}/{t("reviews.ratingOutOf", "5")}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                control={control}
                name="comment"
                rules={{ required: t("errors.required.field") }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    label={t("reviews.fields.comment", "Comment")}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.comment}
                    helperText={errors.comment?.message as string}
                    required
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Create>
  );
};
