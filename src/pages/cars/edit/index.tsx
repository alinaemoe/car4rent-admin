import React, { useState } from "react";
import { Edit, useAutocomplete } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { FormProvider } from "react-hook-form";

import {
  //useTranslate,
  useNavigation,
  useNotification,
  useInvalidate,
} from "@refinedev/core";
import { Box, Tabs, Tab } from "@mui/material";
import CarCrashIcon from "@mui/icons-material/CarCrash";
import EditIcon from "@mui/icons-material/Edit";

import { axiosInstance } from "../../../utility/axios-instance";
import {
  CustomTabPanel,
  a11yProps,
} from "../../../components/common/custom-tab-panel";

// Импортируем части
import { CarDetailsTab } from "./details-tab";
import { CarDamagesTab } from "./damages-tab";

export const CarEdit = () => {
  //const t = useTranslate();
  const { list } = useNavigation();
  const { open } = useNotification();
  const invalidate = useInvalidate();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // --- HOOKS DATA (Owner, Loc, Features) ---
  const { autocompleteProps: ownerAutocompleteProps } = useAutocomplete({
    resource: "users",
  });
  const { autocompleteProps: locationAutocompleteProps } = useAutocomplete({
    resource: "locations",
  });
  const { autocompleteProps: featureAutocompleteProps } = useAutocomplete({
    resource: "features",
  });

  // --- FORM ---
  const methods = useForm({
    refineCoreProps: {
      redirect: false,
      onMutationSuccess: async (data: any) => {
        const carId = data.data.id;
        if (selectedFiles.length > 0) {
          // ... логика загрузки файлов (та же самая) ...
          setIsUploading(true);
          try {
            for (const file of selectedFiles) {
              const formData = new FormData();
              formData.append("file", file);
              await axiosInstance.post(`/cars/${carId}/images`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
            }
            open?.({ type: "success", message: "Images uploaded" });
          } catch (e) {
            console.error(e);
          } finally {
            setIsUploading(false);
          }
        }
        // После сохранения деталей можем остаться тут или уйти
        list("cars");
        invalidate({ resource: "cars", invalidates: ["detail"], id: carId });
      },
    },
  }) as any;

  const {
    saveButtonProps,
    refineCore: { query },
  } = methods;
  const carData = query?.data?.data;

  // --- HANDLERS ---
  const handleTabChange = (_: any, newValue: number) => setActiveTab(newValue);

  const handleFileChange = (e: any) => {
    if (e.target.files)
      setSelectedFiles((prev) => [
        ...prev,
        ...Array.from(e.target.files as FileList),
      ]);
  };
  const removeFile = (i: number) =>
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== i));

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
  // --- RENDER ---
  return (
    <FormProvider {...methods}>
      <Edit
        saveButtonProps={{ ...saveButtonProps, disabled: isUploading }}
        isLoading={isUploading}
        title={
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: -2 }}>
            <Tab
              label="Details"
              icon={<EditIcon />}
              iconPosition="start"
              {...a11yProps(0)}
            />
            <Tab
              label="Damages"
              icon={<CarCrashIcon />}
              iconPosition="start"
              {...a11yProps(1)}
            />
          </Tabs>
        }
      >
        <CustomTabPanel value={activeTab} index={0}>
          {/* Старая форма живет тут */}
          <CarDetailsTab
            carData={carData}
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
          {/* Новая таблица повреждений */}
          {carData?.id ? (
            <CarDamagesTab carId={carData.id} />
          ) : (
            <Box p={3}>Save the car first to add damages.</Box>
          )}
        </CustomTabPanel>
      </Edit>
    </FormProvider>
  );
};
