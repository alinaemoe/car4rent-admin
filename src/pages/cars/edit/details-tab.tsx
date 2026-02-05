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
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslate } from "@refinedev/core";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

// НАШИ КОМПОНЕНТЫ
import { FormLanguageProvider } from "../../../contexts/form-language";
import { LanguageTabs } from "../../../components/form/language-tabs";
import { LocalizedInput } from "../../../components/form/localized-input";

// CONSTANTS
const TRANSMISSION_OPTIONS = [
  { value: "AUTOMATIC", label: "Automatic" },
  { value: "MANUAL", label: "Manual" },
  { value: "ROBOT", label: "Robot" },
];

const FUEL_OPTIONS = [
  { value: "PETROL", label: "Petrol" },
  { value: "DIESEL", label: "Diesel" },
  { value: "ELECTRIC", label: "Electric" },
  { value: "HYBRID", label: "Hybrid" },
];

const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Available" },
  { value: "RENTED", label: "Rented" },
  { value: "MAINTENANCE", label: "Maintenance" },
];

interface DetailsTabProps {
  carData: any;
  selectedFiles: File[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (i: number) => void;
  handleDeleteExistingImage: (id: number) => void;
  ownerProps: any;
  locationProps: any;
  featureProps: any;
}

export const CarDetailsTab = ({
  carData,
  selectedFiles,
  handleFileChange,
  removeFile,
  handleDeleteExistingImage,
  ownerProps,
  locationProps,
  featureProps,
}: DetailsTabProps) => {
  const t = useTranslate();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  // Логика для "Компании" в селекте владельца
  const companyOption = {
    id: null,
    first_name: "Company",
    last_name: "(Our Fleet)",
    email: "system",
  };
  const ownerOptions = [companyOption, ...(ownerProps?.options || [])] as any[];

  return (
    <Box
      component="form"
      autoComplete="off"
      sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}
    >
      {/* ================= BASIC INFO ================= */}
      <Typography variant="h6">
        {t("cars.sections.basicInfo", "Basic Info")}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register("brand", { required: t("errors.required.field") })}
            error={!!errors.brand}
            helperText={errors.brand?.message as string}
            fullWidth
            label={t("cars.fields.brand", "Brand")}
            placeholder="BMW"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register("model", { required: t("errors.required.field") })}
            error={!!errors.model}
            helperText={errors.model?.message as string}
            fullWidth
            label={t("cars.fields.model", "Model")}
            placeholder="X5"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            {...register("year", {
              required: t("errors.required.field"),
              valueAsNumber: true,
              min: { value: 1900, message: "Invalid year" },
            })}
            type="number"
            fullWidth
            label={t("cars.fields.year", "Year")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <FormControl fullWidth>
            <InputLabel>
              {t("cars.fields.transmission", "Transmission")}
            </InputLabel>
            <Controller
              name="transmission"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label={t("cars.fields.transmission", "Transmission")}
                >
                  {TRANSMISSION_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>{t("cars.fields.fuel", "Fuel")}</InputLabel>
            <Controller
              name="fuel_type"
              control={control}
              render={({ field }) => (
                <Select {...field} label={t("cars.fields.fuel", "Fuel")}>
                  {FUEL_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
      </Grid>

      {/* ================= IDENTIFICATION & PRICING ================= */}
      <Typography variant="h6">
        {t("cars.sections.pricing", "Identification & Pricing")}
      </Typography>
      <Grid container spacing={2}>
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
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            {...register("mileage_limit_per_day", { valueAsNumber: true })}
            fullWidth
            type="number"
            label={t("cars.fields.mileageLimit", "Limit (km/day)")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            {...register("price_per_km_over_limit", { valueAsNumber: true })}
            fullWidth
            type="number"
            label={t("cars.fields.overLimitPrice", "Over limit ($/km)")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        {/* Current Mileage */}
        <Grid item xs={6}>
          <TextField
            {...register("current_mileage", { valueAsNumber: true })}
            fullWidth
            type="number"
            label="Current Mileage (km)"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        {/* Status */}
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>{t("cars.fields.status", "Status")}</InputLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select {...field} label={t("cars.fields.status", "Status")}>
                  {STATUS_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
      </Grid>

      {/* ================= RELATIONS (ВОТ ТУТ МЫ ИСПОЛЬЗУЕМ PROPS) ================= */}
      <Typography variant="h6">
        {t("cars.sections.configuration", "Configuration & Relations")}
      </Typography>
      <Grid container spacing={2}>
        {/* OWNER */}
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="owner"
            render={({ field }) => (
              <Autocomplete
                {...ownerProps}
                options={ownerOptions} // Передаем наши опции с Компанией
                {...field}
                onChange={(_, value: any) => {
                  if (value?.id === null) field.onChange(null);
                  else field.onChange(value);
                }}
                value={field.value || companyOption}
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

        {/* LOCATION */}
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
                  option.id === value?.id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("cars.fields.location.label", "Location")}
                    placeholder={t(
                      "cars.fields.location.placeholder",
                      "Select Location",
                    )}
                    variant="outlined"
                  />
                )}
              />
            )}
          />
        </Grid>

        {/* FEATURES */}
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
                    placeholder={t(
                      "cars.fields.features.placeholder",
                      "Select Features",
                    )}
                    variant="outlined"
                  />
                )}
                // Рендерим выбранные элементы как Chip (таблички)
                renderTags={(value, getTagProps) =>
                  value.map((option: any, index: number) => (
                    <Chip
                      variant="outlined"
                      label={option.name}
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />
            )}
          />
        </Grid>
      </Grid>

      {/* ================= LOCALIZATION ================= */}
      <FormLanguageProvider>
        <Box
          sx={{
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">
              {t("cars.sections.localization", "Localization")}
            </Typography>
            <LanguageTabs />
          </Stack>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <LocalizedInput
                baseName="color"
                label={t("cars.fields.color", "Color")}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizedInput
                baseName="description"
                label={t("cars.fields.description", "Description")}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </Box>
      </FormLanguageProvider>

      {/* ================= IMAGES (ВОТ ТУТ МЫ ИСПОЛЬЗУЕМ carData и handleDelete) ================= */}
      <Box
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">
          {t("cars.sections.images", "Images")}
        </Typography>

        {/* СУЩЕСТВУЮЩИЕ ФОТО */}
        {carData?.images?.length > 0 && (
          <Stack direction="row" spacing={2} mb={3} overflow="auto">
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
                    borderRadius: "50%",
                    padding: "4px",
                    zIndex: 10,
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.9)",
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Paper>
            ))}
          </Stack>
        )}

        {/* ЗАГРУЗКА НОВЫХ */}
        <Box
          sx={{
            p: 2,
            border: "1px dashed grey",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
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

          <List dense sx={{ mt: 2, maxWidth: 400, mx: "auto" }}>
            {selectedFiles.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" onClick={() => removeFile(index)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024).toFixed(0)} KB`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};
