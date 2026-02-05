import React, { useState } from "react";
import {
  useShow,
  //useTranslate
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
  Grid,
  Paper,
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
import { CarDamagesTab } from "../edit/damages-tab"; // Можно переиспользовать компонент из Edit, он достаточно универсален

export const CarShow = () => {
  // const t = useTranslate();
  const [activeTab, setActiveTab] = useState(0);

  const { query } = useShow() as any;
  const isLoading = query?.isLoading;
  const record = query?.data?.data;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
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
              label="Details"
              icon={<InfoIcon />}
              iconPosition="start"
              {...a11yProps(0)}
            />
            <Tab
              label="Rentals History"
              icon={<CarRentalIcon />}
              iconPosition="start"
              {...a11yProps(1)}
            />
            <Tab
              label="Damages"
              icon={<CarCrashIcon />}
              iconPosition="start"
              {...a11yProps(2)}
            />
          </Tabs>
        </Box>

        {/* 1. DETAILS TAB */}
        <CustomTabPanel value={activeTab} index={0}>
          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              Info
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    VIN
                  </Typography>
                  <Typography>{record.vin}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Mileage
                  </Typography>
                  <Typography>{record.current_mileage} km</Typography>
                </Paper>
              </Grid>
              {/* Можно добавить больше инфо: цвет, описание и т.д. */}
            </Grid>
          </Box>
        </CustomTabPanel>

        {/* 2. RENTALS TAB */}
        <CustomTabPanel value={activeTab} index={1}>
          <CarRentalsTab carId={record.id} />
        </CustomTabPanel>

        {/* 3. DAMAGES TAB */}
        <CustomTabPanel value={activeTab} index={2}>
          {/* Переиспользуем компонент. Если нужно скрыть кнопки редактирования для Show,
               можно добавить проп readOnly в CarDamagesTab */}
          <CarDamagesTab carId={record.id} />
        </CustomTabPanel>
      </Box>
    </Show>
  );
};
