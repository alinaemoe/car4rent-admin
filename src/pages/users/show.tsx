import React, { useState } from "react";
import { useShow, useTranslate } from "@refinedev/core";
import { Show } from "@refinedev/mui";
import {
  Typography,
  Stack,
  Avatar,
  Grid,
  Chip,
  Box,
  Divider,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";

// Иконки
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CarRentalIcon from "@mui/icons-material/CarRental";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ---

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Компонент панели таба (скрывает/показывает контент)
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `user-tab-${index}`,
    "aria-controls": `user-tabpanel-${index}`,
  };
}

// --- ОСНОВНОЙ КОМПОНЕНТ ---

export const UserShow = () => {
  const t = useTranslate();
  // Состояние активного таба (0 = Детали, 1 = Аренды, 2 = Документы)
  const [activeTab, setActiveTab] = useState(0);

  // Используем query (как мы починили)
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
      {/* --- HEADER (Всегда виден) --- */}
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
            alignItems="center"
          >
            {/* Статус */}
            <Chip
              label={
                record?.status
                  ? t(`users.enums.status.${record.status}`)
                  : t("users.enums.status.unknown", "Unknown")
              }
              color={record?.status === "ACTIVE" ? "success" : "default"}
              size="small"
              sx={{ fontWeight: 500 }}
            />

            {/* Роли */}
            {record?.roles?.length
              ? record.roles.map((role: string) => (
                  <Chip
                    key={role}
                    label={t(`users.enums.roles.${role}`)}
                    variant="outlined"
                    size="small"
                  />
                ))
              : null}
          </Stack>
        </Box>
      </Stack>

      <Divider />

      {/* --- TABS NAVIGATION --- */}
      <Box sx={{ width: "100%", mt: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="user details tabs"
            variant="scrollable"
            scrollButtons="auto"
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

        {/* --- TAB 1: DETAILS (Твоя старая Grid) --- */}
        <CustomTabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            {/* Контакты */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: "100%" }} variant="outlined">
                <Typography variant="h6" mb={2}>
                  {t("users.fields.contacts", "Contacts")}
                </Typography>
                <Stack spacing={2}>
                  {[
                    {
                      key: "email",
                      label: t("users.fields.email", "Email"),
                      icon: <EmailOutlinedIcon color="action" />,
                      value: record?.email,
                    },
                    {
                      key: "phone",
                      label: t("users.fields.phone", "Phone"),
                      icon: <PhoneOutlinedIcon color="action" />,
                      value: record?.phone,
                    },
                  ].map((item) => (
                    <Stack
                      key={item.key}
                      direction="row"
                      alignItems="center"
                      spacing={2}
                    >
                      {item.icon}
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {item.label}
                        </Typography>
                        <Typography variant="body1">
                          {item.value || t("notAvailable", "N/A")}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid>

            {/* Системные данные */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: "100%" }} variant="outlined">
                <Typography variant="h6" mb={2}>
                  {t("users.fields.systemData", "System Data")}
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">
                      {t("users.fields.id")}
                    </Typography>
                    <Typography fontWeight="mono">{record?.id}</Typography>
                  </Stack>

                  <Divider />

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography color="text.secondary">
                      {t("users.fields.verified")}
                    </Typography>
                    {record?.is_verified ? (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Verified"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip
                        icon={<CancelIcon />}
                        label="Not Verified"
                        color="error"
                        size="small"
                      />
                    )}
                  </Stack>

                  <Divider />

                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">
                      {t("users.fields.createdAt")}
                    </Typography>
                    <Typography>
                      {record?.created_at
                        ? new Date(record.created_at).toLocaleString()
                        : "-"}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>

            {/* Комментарий админа */}
            {record?.admin_comment && (
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "warning.lighter",
                    borderColor: "warning.light",
                  }}
                  variant="outlined"
                >
                  <Typography
                    variant="subtitle2"
                    color="warning.dark"
                    gutterBottom
                  >
                    {t("users.fields.adminComment")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                    {record.admin_comment}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </CustomTabPanel>

        {/* --- TAB 2: RENTALS --- */}
        <CustomTabPanel value={activeTab} index={1}>
          <Box sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
            <CarRentalIcon sx={{ fontSize: 60, opacity: 0.5 }} />
            <Typography variant="h6" mt={2}>
              История аренд будет здесь
            </Typography>
            <Typography variant="body2">
              Нам нужно создать ресурс <b>Rentals</b>, чтобы отобразить таблицу.
            </Typography>
          </Box>

          {/* СЮДА ПОТОМ ВСТАВИМ ТАБЛИЦУ:
              <DataGrid 
                 rows={rentalsData} 
                 columns={...} 
                 loading={isLoadingRentals} 
              />
           */}
        </CustomTabPanel>

        {/* --- TAB 3: DOCUMENTS --- */}
        <CustomTabPanel value={activeTab} index={2}>
          <Box sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
            <DescriptionIcon sx={{ fontSize: 60, opacity: 0.5 }} />
            <Typography variant="h6" mt={2}>
              Документы пользователя
            </Typography>
            <Typography variant="body2">
              Здесь будут сканы паспорта и прав. Нужен ресурс <b>Documents</b>.
            </Typography>
          </Box>
        </CustomTabPanel>
      </Box>
    </Show>
  );
};
