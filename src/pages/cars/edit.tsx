import React, { useState } from "react";
import { Edit, useAutocomplete } from "@refinedev/mui";
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
// 👇 ПРАВИЛЬНЫЙ ИМПОРТ
import { useForm } from "@refinedev/react-hook-form";
import { FormProvider } from "react-hook-form";
import {
  useTranslate,
  useNavigation,
  useNotification,
  useInvalidate,
} from "@refinedev/core";
import { Controller } from "react-hook-form";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { axiosInstance } from "../../utility/axios-instance";

// НАШИ КОМПОНЕНТЫ
import { FormLanguageProvider } from "../../contexts/form-language";
import { LanguageTabs } from "../../components/form/language-tabs";
import { LocalizedInput } from "../../components/form/localized-input";

// ENUMS
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

export const CarEdit = () => {
  const t = useTranslate();
  const { list } = useNavigation();
  const { open } = useNotification();

  const invalidate = useInvalidate();

  // Состояние для НОВЫХ файлов
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { autocompleteProps: ownerAutocompleteProps } = useAutocomplete({
    resource: "users",
    // ❌ УДАЛЯЕМ ОТСЮДА optionLabel
  });

  const companyOption = {
    id: null,
    first_name: "Company",
    last_name: "(Our Fleet)",
    email: "system",
    is_company: true,
  };

  // Мерджим опции: Сначала Компания, потом список юзеров
  const ownerOptions = [
    companyOption,
    ...(ownerAutocompleteProps.options || []),
  ];

  // Локации (Locations)
  const { autocompleteProps: locationAutocompleteProps } = useAutocomplete({
    resource: "locations",
    // ❌ УДАЛЯЕМ ОТСЮДА optionLabel
  });

  // Фичи (Features)
  const { autocompleteProps: featureAutocompleteProps } = useAutocomplete({
    resource: "features",
    // ❌ УДАЛЯЕМ ОТСЮДА optionLabel
  });

  // 👇 Инициализация формы
  const methods = useForm({
    // Refine сам подтянет данные из API (GET /cars/:id) и заполнит форму.
    // Нам не нужны defaultValues, так как это Edit.
    refineCoreProps: {
      redirect: false, // Не уходим, пока не загрузим фото
      onMutationSuccess: async (data: any) => {
        const carId = data.data.id;

        // Если выбрали НОВЫЕ файлы, грузим их
        if (selectedFiles.length > 0) {
          setIsUploading(true);
          try {
            for (const file of selectedFiles) {
              const formData = new FormData();
              formData.append("file", file);
              await axiosInstance.post(`/cars/${carId}/images`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
            }
            open?.({
              type: "success",
              message: "New images uploaded",
            });
          } catch (error) {
            console.error(error);
            open?.({
              type: "error",
              message: "Error uploading images",
            });
          } finally {
            setIsUploading(false);
          }
        }

        // Редирект
        list("cars");
      },
    },
  }) as any;

  // Деструктурируем методы
  const {
    saveButtonProps,
    register,
    control,
    formState: { errors },
    refineCore: { query }, // 👇 Достаем данные, чтобы показать СУЩЕСТВУЮЩИЕ картинки
  } = methods;

  const carData = query?.data?.data;

  // Обработчики файлов
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDeleteExistingImage = async (imageId: number) => {
    try {
      // 1. Вызываем DELETE через твой axiosInstance
      // Он сам подставит BaseURL и Auth Token
      await axiosInstance.delete(`/cars/images/${imageId}`);

      // 2. Показываем успех
      open?.({
        type: "success",
        message: "Image deleted",
      });

      // 3. Обновляем данные на странице (чтобы картинка исчезла визуально)
      invalidate({
        resource: "cars",
        invalidates: ["detail"],
        id: carData?.id,
      });
    } catch (error) {
      console.error("Delete error:", error);
      open?.({
        type: "error",
        message: "Error deleting image",
      });
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <FormProvider {...methods}>
      <Edit
        saveButtonProps={{ ...saveButtonProps, disabled: isUploading }}
        isLoading={isUploading}
      >
        <Box
          component="form"
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          {/* --- 1. BASIC INFO --- */}
          <Typography variant="h6">
            {t("cars.sections.basicInfo", "Basic Info")}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("brand", { required: t("errors.required.field") })}
                error={!!errors.brand}
                helperText={errors.brand?.message}
                fullWidth
                label={t("cars.fields.brand", "Brand")}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("model", { required: t("errors.required.field") })}
                error={!!errors.model}
                helperText={errors.model?.message}
                fullWidth
                label={t("cars.fields.model", "Model")}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                {...register("year", {
                  required: t("errors.required.field"),
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
                <InputLabel>{t("cars.fields.transmission")}</InputLabel>
                <Controller
                  name="transmission"
                  defaultValue=""
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label={t("cars.fields.transmission")}>
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
                <InputLabel>{t("cars.fields.fuel")}</InputLabel>
                <Controller
                  name="fuel_type"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select {...field} label={t("cars.fields.fuel")}>
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

          {/* --- 2. IDENTIFICATION & PRICING --- */}
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
                {...register("price_per_km_over_limit", {
                  valueAsNumber: true,
                })}
                fullWidth
                type="number"
                label={t("cars.fields.overLimitPrice", "Over limit ($/km)")}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {/* Добавляем статус для редактирования */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t("cars.fields.status", "Status")}</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      label={t("cars.fields.status", "Status")}
                    >
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

          <Typography variant="h6">
            {t("cars.sections.configuration", "Configuration & Relations")}
          </Typography>
          <Grid container spacing={2}>
            {/* OWNER (Autocomplete) */}
            <Grid item xs={12} md={6}>
              <Controller
                control={control}
                name="owner"
                render={({ field }) => (
                  <Autocomplete
                    {...ownerAutocompleteProps} // Это перепишет options, поэтому...
                    options={ownerOptions} // ...передаем наш расширенный список ЯВНО
                    {...field}
                    onChange={(_, value) => {
                      // Если выбрали "Компанию" (id: null), передаем null в форму
                      if (value?.id === null) {
                        field.onChange(null);
                      } else {
                        field.onChange(value);
                      }
                    }}
                    // Подсвечиваем выбранное значение
                    value={field.value || companyOption} // Если value null, показываем "Company"
                    getOptionLabel={(item: any) => {
                      if (item.id === null)
                        return `🏢 ${t(
                          "cars.fields.owner.company",
                          "Company (Our Fleet)",
                        )}`;
                      return item.first_name
                        ? `${item.first_name} ${item.last_name} (${item.email})`
                        : "";
                    }}
                    isOptionEqualToValue={(option, value) => {
                      // Сравниваем ID (у компании он null)
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

            {/* LOCATION (Autocomplete) */}
            <Grid item xs={12} md={6}>
              <Controller
                control={control}
                name="location"
                render={({ field }) => (
                  <Autocomplete
                    {...locationAutocompleteProps}
                    {...field}
                    onChange={(_, value) => {
                      field.onChange(value);
                    }}
                    getOptionLabel={(item: any) =>
                      item.name ? `${item.name} (${item.city})` : ""
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
                    isOptionEqualToValue={(option, value) =>
                      option.id === value?.id
                    }
                  />
                )}
              />
            </Grid>

            {/* FEATURES (Multi-Select Autocomplete) */}
            <Grid item xs={12}>
              <Controller
                control={control}
                name="features"
                render={({ field }) => (
                  <Autocomplete
                    {...featureAutocompleteProps}
                    {...field}
                    multiple // 👈 Множественный выбор
                    onChange={(_, value) => {
                      field.onChange(value);
                    }}
                    getOptionLabel={(item: any) => item.name || ""}
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
                    renderTags={(value, getTagProps) =>
                      value.map((option: any, index: number) => (
                        <Chip
                          variant="outlined"
                          label={option.name} // Предполагаем, что у фичи есть поле name
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.id === value?.id
                    }
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* --- 3. LOCALIZATION --- */}
          {/* Оборачиваем в провайдер языка */}
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
                    required // Будет требовать только для дефолтного языка
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

          {/* --- 4. IMAGES --- */}
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

                    {/* 👇 ВОТ ОНА, КНОПКА УДАЛЕНИЯ */}
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
      </Edit>
    </FormProvider>
  );
};
