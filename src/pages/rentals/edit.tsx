import React, { useState } from "react";
import { Edit, useAutocomplete } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import {
  useTranslate,
  useNavigation,
  useNotification,
  useInvalidate,
  useCustomMutation,
} from "@refinedev/core";
import {
  Box,
  TextField,
  Grid,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Chip,
  Avatar,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CancelIcon from "@mui/icons-material/Cancel";
import FlagIcon from "@mui/icons-material/Flag";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { API_URL } from "../../utility/axios-instance";

const STATUS_OPTIONS = [
  { value: "CREATED", labelKey: "rentals.enums.status.CREATED", defaultLabel: "Created" },
  { value: "APPROVED", labelKey: "rentals.enums.status.APPROVED", defaultLabel: "Approved" },
  { value: "ACTIVE", labelKey: "rentals.enums.status.ACTIVE", defaultLabel: "Active" },
  { value: "COMPLETED", labelKey: "rentals.enums.status.COMPLETED", defaultLabel: "Completed" },
  { value: "CANCELED", labelKey: "rentals.enums.status.CANCELED", defaultLabel: "Canceled" },
  { value: "OVERDUE", labelKey: "rentals.enums.status.OVERDUE", defaultLabel: "Overdue" },
];

export const RentalEdit = () => {
  const t = useTranslate();
  const { list } = useNavigation();
  const { open } = useNotification();
  const invalidate = useInvalidate();
  const { mutate: updateStatus } = useCustomMutation();
  const { mutate: finishRental } = useCustomMutation();

  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [finishData, setFinishData] = useState({
    end_mileage: 0,
    end_fuel: 100,
    actual_return_date: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
  });

  const {
    saveButtonProps,
    refineCore: { query, formLoading },
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    refineCoreProps: {
      redirect: false,
      action: "edit",
    },
  });

  const record = query?.data?.data;

  const { autocompleteProps: userAutocompleteProps } = useAutocomplete({
    resource: "users",
  });

  const { autocompleteProps: carAutocompleteProps } = useAutocomplete({
    resource: "cars",
  });

  const startDate = watch("start_date");
  const currentStatus = watch("status");

  const handleStatusChange = async (newStatus: string) => {
    if (!record?.id) return;

    updateStatus(
      {
        url: `${API_URL}/rentals/${record.id}/status`,
        method: "patch",
        values: { status: newStatus },
      },
      {
        onSuccess: () => {
          open?.({ type: "success", message: t("rentals.messages.statusUpdated", "Status updated") });
          invalidate({ resource: "rentals", invalidates: ["list", "detail"] });
        },
        onError: (error: any) => {
          open?.({
            type: "error",
            message: error?.response?.data?.message || t("rentals.messages.statusError", "Failed to update status"),
          });
        },
      },
    );
  };

  const handleFinishRental = async () => {
    if (!record?.id) return;

    finishRental(
      {
        url: `${API_URL}/rentals/${record.id}/finish`,
        method: "post",
        values: finishData,
      },
      {
        onSuccess: () => {
          open?.({ type: "success", message: t("rentals.messages.rentalFinished", "Rental finished") });
          setFinishDialogOpen(false);
          invalidate({ resource: "rentals", invalidates: ["list", "detail"] });
        },
        onError: (error: any) => {
          open?.({
            type: "error",
            message: error?.response?.data?.message || t("rentals.messages.finishError", "Failed to finish rental"),
          });
        },
      },
    );
  };

  const onFinishHandler = async (data: any) => {
    const payload: Record<string, any> = { ...data };
    if (data.user?.id) payload.user_id = data.user.id;
    else payload.user_id = null;
    if (data.car?.id) payload.car_id = data.car.id;
    else payload.car_id = null;
    delete payload.user;
    delete payload.car;
    return payload;
  };

  const canFinish = currentStatus === "ACTIVE" || currentStatus === "APPROVED";

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Edit
        saveButtonProps={{
          ...saveButtonProps,
          onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            handleSubmit(onFinishHandler)();
          },
        }}
        isLoading={formLoading}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {record && (
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={record.car?.images?.[0]?.url}
                  variant="rounded"
                  sx={{ width: 80, height: 60 }}
                >
                  <DirectionsCarIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {record.car ? `${record.car.brand} ${record.car.model}` : "—"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {record.car?.license_plate || "—"} — {t("rentals.fields.idLabel", "Rental")} #{record.id}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={0.5}>
                    <Chip
                      label={t(`rentals.enums.status.${record.status}`, record.status)}
                      size="small"
                      color={record.status === "ACTIVE" ? "success" : "default"}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          )}

          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" mb={2} fontWeight="bold">
              {t("rentals.edit.statusSection", "Status & Actions")}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>{t("rentals.fields.status", "Status")}</InputLabel>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        label={t("rentals.fields.status", "Status")}
                        onChange={(e) => {
                          const newVal = e.target.value as string;
                          field.onChange(newVal);
                          handleStatusChange(newVal);
                        }}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {t(opt.labelKey, opt.defaultLabel)}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack direction="row" spacing={2} alignItems="center" height="100%">
                  {canFinish && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<FlagIcon />}
                      onClick={() => setFinishDialogOpen(true)}
                    >
                      {t("rentals.edit.finishRental", "Finish Rental")}
                    </Button>
                  )}
                  {currentStatus === "CREATED" && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => handleStatusChange("CANCELED")}
                    >
                      {t("rentals.edit.cancelRental", "Cancel Rental")}
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" mb={2} fontWeight="bold">
              {t("rentals.edit.datesSection", "Dates")}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  control={control}
                  name="start_date"
                  render={({ field }) => (
                    <DateTimePicker
                      label={t("rentals.fields.startDate", "Start Date")}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        field.onChange(newValue ? newValue.toISOString() : null);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: "normal",
                          error: !!errors.start_date,
                          helperText: errors.start_date?.message as string,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  control={control}
                  name="end_date"
                  render={({ field }) => (
                    <DateTimePicker
                      label={t("rentals.fields.endDate", "End Date")}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        field.onChange(newValue ? newValue.toISOString() : null);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: "normal",
                          error: !!errors.end_date,
                          helperText: errors.end_date?.message as string,
                        },
                      }}
                      minDateTime={startDate ? dayjs(startDate).add(1, "hour") : undefined}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" mb={2} fontWeight="bold">
              {t("rentals.edit.clientSection", "Client & Car")}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  control={control}
                  name="user"
                  render={({ field }: any) => (
                    <Autocomplete
                      {...userAutocompleteProps}
                      value={field.value || null}
                      onChange={(_, value: any) => {
                        field.onChange(value);
                      }}
                      getOptionLabel={(item: any) =>
                        item ? `${item.first_name} ${item.last_name} (${item.email})` : ""
                      }
                      isOptionEqualToValue={(option: any, value: any) =>
                        option?.id === value?.id
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("rentals.fields.user", "Client")}
                          margin="normal"
                          variant="outlined"
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  control={control}
                  name="car"
                  render={({ field }: any) => (
                    <Autocomplete
                      {...carAutocompleteProps}
                      value={field.value || null}
                      onChange={(_, value: any) => {
                        field.onChange(value);
                      }}
                      getOptionLabel={(item: any) =>
                        item ? `${item.brand} ${item.model} (${item.license_plate})` : ""
                      }
                      isOptionEqualToValue={(option: any, value: any) =>
                        option?.id === value?.id
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("rentals.fields.car", "Car")}
                          margin="normal"
                          variant="outlined"
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Paper>
        </Box>

        <Dialog open={finishDialogOpen} onClose={() => setFinishDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {t("rentals.edit.finishDialogTitle", "Finish Rental")}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} mt={2}>
              <TextField
                label={t("rentals.edit.endMileage", "End Mileage (km)")}
                type="number"
                fullWidth
                value={finishData.end_mileage}
                onChange={(e) => setFinishData({ ...finishData, end_mileage: Number(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">km</InputAdornment>,
                }}
              />
              <TextField
                label={t("rentals.edit.endFuel", "End Fuel (%)")}
                type="number"
                fullWidth
                value={finishData.end_fuel}
                onChange={(e) => setFinishData({ ...finishData, end_fuel: Number(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">%</InputAdornment>,
                }}
                inputProps={{ min: 0, max: 100 }}
              />
              <DateTimePicker
                label={t("rentals.edit.actualReturnDate", "Actual Return Date")}
                value={dayjs(finishData.actual_return_date)}
                onChange={(newValue) => {
                  if (newValue) setFinishData({ ...finishData, actual_return_date: newValue.toISOString() });
                }}
                slotProps={{
                  textField: { fullWidth: true, margin: "normal" },
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFinishDialogOpen(false)} color="inherit">
              {t("buttons.cancel", "Cancel")}
            </Button>
            <Button onClick={handleFinishRental} variant="contained" color="success">
              {t("rentals.edit.confirmFinish", "Confirm Finish")}
            </Button>
          </DialogActions>
        </Dialog>
      </Edit>
    </LocalizationProvider>
  );
};
