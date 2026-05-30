import React from "react";
import { Edit } from "@refinedev/mui";
import {
  Box,
  TextField,
  Grid,
  Typography,
  Paper,
  Stack,
  Avatar,
  Rating,
  FormControl,
  FormHelperText,
  Chip,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { useTranslate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import StarIcon from "@mui/icons-material/Star";

export const ReviewEdit = () => {
  const t = useTranslate();

  const {
    saveButtonProps,
    refineCore: { query, formLoading },
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    refineCoreProps: { action: "edit" },
  });

  const record = query?.data?.data;

  const onFinishHandler = async (data: any) => {
    return {
      rating: data.rating,
      comment: data.comment,
    };
  };

  return (
    <Edit
      isLoading={formLoading}
      saveButtonProps={{
        ...saveButtonProps,
        onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          e.preventDefault();
          handleSubmit(onFinishHandler)();
        },
      }}
      title={t("reviews.titles.edit", "Edit Review")}
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        autoComplete="off"
      >
        {/* Read-only user & car info */}
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" mb={2} fontWeight="bold">
            {t("reviews.sections.userAndCar", "User & Car")}
          </Typography>
          {record && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={record.user?.avatar_url || undefined}
                    sx={{ width: 48, height: 48 }}
                  >
                    {record.user?.first_name?.[0]?.toUpperCase() || "?"}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {record.user?.first_name} {record.user?.last_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {record.user?.email || record.user?.id}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                {record.car ? (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={record.car?.images?.[0]?.url}
                      variant="rounded"
                      sx={{ width: 64, height: 48 }}
                    >
                      C
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        {record.car.brand} {record.car.model}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {record.car.license_plate || `#${record.car.id}`}
                      </Typography>
                    </Box>
                  </Stack>
                ) : (
                  <Chip
                    label={t("reviews.companyReview", "Company Review")}
                    variant="outlined"
                    color="info"
                  />
                )}
              </Grid>
            </Grid>
          )}
        </Paper>

        {/* Editable fields */}
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
                render={({ field }: any) => (
                  <FormControl>
                    <Typography variant="body2" gutterBottom>
                      {t("reviews.fields.rating", "Rating")} *
                    </Typography>
                    <Rating
                      value={field.value ?? record?.rating ?? 5}
                      precision={1}
                      onChange={(_, newValue) => {
                        field.onChange(newValue ?? 5);
                      }}
                      size="large"
                      icon={<StarIcon fontSize="inherit" sx={{ color: "warning.main" }} />}
                    />
                    <FormHelperText>
                      {field.value ?? record?.rating} / 5
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
                render={({ field }: any) => (
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
    </Edit>
  );
};
