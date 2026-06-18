import React, { useState } from "react";
import { useShow, useTranslate, useList, useCustomMutation, useInvalidate } from "@refinedev/core";
import { Show, DateField } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Typography,
  Stack,
  Avatar,
  Chip,
  Box,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CarCrashIcon from "@mui/icons-material/CarCrash";
import TimelineIcon from "@mui/icons-material/Timeline";
import PersonIcon from "@mui/icons-material/Person";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FlagIcon from "@mui/icons-material/Flag";

import {
  CustomTabPanel,
  a11yProps,
} from "../../components/common/custom-tab-panel";
import { API_URL } from "../../utility/axios-instance";
import { CenteredCell } from "../../components/common/centered-cell";
import { CustomNoRowsOverlay } from "../../components/common/custom-no-rows-overlay";

const STATUS_COLORS: Record<string, "success" | "info" | "primary" | "warning" | "default" | "error"> = {
  ACTIVE: "success",
  APPROVED: "primary",
  CREATED: "info",
  OVERDUE: "warning",
  COMPLETED: "default",
  CANCELED: "error",
  REJECTED: "error",
};

export const RentalShow = () => {
  const t = useTranslate();
  const [activeTab, setActiveTab] = useState(0);

  const { query } = useShow() as any;
  const isLoading = query?.isLoading;
  const record = query?.data?.data;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setActiveTab(newValue);

  if (isLoading) return <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>;
  if (!record) return <Typography color="text.secondary" sx={{ p: 4 }}>{t("messages.no_data", "No data found")}</Typography>;

  const car = record.car;
  const user = record.user;
  const carImage = car?.images?.[0]?.url;

  return (
    <Show isLoading={isLoading}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center" mb={4}>
        <Avatar
          src={carImage}
          variant="rounded"
            alt={car ? `${car.brand} ${car.model}` : "Car"}
            sx={{ width: 120, height: 80, fontSize: "2rem" }}
        >
          <DirectionsCarIcon sx={{ fontSize: 40 }} />
        </Avatar>

        <Box textAlign={{ xs: "center", sm: "left" }} flex={1}>
          <Typography variant="h4" fontWeight="bold">
            {car ? `${car.brand} ${car.model}` : "—"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {car?.license_plate || "—"} — {t("rentals.fields.idLabel", "Rental")} #{record.id}
          </Typography>

          <Stack direction="row" spacing={1} mt={1} justifyContent={{ xs: "center", sm: "flex-start" }} flexWrap="wrap">
            <Chip
              label={t(`rentals.enums.status.${record.status}`, record.status)}
              color={STATUS_COLORS[record.status] || "default"}
              size="small"
            />
            <Chip
              label={`${t("rentals.fields.price", "Price")}: $${Number(record.total_price || record.base_price || 0).toLocaleString()}`}
              variant="outlined"
              size="small"
            />
            <Chip
              icon={<PersonIcon />}
              label={user ? `${user.first_name} ${user.last_name}` : "—"}
              variant="outlined"
              size="small"
            />
          </Stack>
        </Box>
      </Stack>

      <Divider />

      <Box sx={{ width: "100%", mt: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable">
            <Tab label={t("rentals.tabs.details", "Details")} icon={<InfoIcon />} iconPosition="start" {...a11yProps(0)} />
            <Tab label={t("rentals.tabs.damages", "Damages")} icon={<CarCrashIcon />} iconPosition="start" {...a11yProps(1)} />
            <Tab label={t("rentals.tabs.timeline", "Timeline")} icon={<TimelineIcon />} iconPosition="start" {...a11yProps(2)} />
          </Tabs>
        </Box>

        <CustomTabPanel value={activeTab} index={0}>
          <DetailsTab record={record} t={t} />
        </CustomTabPanel>

        <CustomTabPanel value={activeTab} index={1}>
          <RentalDamagesTab rentalId={record.id} t={t} />
        </CustomTabPanel>

        <CustomTabPanel value={activeTab} index={2}>
          <TimelineTab record={record} t={t} />
        </CustomTabPanel>
      </Box>
    </Show>
  );
};

const DetailsTab = ({ record, t }: { record: any; t: any }) => {
  const car = record.car;
  const user = record.user;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: "100%" }} variant="outlined">
          <Typography variant="h6" mb={2}>{t("rentals.details.client", "Client")}</Typography>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar src={user?.avatar_url} sx={{ width: 48, height: 48 }}>
                {user?.first_name?.[0]}
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {user ? `${user.first_name} ${user.last_name}` : "—"}
                </Typography>
                <Typography variant="caption" color="text.secondary">{user?.email || "—"}</Typography>
                {user?.phone && (
                  <Typography variant="caption" display="block" color="text.secondary">{user.phone}</Typography>
                )}
              </Box>
            </Stack>
          </Stack>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: "100%" }} variant="outlined">
          <Typography variant="h6" mb={2}>{t("rentals.details.vehicle", "Vehicle")}</Typography>
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{t("cars.fields.brand", "Brand")}</Typography>
              <Typography>{car ? `${car.brand} ${car.model}` : "—"}</Typography>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{t("cars.fields.plate", "License Plate")}</Typography>
              <Typography sx={{ fontFamily: "monospace" }}>{car?.license_plate || "—"}</Typography>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{t("cars.fields.year", "Year")}</Typography>
              <Typography>{car?.year || "—"}</Typography>
            </Stack>
          </Stack>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: "100%" }} variant="outlined">
          <Typography variant="h6" mb={2}>{t("rentals.details.dates", "Dates")}</Typography>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{t("rentals.fields.startDate", "Start Date")}</Typography>
              <Typography><DateField value={record.start_date} format="L HH:mm" /></Typography>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{t("rentals.fields.endDate", "End Date")}</Typography>
              <Typography><DateField value={record.end_date} format="L HH:mm" /></Typography>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{t("rentals.details.actualReturn", "Actual Return")}</Typography>
              <Typography>
                {record.actual_return_date ? (
                  <DateField value={record.actual_return_date} format="L HH:mm" />
                ) : (
                  t("rentals.details.notReturned", "Not returned")
                )}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: "100%" }} variant="outlined">
          <Typography variant="h6" mb={2}>{t("rentals.details.finances", "Finances")}</Typography>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{t("rentals.details.basePrice", "Base Price")}</Typography>
              <Typography>${Number(record.base_price || 0).toLocaleString()}</Typography>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{t("rentals.details.penalty", "Penalty")}</Typography>
              <Typography color={Number(record.penalty_price) > 0 ? "error" : "text.primary"}>
                ${Number(record.penalty_price || 0).toLocaleString()}
              </Typography>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight="bold">{t("rentals.details.total", "Total")}</Typography>
              <Typography fontWeight="bold" color="primary">${Number(record.total_price || record.base_price || 0).toLocaleString()}</Typography>
            </Stack>
          </Stack>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: "100%" }} variant="outlined">
          <Typography variant="h6" mb={2}>{t("rentals.details.mileage", "Mileage & Fuel")}</Typography>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{t("rentals.details.startMileage", "Start Mileage")}</Typography>
              <Typography>{record.start_mileage ?? "-"} km</Typography>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{t("rentals.details.endMileage", "End Mileage")}</Typography>
              <Typography>{record.end_mileage ?? "-"} km</Typography>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{t("rentals.details.startFuel", "Start Fuel")}</Typography>
              <Typography>{record.start_fuel ?? "-"}%</Typography>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{t("rentals.details.endFuel", "End Fuel")}</Typography>
              <Typography>{record.end_fuel ?? "-"}%</Typography>
            </Stack>
          </Stack>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: "100%" }} variant="outlined">
          <Typography variant="h6" mb={2}>{t("rentals.details.locations", "Locations")}</Typography>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{t("rentals.details.pickUp", "Pick-up")}</Typography>
              <Typography textAlign="right">{record.pick_up_location?.name || "-"}</Typography>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{t("rentals.details.dropOff", "Drop-off")}</Typography>
              <Typography textAlign="right">{record.drop_off_location?.name || "-"}</Typography>
            </Stack>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

const RentalDamagesTab = ({ rentalId, t }: { rentalId: number; t: any }) => {
  const invalidate = useInvalidate();
  const { mutate: markPaid } = useCustomMutation();

  const { result, query } = useList({
    resource: "car-damages",
    filters: [{ field: "rentalId", operator: "eq", value: rentalId }],
  }) as any;

  const rows = result?.data || [];

  const handlePay = (id: number) => {
    markPaid(
      {
        url: `${API_URL}/car-damages/${id}/pay`,
        method: "patch",
        values: {},
      },
      {
        onSuccess: () => invalidate({ resource: "car-damages", invalidates: ["list"] }),
      },
    );
  };

  const columns: GridColDef[] = [
    {
      field: "image_url",
      headerName: t("cars.damages.fields.photo", "Photo"),
      width: 70,
      renderCell: ({ value }) => (
        <CenteredCell>
          <Avatar src={value} variant="rounded" sx={{ width: 40, height: 40 }}>
            <CarCrashIcon />
          </Avatar>
        </CenteredCell>
      ),
    },
    { field: "type", headerName: t("cars.damages.fields.type", "Type"), width: 110 },
    { field: "description", headerName: t("cars.damages.fields.description", "Description"), flex: 1 },
    {
      field: "repair_cost",
      headerName: t("cars.damages.fields.cost", "Cost"),
      width: 90,
      renderCell: ({ value }) => <CenteredCell>${value}</CenteredCell>,
    },
    {
      field: "is_paid",
      headerName: t("cars.damages.fields.status", "Status"),
      width: 90,
      renderCell: ({ row }) => (
        <CenteredCell>
          <Chip
            label={row.is_paid ? "Paid" : "Unpaid"}
            color={row.is_paid ? "success" : "error"}
            size="small"
            variant={row.is_paid ? "filled" : "outlined"}
          />
        </CenteredCell>
      ),
    },
    {
      field: "actions",
      headerName: t("table.actions", "Actions"),
      width: 80,
      sortable: false,
      renderCell: ({ row }) =>
        !row.is_paid ? (
          <CenteredCell>
            <Button size="small" color="success" onClick={() => handlePay(row.id)}>Pay</Button>
          </CenteredCell>
        ) : null,
    },
  ];

  return (
    <Box sx={{ mt: 2, height: 350, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} hideFooter loading={query?.isLoading} slots={{ noRowsOverlay: CustomNoRowsOverlay }} sx={{ border: "none" }} />
    </Box>
  );
};

const timelineIcons: Record<string, React.ReactNode> = {
  created: <AssignmentIcon color="primary" />,
  approved: <CheckCircleIcon color="success" />,
  pending: <CheckCircleIcon sx={{ color: "text.disabled" }} />,
  started: <DirectionsCarIcon color="primary" />,
  notStarted: <DirectionsCarIcon sx={{ color: "text.disabled" }} />,
  completed: <FlagIcon color="success" />,
  overdue: <FlagIcon color="warning" />,
  canceled: <CancelIcon color="error" />,
};

const TimelineTab = ({ record, t }: { record: any; t: any }) => {
  const events = [
    {
      title: t("rentals.timeline.created", "Rental Created"),
      date: record.created_at,
      icon: timelineIcons.created,
      active: true,
    },
    {
      title: ["APPROVED", "ACTIVE", "COMPLETED", "OVERDUE"].includes(record.status)
        ? t("rentals.timeline.approved", "Approved by Manager")
        : t("rentals.timeline.pendingApproval", "Awaiting Approval"),
      date: null,
      icon: ["APPROVED", "ACTIVE", "COMPLETED", "OVERDUE"].includes(record.status)
        ? timelineIcons.approved
        : timelineIcons.pending,
      active: ["APPROVED", "ACTIVE", "COMPLETED", "OVERDUE"].includes(record.status),
    },
    {
      title: ["ACTIVE", "COMPLETED", "OVERDUE"].includes(record.status)
        ? t("rentals.timeline.started", "Rental Started (Car Handed Over)")
        : t("rentals.timeline.notStarted", "Not Started"),
      date: null,
      icon: ["ACTIVE", "COMPLETED", "OVERDUE"].includes(record.status)
        ? timelineIcons.started
        : timelineIcons.notStarted,
      active: ["ACTIVE", "COMPLETED", "OVERDUE"].includes(record.status),
    },
    {
      title: record.status === "COMPLETED"
        ? t("rentals.timeline.completed", "Rental Completed (Car Returned)")
        : record.status === "OVERDUE"
          ? t("rentals.timeline.overdue", "Overdue")
          : record.status === "CANCELED"
            ? t("rentals.timeline.canceled", "Canceled")
            : t("rentals.timeline.notCompleted", "Not Completed"),
      date: record.status === "COMPLETED" ? record.actual_return_date || record.updated_at : null,
      icon: record.status === "COMPLETED"
        ? timelineIcons.completed
        : record.status === "OVERDUE"
          ? timelineIcons.overdue
          : record.status === "CANCELED"
            ? timelineIcons.canceled
            : timelineIcons.notStarted,
      active: ["COMPLETED", "OVERDUE", "CANCELED"].includes(record.status),
    },
  ];

  return (
    <Box sx={{ py: 2 }}>
      {events.map((event, idx) => (
        <Stack
          key={idx}
          direction="row"
          spacing={2}
          alignItems="flex-start"
          sx={{
            opacity: event.active ? 1 : 0.45,
            mb: 3,
            position: "relative",
            "&::before": idx < events.length - 1
              ? {
                  content: '""',
                  position: "absolute",
                  left: 20,
                  top: 40,
                  bottom: -24,
                  width: 2,
                  bgcolor: event.active ? "primary.main" : "divider",
                }
              : {},
          }}
        >
          {event.icon}
          <Box>
            <Typography
              variant="body1"
              fontWeight={event.active ? "bold" : "normal"}
              color={record.status === "CANCELED" && idx === events.length - 1 ? "error" : "text.primary"}
            >
              {event.title}
            </Typography>
            {event.date && (
              <Typography variant="caption" color="text.secondary">
                <DateField value={event.date} format="LLL" />
              </Typography>
            )}
          </Box>
        </Stack>
      ))}
    </Box>
  );
};
