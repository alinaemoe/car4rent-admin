import React from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Button,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Avatar,
  Paper,
  Autocomplete,
  Chip,
  Divider,
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslate } from "@refinedev/core";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

// НАШИ КОМПОНЕНТЫ
import { FormLanguageProvider } from "../../../contexts/form-language";
import { LanguageTabs } from "../../../components/form/language-tabs";
import { LocalizedInput } from "../../../components/form/localized-input";
import { Dictionaries } from "./index"; // Импортируем типизацию словарей

const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Available" },
  { value: "RENTED", label: "Rented" },
  { value: "MAINTENANCE", label: "Maintenance" },
];

interface DetailsTabProps {
  carData: any;
  dicts: Dictionaries;
  selectedFiles: File[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (i: number) => void;
  handleDeleteExistingImage: (id: number) => void;
  ownerProps: any;
  locationProps: any;
  featureProps: any;
}

export const CarDetailsTab: React.FC<DetailsTabProps> = ({
  carData,
  dicts,
  selectedFiles,
  handleFileChange,
  removeFile,
  handleDeleteExistingImage,
  ownerProps,
  locationProps,
  featureProps,
}) => {
  const t = useTranslate();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const companyOption = {
    id: null,
    first_name: "Company",
    last_name: "(Our Fleet)",
    email: "system",
  };
  const ownerOptions = [companyOption, ...(ownerProps?.options || [])];

  return (
    <Box
      component="form"
      autoComplete="off"
      sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 2 }}
    >
      {/* ================= BASIC INFO ================= */}
      <Paper
        variant="outlined"
        sx={{ p: 3, borderRadius: 2, bgcolor: "background.paper" }}
      >
        <Typography variant="h6" mb={3} fontWeight="bold">
          {t("cars.titles.basic_info", "Общая информация")}
        </Typography>
        <Grid container spacing={3}>
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
          <Grid item xs={6} sm={4}>
            <TextField
              {...register("year", {
                required: t("errors.required.field", "Required"),
                valueAsNumber: true,
              })}
              type="number"
              fullWidth
              label={t("cars.fields.year", "Year")}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* COLOR SELECT (with Dictionary) */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.color}>
              <InputLabel>{t("cars.fields.color", "Color")}</InputLabel>
              <Controller
                name="color"
                control={control}
                rules={{ required: t("errors.required.field", "Required") }}
                render={({ field }) => (
                  <Select {...field} label={t("cars.fields.color", "Color")}>
                    {dicts.colors.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.5}
                        >
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
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>{t("cars.fields.status", "Status")}</InputLabel>
              <Controller
                name="status"
                control={control}
                rules={{ required: t("errors.required.field", "Required") }}
                render={({ field }) => (
                  <Select {...field} label={t("cars.fields.status", "Status")}>
                    {STATUS_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {t(`cars.status.${opt.value}`, opt.label)}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* ================= TECH SPECS ================= */}
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
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register("vin", { required: true })}
              fullWidth
              label="VIN"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* BODY TYPE */}
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
                    {dicts.bodies.map((opt) => (
                      <MenuItem key={opt.id} value={opt.id}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          {/* DRIVE TYPE */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.drive_type}>
              <InputLabel>
                {t("cars.fields.drive_type", "Drive Type")}
              </InputLabel>
              <Controller
                name="drive_type"
                control={control}
                rules={{ required: t("errors.required.field", "Required") }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label={t("cars.fields.drive_type", "Drive Type")}
                  >
                    {dicts.drives.map((opt) => (
                      <MenuItem key={opt.id} value={opt.id}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          {/* TRANSMISSION */}
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
                    {dicts.transmissions.map((opt) => (
                      <MenuItem key={opt.id} value={opt.id}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          {/* FUEL */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.fuel_type}>
              <InputLabel>{t("cars.fields.fuel", "Fuel")}</InputLabel>
              <Controller
                name="fuel_type"
                control={control}
                rules={{ required: t("errors.required.field", "Required") }}
                render={({ field }) => (
                  <Select {...field} label={t("cars.fields.fuel", "Fuel")}>
                    {dicts.fuels.map((opt) => (
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

      {/* ================= PRICING ================= */}
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
                  <InputAdornment position="start">Br</InputAdornment>
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
                  <InputAdornment position="start">Br</InputAdornment>
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
              label={t("cars.fields.overlimit", "Penalty Over Limit (Br/km)")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Br</InputAdornment>
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
          <Grid item xs={12}>
            <TextField
              {...register("current_mileage", { valueAsNumber: true })}
              fullWidth
              type="number"
              label={t("cars.fields.mileage", "Current Mileage (km)")}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ================= RELATIONS ================= */}
      <Paper
        variant="outlined"
        sx={{ p: 3, borderRadius: 2, bgcolor: "background.paper" }}
      >
        <Typography variant="h6" mb={3} fontWeight="bold">
          {t("cars.sections.configuration", "Настройки связей")}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Controller
              control={control}
              name="owner"
              render={({ field }) => (
                <Autocomplete
                  {...ownerProps}
                  options={ownerOptions}
                  onChange={(_, value: any) =>
                    field.onChange(value?.id === null ? null : value)
                  }
                  value={field.value || companyOption}
                  getOptionLabel={(item: any) =>
                    item.id === null
                      ? t("cars.fields.owner.company", "🏢 Company (Our Fleet)")
                      : item.first_name
                      ? `${item.first_name} ${item.last_name} (${item.email})`
                      : ""
                  }
                  isOptionEqualToValue={(option: any, value: any) =>
                    option?.id === value?.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("cars.fields.owner.label", "Owner")}
                      variant="outlined"
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              control={control}
              name="location"
              render={({ field }) => (
                <Autocomplete
                  {...locationProps}
                  {...field}
                  onChange={(_, value) => field.onChange(value)}
                  getOptionLabel={(item: any) =>
                    item.name ? `${item.name} (${item.city || ""})` : ""
                  }
                  isOptionEqualToValue={(option: any, value: any) =>
                    option?.id === value?.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("cars.fields.location.label", "Location")}
                      variant="outlined"
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="features"
              render={({ field }) => (
                <Autocomplete
                  {...featureProps}
                  {...field}
                  multiple
                  onChange={(_, value) => field.onChange(value)}
                  getOptionLabel={(item: any) => item.name || ""}
                  isOptionEqualToValue={(option: any, value: any) =>
                    option?.id === value?.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("cars.fields.features.label", "Features")}
                      variant="outlined"
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option: any, index: number) => (
                      <Chip
                        variant="outlined"
                        label={option.name}
                        {...getTagProps({ index })}
                        key={option.id}
                      />
                    ))
                  }
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ================= LOCALIZATION ================= */}
      <Paper
        variant="outlined"
        sx={{
          p: 0,
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        <FormLanguageProvider>
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "action.hover",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight="bold">
                {t("cars.titles.description", "Описание")}
              </Typography>
              <LanguageTabs />
            </Stack>
          </Box>
          <Box sx={{ p: 3 }}>
            <LocalizedInput
              baseName="description"
              label={t("cars.fields.description", "Description")}
              multiline
              rows={5}
            />
          </Box>
        </FormLanguageProvider>
      </Paper>

      {/* ================= IMAGES ================= */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 2,
          textAlign: "center",
          bgcolor: "background.default",
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {t("cars.sections.images", "Images")}
        </Typography>

        {/* Existing Images */}
        {carData?.images?.length > 0 && (
          <Stack
            direction="row"
            spacing={2}
            mb={3}
            overflow="auto"
            sx={{ pb: 1 }}
          >
            {carData.images.map((img: any) => (
              <Paper
                key={img.id}
                variant="outlined"
                sx={{
                  position: "relative",
                  minWidth: 120,
                  p: 1,
                  display: "flex",
                  justifyContent: "center",
                  bgcolor: "background.paper",
                }}
              >
                <Avatar
                  src={img.url}
                  variant="rounded"
                  sx={{ width: 100, height: 80 }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleDeleteExistingImage(img.id)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 28,
                    height: 28,
                    bgcolor: "rgba(0, 0, 0, 0.6)",
                    color: "#fff",
                    "&:hover": { bgcolor: "rgba(0, 0, 0, 0.9)" },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Paper>
            ))}
          </Stack>
        )}

        <Button
          component="label"
          variant="contained"
          size="large"
          startIcon={<CloudUploadIcon />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            mb: selectedFiles.length > 0 ? 3 : 0,
          }}
        >
          {t("buttons.addNewPhotos", "Add New Photos")}
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>

        {/* New Files */}
        {selectedFiles.length > 0 && (
          <List
            dense
            sx={{
              maxWidth: 500,
              mx: "auto",
              bgcolor: "background.paper",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {selectedFiles.map((file, index) => (
              <React.Fragment key={index}>
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => removeFile(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={file.name}
                    secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                    primaryTypographyProps={{ fontWeight: "500" }}
                  />
                </ListItem>
                {index < selectedFiles.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};
