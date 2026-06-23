import React, { useState, useEffect } from "react";
import { Create } from "@refinedev/mui";
import { Box, CircularProgress, Alert } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { FormProvider, FieldValues } from "react-hook-form";
import { useTranslate, useNavigation, useNotification } from "@refinedev/core";
import { useSearchParams } from "react-router-dom";

import { axiosInstance } from "../../utility/axios-instance";

// Импорт карточек-компонентов
import { BasicInfoCard } from "./components/BasicInfoCard";
import { TechSpecsCard } from "./components/TechSpecsCard";
import { PricingCard } from "./components/PricingCard";
import { ImagesCard } from "./components/ImagesCard";
import { DescriptionCard } from "./components/DescriptionCard";

// Типизация словарей
interface DictItem {
  id: string;
  label: string;
  hex?: string;
}

interface Dictionaries {
  colors: DictItem[];
  transmissions: DictItem[];
  fuels: DictItem[];
  bodies: DictItem[]; // 👈
  drives: DictItem[]; // 👈
}

export const CarCreate: React.FC = () => {
  const t = useTranslate();
  const { list } = useNavigation();
  const { open } = useNotification();
  const [searchParams] = useSearchParams();

  // 1. Инициализация параметров из URL (переход из заявки)
  const reqBrand = searchParams.get("brand") || "";
  const reqModel = searchParams.get("model") || "";
  const parsedYear = Number(searchParams.get("year"));
  const reqYear =
    !isNaN(parsedYear) && parsedYear > 1900
      ? parsedYear
      : new Date().getFullYear();
  const reqOwnerId = searchParams.get("owner_id") || null;

  const reqPhotosParam = searchParams.get("photos");
  const reqPhotos = reqPhotosParam ? reqPhotosParam.split(",") : [];

  // 2. Стейты
  const [existingPhotos, setExistingPhotos] = useState<string[]>(reqPhotos);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [dicts, setDicts] = useState<Dictionaries>({
    colors: [],
    transmissions: [],
    fuels: [],
    bodies: [], // 👈
    drives: [], // 👈
  });
  const [isLoadingDicts, setIsLoadingDicts] = useState<boolean>(true);

  // 3. Загрузка словарей из API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axiosInstance.get("/settings");

        // Безопасный парсинг JSON
        const parseKV = (key: string): DictItem[] => {
          const setting = data.find(
            (s: { key: string; value: string }) => s.key === key,
          );
          if (!setting) return [];
          try {
            return JSON.parse(setting.value);
          } catch (e) {
            console.error(`Error parsing setting ${key}:`, e);
            return [];
          }
        };

        setDicts({
          colors: parseKV("DICT_COLORS"),
          transmissions: parseKV("DICT_TRANSMISSIONS"),
          fuels: parseKV("DICT_FUEL_TYPES"),
          bodies: parseKV("DICT_BODY_TYPES"), // 👈
          drives: parseKV("DICT_DRIVE_TYPES"), // 👈
        });
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        open?.({
          type: "error",
          message: t(
            "cars.messages.dicts_failed",
            "Failed to load settings dictionaries",
          ),
        });
      } finally {
        setIsLoadingDicts(false);
      }
    };
    fetchSettings();
  }, [open, t]);

  // 4. Инициализация формы
  const methods = useForm<FieldValues, any, FieldValues>({
    defaultValues: {
      brand: reqBrand,
      model: reqModel,
      year: reqYear,
      owner: reqOwnerId ? { id: reqOwnerId } : null,
      license_plate: "",
      vin: "",
      color: "",
      transmission: "",
      fuel_type: "",
      price_per_day: 0,
      deposit_amount: 0,
      mileage_limit_per_day: 250,
      price_per_km_over_limit: 15,
      current_mileage: 0,
      min_age: 21,
      min_experience: 2,
      insurance_type: "КАСКО",
      status: "AVAILABLE",
      description: {},
      body_type: "",
      drive_type: "",
    },
    refineCoreProps: {
      redirect: false, // Отключаем стандартный редирект, так как нам нужно догрузить фото
      onMutationSuccess: async (response) => {
        // Ожидаем, что бэкенд возвращает созданный объект машины
        const newCarId = response?.data?.id;

        if (newCarId && selectedFiles.length > 0) {
          setIsUploading(true);
          try {
            // Загрузка файлов по одному
            for (const file of selectedFiles) {
              const formData = new FormData();
              formData.append("file", file);
              await axiosInstance.post(`/cars/${newCarId}/images`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
            }
            open?.({
              type: "success",
              message: t(
                "cars.messages.images_uploaded",
                "Images uploaded successfully",
              ),
            });
          } catch (error) {
            console.error("Image upload error:", error);
            open?.({
              type: "error",
              message: t(
                "cars.messages.images_failed",
                "Car created, but image upload failed",
              ),
            });
          } finally {
            setIsUploading(false);
          }
        }

        // После успешного создания и загрузки фото возвращаемся к списку
        list("cars");
      },
    },
  });

  const { saveButtonProps, handleSubmit, refineCore } = methods;

  // 5. Перехватчик отправки формы
  const onFinishHandler = async (data: FieldValues) => {
    const payload: Record<string, any> = { ...data };

    // 🔧 Привязка владельца. Приоритет — явный выбор в форме (data.owner.id).
    // Но если машина создаётся ИЗ ЗАЯВКИ ПАРТНЁРА (в URL пришёл owner_id),
    // используем reqOwnerId как надёжный фолбэк — чтобы id владельца не терялся,
    // даже если Autocomplete не успел подставить значение из загруженных опций.
    // Именно из-за этой потери машина раньше создавалась с owner=null
    // ("Our Fleet") вместо партнёра, и "Мой автопарк" в мобилке оставался пустым.
    const ownerId = data.owner?.id ?? reqOwnerId ?? null;
    payload.owner = ownerId ? { id: ownerId } : null;

    // Прикрепляем уже загруженные фото из заявки
    if (existingPhotos.length > 0) {
      payload.existing_images = existingPhotos;
    }

    // Отправляем модифицированные данные в Refine
    await refineCore.onFinish(payload);
  };

  // 6. Хендлеры для файлов
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const removeExistingPhoto = (indexToRemove: number) => {
    setExistingPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Экран загрузки словарей
  if (isLoadingDicts) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <FormProvider {...methods}>
      <Create
        // Правильное переопределение кнопки сохранения
        saveButtonProps={{
          ...saveButtonProps,
          disabled: isUploading || saveButtonProps.disabled,
          onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault(); // Предотвращаем стандартное поведение
            handleSubmit(onFinishHandler)(); // Вызываем RHF handleSubmit с нашим кастомным методом
          },
        }}
        isLoading={isUploading}
      >
        <Box
          component="form"
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column", gap: 4 }}
        >
          {/* Информационный алерт, если машина создается из заявки */}
          {reqOwnerId && (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              {t(
                "cars.messages.from_request",
                "Автомобиль создается на основе заявки партнера. Владелец уже привязан.",
              )}
            </Alert>
          )}

          {/* Карточки разделены по смысловым блокам */}
          <BasicInfoCard colorsDict={dicts.colors} reqOwnerId={reqOwnerId} />

          <TechSpecsCard
            transmissionsDict={dicts.transmissions}
            fuelsDict={dicts.fuels}
            bodiesDict={dicts.bodies} // 👈
            drivesDict={dicts.drives} // 👈
          />

          <PricingCard />

          <DescriptionCard />

          <ImagesCard
            selectedFiles={selectedFiles}
            existingPhotos={existingPhotos}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
            removeExistingPhoto={removeExistingPhoto}
          />
        </Box>
      </Create>
    </FormProvider>
  );
};
