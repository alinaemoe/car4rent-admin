import React from "react";
import { useShow, useTranslate } from "@refinedev/core";
import { Show, DateField } from "@refinedev/mui";
import {
  Typography,
  Stack,
  Avatar,
  Chip,
  Box,
  Divider,
  Rating,
  Paper,
  Grid,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

export const ReviewShow = () => {
  const t = useTranslate();
  const { query } = useShow() as any;
  const isLoading = query?.isLoading;
  const record = query?.data?.data;

  if (isLoading) return <div>Loading...</div>;
  if (!record) return <div>No data found</div>;

  return (
    <Show isLoading={isLoading}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        alignItems="center"
        mb={4}
      >
        <Avatar
          src={record.user?.avatar_url || undefined}
          alt={record.user?.first_name || ""}
          sx={{ width: 64, height: 64 }}
        >
          {record.user?.first_name?.[0]?.toUpperCase() || "?"}
        </Avatar>
        <Box textAlign={{ xs: "center", sm: "left" }}>
          <Typography variant="h4" fontWeight="bold">
            {record.user?.first_name} {record.user?.last_name}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            mt={1}
            justifyContent={{ xs: "center", sm: "flex-start" }}
            alignItems="center"
          >
            <Rating
              value={record.rating ?? 0}
              readOnly
              precision={0.5}
              icon={<StarIcon fontSize="inherit" sx={{ color: "warning.main" }} />}
              emptyIcon={<StarIcon fontSize="inherit" />}
            />
            <Typography variant="body2" color="text.secondary">
              ({record.rating}/5)
            </Typography>
            {record.car ? (
              <Chip
                label={`${record.car.brand} ${record.car.model}`}
                size="small"
                variant="outlined"
                color="primary"
              />
            ) : (
              <Chip
                label={t("reviews.companyReview", "Company Review")}
                size="small"
                variant="outlined"
                color="info"
              />
            )}
          </Stack>
        </Box>
      </Stack>

      <Divider />

      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t("reviews.fields.comment", "Comment")}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {record.comment || "-"}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {t("reviews.fields.id", "ID")}
              </Typography>
              <Typography variant="body1">#{record.id}</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {t("reviews.fields.createdAt", "Created At")}
              </Typography>
              <Typography variant="body1">
                <DateField value={record.created_at} format="LLL" />
              </Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {t("reviews.fields.user", "User")}
              </Typography>
              <Typography variant="body1">
                {record.user?.first_name} {record.user?.last_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {record.user?.email || record.user?.id}
              </Typography>
            </Paper>
            {record.car && (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("reviews.fields.car", "Car")}
                </Typography>
                <Typography variant="body1">
                  {record.car.brand} {record.car.model}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {record.car.license_plate || `#${record.car.id}`}
                </Typography>
              </Paper>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Show>
  );
};
