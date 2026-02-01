import React, { useState } from "react";
import { Create } from "@refinedev/mui";
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
  Stack, // 👈 ВАЖНО
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { FormProvider } from "react-hook-form";
import { useTranslate, useNavigation, useNotification } from "@refinedev/core";
import { Controller } from "react-hook-form";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { axiosInstance } from "../../utility/axios-instance";

import { FormLanguageProvider } from "../../contexts/form-language";
import { LanguageTabs } from "../../components/form/language-tabs";
import { LocalizedInput } from "../../components/form/localized-input";

// ... ENUMS (TRANSMISSION_OPTIONS, FUEL_OPTIONS) оставляем как были ...
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

export const CarCreate = () => {
  const t = useTranslate();
  const { list } = useNavigation();
  const { open } = useNotification();

  // Состояние для файлов
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const methods = useForm({
    defaultValues: {
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      license_plate: "",
      vin: "",
      price_per_day: 0,
      mileage_limit_per_day: 300,
      price_per_km_over_limit: 5,
      transmission: "AUTOMATIC",
      fuel_type: "PETROL",
      status: "AVAILABLE",
      // 👇 Тут теперь пустые объекты, они заполнятся динамически
      color: {},
      description: {},
    },
    // 2. 👇 Настройки Refine (ТУТ ЖИВУТ МУТАЦИИ)
    refineCoreProps: {
      redirect: false, // Отключаем авто-редирект
      onMutationSuccess: async (data: any) => {
        const newCarId = data.data.id;

        // Если есть файлы, грузим их
        if (selectedFiles.length > 0) {
          setIsUploading(true);
          try {
            for (const file of selectedFiles) {
              const formData = new FormData();
              formData.append("file", file);

              await axiosInstance.post(`/cars/${newCarId}/images`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
            }

            open?.({
              type: "success",
              message: "Images uploaded successfully",
            });
          } catch (error) {
            console.error(error);
            open?.({
              type: "error",
              message: "Car created, but image upload failed",
              description: "Check console for details",
            });
          } finally {
            setIsUploading(false);
          }
        }

        // Редирект на список только после загрузки
        list("cars");
      },
    },
  }) as any; // as any оставляем для спокойствия

  const {
    saveButtonProps,
    register,
    control,
    formState: { errors },
  } = methods;

  // Обработчик выбора файлов
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };
  console.log("Validation Errors:", methods.formState.errors);

  return (
    <FormProvider {...methods}>
      <Create
        saveButtonProps={{ ...saveButtonProps, disabled: isUploading }}
        isLoading={isUploading}
      >
        <Box
          component="form"
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <Typography variant="h6">Basic Info</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("brand", { required: t("errors.required.field") })}
                error={!!errors.brand}
                helperText={errors.brand?.message}
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
                helperText={errors.model?.message}
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

          <Typography variant="h6">Identification & Pricing</Typography>
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
                label="Limit (km/day)"
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
                label="Over limit ($/km)"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

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
                <Typography variant="h6">Localization</Typography>

                {/* 👇 ОДНА ПАНЕЛЬ ТАБОВ НА ВСЮ СЕКЦИЮ */}
                <LanguageTabs />
              </Stack>

              <Grid container spacing={2}>
                {/* ЦВЕТ: Сам подстроится под табы */}
                <Grid item xs={12} md={6}>
                  <LocalizedInput
                    baseName="color"
                    label={t("cars.fields.color", "Color")}
                    required
                  />
                </Grid>

                {/* ОПИСАНИЕ: Сама подстроится под табы */}
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

          {/* --- ЗАГРУЗКА КАРТИНОК --- */}
          <Box
            sx={{
              p: 2,
              border: "1px dashed grey",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Images
            </Typography>

            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Select Files
              <input
                type="file"
                hidden
                multiple // 👈 Разрешаем несколько файлов
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
            {selectedFiles.length === 0 && (
              <Typography variant="body2" color="text.secondary" mt={1}>
                No files selected
              </Typography>
            )}
          </Box>
        </Box>
      </Create>
    </FormProvider>
  );
};
