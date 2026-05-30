import React, { useState } from "react";
import {
  useShow,
  useTranslate,
} from "@refinedev/core";
import { Show } from "@refinedev/mui";
import {
  Typography,
  Stack,
  Avatar,
  Chip,
  Box,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CarRentalIcon from "@mui/icons-material/CarRental";
import CarCrashIcon from "@mui/icons-material/CarCrash";

// Components
import {
  CustomTabPanel,
  a11yProps,
} from "../../../components/common/custom-tab-panel";
import { CarRentalsTab } from "./rentals-tab";
import { DamagesTab } from "./components/DamagesTab";
import { CarDetailsTab } from "./components/CarDetailsTab";

export const CarShow = () => {
  const t = useTranslate();
  const [activeTab, setActiveTab] = useState(0);

  const { query } = useShow() as any;
  const isLoading = query?.isLoading;
  const record = query?.data?.data;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!record) return <div>No data found</div>;

  // Основная картинка для хедера
  const mainImage =
    record.images?.find((img: any) => img.is_main)?.url ||
    record.images?.[0]?.url;

  return (
    <Show isLoading={isLoading}>
      {/* --- HEADER --- */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        alignItems="center"
        mb={4}
      >
        <Avatar
          src={mainImage}
          variant="rounded"
          alt={`${record.brand} ${record.model}`}
          sx={{ width: 140, height: 100, fontSize: "3rem" }}
        >
          🚗
        </Avatar>

        <Box textAlign={{ xs: "center", sm: "left" }}>
          <Typography variant="h4" fontWeight="bold">
            {record.brand} {record.model}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {record.year} • {record.license_plate}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            mt={1}
            justifyContent={{ xs: "center", sm: "flex-start" }}
          >
            <Chip
              label={record.status}
              color={record.status === "AVAILABLE" ? "success" : "default"}
              size="small"
            />
            <Chip
              label={`$${record.price_per_day}/day`}
              variant="outlined"
              size="small"
            />
          </Stack>
        </Box>
      </Stack>

      <Divider />

      {/* --- TABS --- */}
      <Box sx={{ width: "100%", mt: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
          >
            <Tab
              label={t("cars.tabs.details", "Details")}
              icon={<InfoIcon />}
              iconPosition="start"
              {...a11yProps(0)}
            />
            <Tab
              label={t("cars.tabs.rentals", "Rentals History")}
              icon={<CarRentalIcon />}
              iconPosition="start"
              {...a11yProps(1)}
            />
            <Tab
              label={t("cars.tabs.damages", "Damages")}
              icon={<CarCrashIcon />}
              iconPosition="start"
              {...a11yProps(2)}
            />
          </Tabs>
        </Box>

        {/* 1. DETAILS TAB */}
        <CustomTabPanel value={activeTab} index={0}>
          <CarDetailsTab record={record} />
        </CustomTabPanel>

        {/* 2. RENTALS TAB */}
        <CustomTabPanel value={activeTab} index={1}>
          <CarRentalsTab carId={record.id} />
        </CustomTabPanel>

        {/* 3. DAMAGES TAB — 3D Interactive */}
        <CustomTabPanel value={activeTab} index={2}>
          <DamagesTab carId={record.id} />
        </CustomTabPanel>
      </Box>
    </Show>
  );
};
