import React, { useState } from "react";
import { useShow, useTranslate } from "@refinedev/core";
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
import PersonIcon from "@mui/icons-material/Person";
import CarRentalIcon from "@mui/icons-material/CarRental";
import DescriptionIcon from "@mui/icons-material/Description";

// Импортируем наши кусочки
import {
  CustomTabPanel,
  a11yProps,
} from "../../../components/common/custom-tab-panel";
import { DetailsTab } from "./details-tab";
import { RentalsTab } from "./rentals-tab";
import { DocumentsTab } from "./documents-tab";

export const UserShow = () => {
  const t = useTranslate();
  const [activeTab, setActiveTab] = useState(0);

  const { query } = useShow() as any;
  const isLoading = query?.isLoading;
  const record = query?.data?.data;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!record) return <div>No data found</div>;

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
          src={record?.avatar_url || undefined}
          alt={record?.first_name || ""}
          sx={{ width: 100, height: 100, fontSize: "2rem" }}
        >
          {record?.first_name?.[0]?.toUpperCase() || "?"}
        </Avatar>

        <Box textAlign={{ xs: "center", sm: "left" }}>
          <Typography variant="h4" fontWeight="bold">
            {record?.first_name} {record?.last_name}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            mt={1}
            justifyContent={{ xs: "center", sm: "flex-start" }}
          >
            <Chip
              label={
                record?.status
                  ? t(`users.enums.status.${record.status}`)
                  : "Unknown"
              }
              color={record?.status === "ACTIVE" ? "success" : "default"}
              size="small"
            />
            {record?.roles?.map((role: string) => (
              <Chip
                key={role}
                label={t(`users.enums.roles.${role}`)}
                variant="outlined"
                size="small"
              />
            ))}
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
              label={t("users.tabs.details", "Details")}
              icon={<PersonIcon />}
              iconPosition="start"
              {...a11yProps(0)}
            />
            <Tab
              label={t("users.tabs.rentals", "Rentals")}
              icon={<CarRentalIcon />}
              iconPosition="start"
              {...a11yProps(1)}
            />
            <Tab
              label={t("users.tabs.documents", "Documents")}
              icon={<DescriptionIcon />}
              iconPosition="start"
              {...a11yProps(2)}
            />
          </Tabs>
        </Box>

        <CustomTabPanel value={activeTab} index={0}>
          <DetailsTab record={record} t={t} />
        </CustomTabPanel>

        <CustomTabPanel value={activeTab} index={1}>
          <RentalsTab userId={record?.id} />
        </CustomTabPanel>

        <CustomTabPanel value={activeTab} index={2}>
          <DocumentsTab userId={record?.id} />
        </CustomTabPanel>
      </Box>
    </Show>
  );
};
