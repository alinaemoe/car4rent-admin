import React, { useState, useEffect } from "react";
import { Edit, useAutocomplete } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { FormProvider, FieldValues } from "react-hook-form";
import {
  useNavigation,
  useNotification,
  useInvalidate,
  useTranslate,
} from "@refinedev/core";
import { Box, Tabs, Tab, CircularProgress } from "@mui/material";
import CarCrashIcon from "@mui/icons-material/CarCrash";
import EditIcon from "@mui/icons-material/Edit";

import { axiosInstance } from "../../../utility/axios-instance";
import {
  CustomTabPanel,
  a11yProps,
} from "../../../components/common/custom-tab-panel";

// Импортируем табы
import { CarDetailsTab } from "./details-tab";
import { CarDamagesTab } from "./damages-tab";

// Типизация словарей
export interface DictItem {
  id: string;
  label: string;
  hex?: string;
}

export interface Dictionaries {
  colors: DictItem[];
  transmissions: DictItem[];
  fuels: DictItem[];
  bodies: DictItem[];
  drives: DictItem[];
}

export const CarEdit: React.FC = () => {
  const t = useTranslate();
  const { list } = useNavigation();
  const { open } = useNotification();
  const invalidate = useInvalidate();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Стейты словарей
  const [dicts, setDicts] = useState<Dictionaries>({
    colors: [],
    transmissions: [],
    fuels: [],
    bodies: [],
    drives: [],
  });
  const [isLoadingDicts, setIsLoadingDicts] = useState(true);

  // Загрузка словарей из API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axiosInstance.get("/settings");
        const parseKV = (key: string): DictItem[] => {
          const setting = data.find(
            (s: { key: string; value: string }) => s.key === key,
          );
          if (!setting) return [];
          try {
            return JSON.parse(setting.value);
          } catch {
            return [];
          }
        };

        setDicts({
          colors: parseKV("DICT_COLORS"),
          transmissions: parseKV("DICT_TRANSMISSIONS"),
          fuels: parseKV("DICT_FUEL_TYPES"),
          bodies: parseKV("DICT_BODY_TYPES"),
          drives: parseKV("DICT_DRIVE_TYPES"),
        });
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        open?.({
          type: "error",
          message: t(
            "cars.messages.dicts_failed",
            "Failed to load dictionaries",
          ),
        });
      } finally {
        setIsLoadingDicts(false);
      }
    };
    fetchSettings();
  }, [open, t]);

  // Данные для селектов
  const { autocompleteProps: ownerAutocompleteProps } = useAutocomplete({
    resource: "users",
  });
  const { autocompleteProps: locationAutocompleteProps } = useAutocomplete({
    resource: "locations",
  });
  const { autocompleteProps: featureAutocompleteProps } = useAutocomplete({
    resource: "features",
  });

  // Настройка формы
  const methods = useForm<FieldValues, any, FieldValues>({
    refineCoreProps: {
      redirect: false,
      onMutationSuccess: async (response) => {
        const carId = response?.data?.id;

        if (carId && selectedFiles.length > 0) {
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
              message: t("cars.messages.images_uploaded", "Images uploaded"),
            });
            setSelectedFiles([]); // Очищаем после успешной загрузки
          } catch (e) {
            console.error("Image upload error:", e);
            open?.({
              type: "error",
              message: t("cars.messages.images_failed", "Image upload failed"),
            });
          } finally {
            setIsUploading(false);
          }
        }

        // Инвалидируем кэш, чтобы подтянулись новые фотки
        invalidate({ resource: "cars", invalidates: ["detail"], id: carId });
        list("cars");
      },
    },
  });

  const {
    saveButtonProps,
    refineCore: { query },
    handleSubmit,
    refineCore,
  } = methods;

  const carData = query?.data?.data;

  // Перехватчик сохранения (чистим объекты перед отправкой патча)
  const onFinishHandler = async (data: FieldValues) => {
    const payload: Record<string, any> = { ...data };

    if (data.owner?.id) payload.owner = { id: data.owner.id };
    else payload.owner = null;

    if (data.location?.id) payload.location = { id: data.location.id };
    else payload.location = null;

    await refineCore.onFinish(payload);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) =>
    setActiveTab(newValue);

  // Хендлеры файлов
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleDeleteExistingImage = async (imageId: number) => {
    try {
      await axiosInstance.delete(`/cars/images/${imageId}`);
      open?.({
        type: "success",
        message: t("cars.messages.image_deleted", "Image deleted"),
      });
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
      <Edit
        saveButtonProps={{
          ...saveButtonProps,
          disabled: isUploading || saveButtonProps.disabled,
          onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            handleSubmit(onFinishHandler)();
          },
        }}
        isLoading={isUploading}
        title={
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: -2 }}>
            <Tab
              label={t("cars.tabs.details", "Details")}
              icon={<EditIcon />}
              iconPosition="start"
              {...a11yProps(0)}
            />
            <Tab
              label={t("cars.tabs.damages", "Damages")}
              icon={<CarCrashIcon />}
              iconPosition="start"
              {...a11yProps(1)}
            />
          </Tabs>
        }
      >
        <CustomTabPanel value={activeTab} index={0}>
          <CarDetailsTab
            carData={carData}
            dicts={dicts}
            selectedFiles={selectedFiles}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
            handleDeleteExistingImage={handleDeleteExistingImage}
            ownerProps={ownerAutocompleteProps}
            locationProps={locationAutocompleteProps}
            featureProps={featureAutocompleteProps}
          />
        </CustomTabPanel>

        <CustomTabPanel value={activeTab} index={1}>
          {carData?.id ? (
            <CarDamagesTab carId={carData.id} />
          ) : (
            <Box p={3}>
              {t(
                "cars.messages.save_first",
                "Save the car first to add damages.",
              )}
            </Box>
          )}
        </CustomTabPanel>
      </Edit>
    </FormProvider>
  );
};
