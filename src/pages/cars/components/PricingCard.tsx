import React from "react";
import {
  Grid,
  TextField,
  InputAdornment,
  Typography,
  Paper,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useTranslate } from "@refinedev/core";

export const PricingCard = () => {
  const t = useTranslate();
  const { register } = useFormContext();

  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, borderRadius: 2, bgcolor: "background.paper" }}
    >
      <Typography variant="h6" mb={3} fontWeight="bold">
        {t("cars.titles.pricing", "Финансы и Условия")}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            {...register("price_per_day", {
              required: true,
              valueAsNumber: true,
            })}
            fullWidth
            type="number"
            label={t("cars.fields.price", "Price / Day")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₽</InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            {...register("deposit_amount", { valueAsNumber: true })}
            fullWidth
            type="number"
            label={t("cars.fields.deposit", "Deposit")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₽</InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            {...register("insurance_type")}
            fullWidth
            label={t("cars.fields.insurance", "Insurance Type")}
            placeholder="ОСАГО / КАСКО"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            {...register("mileage_limit_per_day", { valueAsNumber: true })}
            fullWidth
            type="number"
            label={t("cars.fields.limit", "Mileage Limit (km/day)")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register("price_per_km_over_limit", { valueAsNumber: true })}
            fullWidth
            type="number"
            label={t("cars.fields.overlimit", "Penalty Over Limit (₽/km)")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₽</InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            {...register("min_age", { valueAsNumber: true })}
            fullWidth
            type="number"
            label={t("cars.fields.min_age", "Min Age")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            {...register("min_experience", { valueAsNumber: true })}
            fullWidth
            type="number"
            label={t("cars.fields.min_exp", "Min Experience (years)")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
