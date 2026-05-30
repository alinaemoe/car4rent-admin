import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  lazy,
  Suspense,
} from "react";
import { List } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Avatar,
  Chip,
  Stack,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Grid,
  Paper,
  CircularProgress,
  Divider,
  Autocomplete,
  useMediaQuery,
  Theme,
  Alert,
} from "@mui/material";
import { useTranslate, useList, useCustomMutation, useInvalidate } from "@refinedev/core";

import { useForm } from "react-hook-form";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import BuildIcon from "@mui/icons-material/Build";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import { CenteredCell } from "../../components/common/centered-cell";
import { CustomNoRowsOverlay } from "../../components/common/custom-no-rows-overlay";
import { API_URL, axiosInstance } from "../../utility/axios-instance";

const ThreeCarScene = lazy(
  () => import("../cars/show/components/ThreeCarScene"),
);

const DAMAGE_TYPES = [
  { value: "SCRATCH", color: "warning.main" },
  { value: "DENT", color: "error.main" },
  { value: "CRACK", color: "secondary.main" },
  { value: "BROKEN_PART", color: "error.light" },
  { value: "SALON", color: "info.main" },
  { value: "WHEEL", color: "grey.600" },
  { value: "OTHER", color: "grey.700" },
];

const FILTER_STATUS = ["all", "paid", "unpaid"];

export const CarDamageList = () => {
  const t = useTranslate();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const { mutate: markPaid } = useCustomMutation();
  const invalidate = useInvalidate();

  // Синхронизируем фильтры с реальным полем is_paid из базы данных
  const { result, query } = useList({
    resource: "car-damages",
    pagination: {
      currentPage: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
    },
    filters: [
      ...(filterStatus === "paid"
        ? [{ field: "is_paid", operator: "eq" as const, value: true }]
        : []),
      ...(filterStatus === "unpaid"
        ? [{ field: "is_paid", operator: "eq" as const, value: false }]
        : []),
    ],
    sorters: [{ field: "created_at", order: "desc" }],
  }) as any;

  const rows = result?.data?.data || [];
  const total = result?.data?.total || 0;
  const isLoading = query?.isLoading;
  const isError = query?.isError;
  const refetchList = query?.refetch;

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        t("cars.damages.messages.deleteConfirm", "Delete this damage record?"),
      )
    )
      return;
    try {
      await axiosInstance.delete(`/car-damages/${id}`);
      invalidate({ resource: "car-damages", invalidates: ["list"] });
    } catch (e) {
      console.error(e);
    }
  };

  const handlePay = (id: number) => {
    markPaid(
      {
        url: `${API_URL}/car-damages/${id}/pay`,
        method: "patch",
        values: {},
        successNotification: () => ({
          message: t("cars.damages.messages.paid", "Marked as paid"),
          type: "success",
        }),
      },
      {
        onSuccess: () =>
          invalidate({ resource: "car-damages", invalidates: ["list"] }),
      },
    );
  };

  const columns = useMemo<GridColDef[]>(() => {
    const baseColumns: GridColDef[] = [
      {
        field: "id",
        headerName: t("table.id", "ID"),
        width: 70,
        renderCell: ({ value }) => <CenteredCell>#{value}</CenteredCell>,
      },
      {
        field: "image_url",
        headerName: t("cars.damages.fields.photo", "Photo"),
        width: 80,
        renderCell: ({ value }) => (
          <CenteredCell>
            <Avatar
              src={value}
              variant="rounded"
              sx={{ width: 50, height: 50 }}
            >
              <BuildIcon />
            </Avatar>
          </CenteredCell>
        ),
      },
      {
        field: "car",
        headerName: t("cars.damages.fields.car", "Car"),
        width: 160,
        renderCell: ({ row }) => {
          if (!row.car) return <CenteredCell>—</CenteredCell>;
          return (
            <CenteredCell>
              <Typography variant="body2" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: 140 }}>
                {row.car.brand} {row.car.model}
              </Typography>
            </CenteredCell>
          );
        },
        valueGetter: (_value, row) =>
          row.car ? `${row.car.brand} ${row.car.model}` : "",
      },
      {
        field: "type",
        headerName: t("cars.damages.fields.type", "Type"),
        width: 130,
        renderCell: ({ value }) => (
          <CenteredCell>
            {value ? t(`cars.damages.enums.types.${value}`, value) : "—"}
          </CenteredCell>
        ),
      },
      {
        field: "description",
        headerName: t("cars.damages.fields.description", "Description"),
        flex: 1,
        minWidth: 150,
        renderCell: ({ value }) => (
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {value || "—"}
          </Typography>
        ),
      },
      {
        field: "repair_cost",
        headerName: t("cars.damages.fields.repairCost", "Repair Cost"),
        width: 120,
        renderCell: ({ value }) => (
          <CenteredCell>
            <Typography fontWeight="bold">
              ${Number(value).toFixed(2)}
            </Typography>
          </CenteredCell>
        ),
      },
      {
        field: "is_paid",
        headerName: t("cars.damages.fields.status", "Status"),
        width: 110,
        renderCell: ({ value }) => (
          <CenteredCell>
            <Chip
              label={
                value
                  ? t("cars.damages.status.paid", "Paid")
                  : t("cars.damages.status.unpaid", "Unpaid")
              }
              color={value ? "success" : "error"}
              size="small"
              variant={value ? "filled" : "outlined"}
            />
          </CenteredCell>
        ),
      },
      {
        field: "coord",
        headerName: t("cars.damages.fields.coords", "3D Position"),
        width: 130,
        renderCell: ({ row }) => {
          const hasCoords =
            row.coord_x != null && row.coord_y != null && row.coord_z != null;
          return (
            <CenteredCell>
              {hasCoords ? (
                <Tooltip
                  title={`X: ${row.coord_x}, Y: ${row.coord_y}, Z: ${row.coord_z}`}
                >
                  <ThreeDRotationIcon
                    sx={{
                      fontSize: 20,
                      color: "primary.main",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              ) : (
                <Typography variant="caption" color="text.disabled">
                  —
                </Typography>
              )}
            </CenteredCell>
          );
        },
      },
      {
        field: "actions",
        headerName: t("cars.damages.fields.actions", "Actions"),
        width: 120,
        sortable: false,
        renderCell: ({ row }) => (
          <CenteredCell spacing={1}>
            {!row.is_paid && (
              <Tooltip
                title={t("cars.damages.actions.markPaid", "Mark as Paid")}
              >
                <IconButton
                  color="success"
                  size="small"
                  onClick={() => handlePay(row.id)}
                >
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={t("cars.damages.actions.delete", "Delete")}>
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDelete(row.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </CenteredCell>
        ),
      },
      {
        field: "created_at",
        headerName: t("cars.damages.fields.createdAt", "Created At"),
        width: 140,
        renderCell: ({ value }) => (
          <CenteredCell>
            <Typography variant="caption" color="text.secondary">
              {value ? new Date(value).toLocaleDateString() : "—"}
            </Typography>
          </CenteredCell>
        ),
      },
    ];

    return baseColumns;
  }, [t]);

  return (
    <List>
      <Box sx={{ width: "100%" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={1}
          mb={2}
        >
          <Stack direction="row" spacing={1}>
            {FILTER_STATUS.map((s) => (
              <Chip
                key={s}
                label={t(
                  `cars.damages.filters.${s}`,
                  s.charAt(0).toUpperCase() + s.slice(1),
                )}
                color={filterStatus === s ? "primary" : "default"}
                variant={filterStatus === s ? "filled" : "outlined"}
                size="small"
                onClick={() => setFilterStatus(s)}
              />
            ))}
          </Stack>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            onClick={() => setIsModalOpen(true)}
          >
            {t("cars.damages.actions.add", "Add Damage")}
          </Button>
        </Stack>

        <Box sx={{ height: 600, width: "100%" }}>
          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {t("messages.loading_error", "Failed to load data")}
            </Alert>
          )}
          <DataGrid
            rows={rows}
            columns={columns}
            rowCount={total}
            loading={isLoading}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50, 100]}
            rowHeight={70}
            slots={{ noRowsOverlay: CustomNoRowsOverlay }}
            columnVisibilityModel={{
              id: !isMobile,
              repair_cost: !isMobile,
              coord: !isMobile,
              created_at: !isMobile,
            }}
            sx={{
              border: "none",
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid",
                borderColor: "divider",
                whiteSpace: "normal",
                lineHeight: "1.3em",
                py: 1,
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
              },
            }}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>

      <AddDamageDialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refetchList={refetchList}
      />
    </List>
  );
};

interface AddDamageDialogProps {
  open: boolean;
  onClose: () => void;
  refetchList?: () => Promise<any>;
}

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface CarOption {
  id: number;
  brand: string;
  model: string;
  license_plate: string;
}

const AddDamageDialog = ({
  open,
  onClose,
  refetchList,
}: AddDamageDialogProps) => {
  const t = useTranslate();
  const invalidate = useInvalidate();

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capturedCoords, setCapturedCoords] = useState<Vector3 | null>(null);
  const [selectedCar, setSelectedCar] = useState<CarOption | null>(null);
  const [damagesVersion, setDamagesVersion] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "SCRATCH",
      description: "",
      repair_cost: 0,
    },
  });

  const { result: carsResult } = useList({
    resource: "cars",
    pagination: { currentPage: 1, pageSize: 50 },
  }) as any;

  const cars: CarOption[] = Array.isArray(carsResult?.data)
    ? carsResult.data
    : [];

  // ИСПРАВЛЕНО: Меняем фильтр carId на car.id, чтобы состыковаться с NestJS
  const { result: carResult } = useList({
    resource: "car-damages",
    filters: [{ field: "car.id", operator: "eq", value: selectedCar?.id }],
    pagination: { currentPage: 1, pageSize: 200 },
    queryOptions: { enabled: selectedCar != null },
  }) as any;

  const carDamages = Array.isArray(carResult?.data) ? carResult.data : [];

  useEffect(() => {
    if (open) {
      reset({ type: "SCRATCH", description: "", repair_cost: 0 });
      setFile(null);
      setFilePreview(null);
      setCapturedCoords(null);
      setSelectedCar(null);
    }
  }, [open, reset]);

  const handleCarClick = useCallback((position: Vector3) => {
    setCapturedCoords(position);
  }, []);

  const handlePinClick = useCallback(() => {}, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setFilePreview(URL.createObjectURL(f));
    }
  };

  const clearFile = () => {
    setFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
  };

  const onSubmit = async (data: any) => {
    if (isSubmitting) return;
    if (selectedCar == null) return;
    setIsSubmitting(true);
    try {
      let imageUrl = "";

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await axiosInstance.post(
          "/car-damages/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        imageUrl = uploadRes.data.url;
      }

      await axiosInstance.post("/car-damages", {
        carId: selectedCar?.id,
        type: data.type,
        description: data.description,
        repair_cost: Number(data.repair_cost),
        image_url: imageUrl || undefined,
        coord_x: capturedCoords ? Number(capturedCoords.x) : undefined,
        coord_y: capturedCoords ? Number(capturedCoords.y) : undefined,
        coord_z: capturedCoords ? Number(capturedCoords.z) : undefined,
      });

      await refetchList?.();
      invalidate({ resource: "car-damages", invalidates: ["list"] });
      setDamagesVersion((v) => v + 1);
      reset();
      setFile(null);
      if (filePreview) URL.revokeObjectURL(filePreview);
      setFilePreview(null);
      setCapturedCoords(null);
      onClose();
    } catch (error) {
      console.error("Failed to add damage", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      disableEscapeKeyDown={isSubmitting}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
      slotProps={{
        backdrop: {
          style: { pointerEvents: isSubmitting ? "none" : "auto" },
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <AddLocationIcon color="primary" />
          <Typography variant="h6" sx={{ flex: 1 }}>
            {capturedCoords
              ? t("cars.damages.actions.createIn3D", "Add Damage via 3D View")
              : t("cars.damages.titles.create", "Record Damage")}
          </Typography>
          <IconButton
            size="small"
            onClick={onClose}
            disabled={isSubmitting}
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2.5}>
            {/* LEFT COLUMN — 3D Scene */}
            <Grid item xs={12} md={7}>
              {selectedCar != null ? (
                <Suspense
                  fallback={
                    <Paper
                      variant="outlined"
                      sx={{
                        height: 400,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress />
                    </Paper>
                  }
                >
                  <ThreeCarScene
                    key={damagesVersion}
                    damages={carDamages}
                    selectedDamageId={null}
                    onCarClick={handleCarClick}
                    onPinClick={handlePinClick}
                    onSceneReady={() => {}}
                    previewCoords={capturedCoords as any}
                  />
                </Suspense>
              ) : (
                <Paper
                  variant="outlined"
                  sx={{
                    height: 400,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "background.default",
                    borderRadius: 2,
                    gap: 1,
                  }}
                >
                  <ThreeDRotationIcon
                    sx={{ fontSize: 48, color: "text.disabled" }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    {t(
                      "cars.damages.messages.selectCar",
                      "Select a car above to load the 3D view",
                    )}
                  </Typography>
                </Paper>
              )}
            </Grid>

            {/* RIGHT COLUMN — Form */}
            <Grid item xs={12} md={5}>
              <Stack spacing={2.5}>
                {/* ИСПРАВЛЕНО: value={selectedCar || null} убирает варнинг MUI */}
                <Autocomplete
                  options={cars}
                  loading={!Array.isArray(carsResult?.data)}
                  value={selectedCar || null}
                  onChange={(_e, newVal) => {
                    setSelectedCar(newVal);
                    setCapturedCoords(null);
                  }}
                  getOptionLabel={(opt) =>
                    opt.brand + " " + opt.model + " (" + opt.license_plate + ")"
                  }
                  isOptionEqualToValue={(opt, val) => opt.id === val.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("cars.damages.fields.car", "Car")}
                      size="small"
                      placeholder={t(
                        "cars.damages.placeholders.selectCar",
                        "Select a car...",
                      )}
                    />
                  )}
                  noOptionsText={t(
                    "cars.damages.messages.noCars",
                    "No cars found",
                  )}
                  sx={{
                    "& .MuiAutocomplete-clearIndicator": {
                      color: "text.secondary",
                    },
                  }}
                />

                {capturedCoords && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(144,202,249,0.08)"
                          : "rgba(33,150,243,0.06)",
                      borderColor: "primary.light",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <ThreeDRotationIcon color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t(
                          "cars.damages.fields.coords",
                          "3D Position Captured",
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        fontFamily="monospace"
                        color="primary.main"
                      >
                        {"X: " +
                          capturedCoords.x.toFixed(3) +
                          "  |  Y: " +
                          capturedCoords.y.toFixed(3) +
                          "  |  Z: " +
                          capturedCoords.z.toFixed(3)}
                      </Typography>
                    </Box>
                  </Paper>
                )}

                <FormControl fullWidth size="small">
                  <InputLabel>
                    {t("cars.damages.fields.type", "Damage Type")}
                  </InputLabel>
                  <Select
                    defaultValue="SCRATCH"
                    label={t("cars.damages.fields.type", "Damage Type")}
                    {...register("type", { required: true })}
                  >
                    {DAMAGE_TYPES.map((dt) => (
                      <MenuItem key={dt.value} value={dt.value}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              bgcolor: dt.color,
                              flexShrink: 0,
                            }}
                          />
                          <span>
                            {t(
                              "cars.damages.enums.types." + dt.value,
                              dt.value,
                            )}
                          </span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label={t("cars.damages.fields.description", "Description")}
                  multiline
                  rows={3}
                  fullWidth
                  size="small"
                  placeholder={t(
                    "cars.damages.placeholders.description",
                    "Describe the damage...",
                  )}
                  {...register("description", {
                    required: t("errors.required.field", "Required"),
                  })}
                  error={!!errors.description}
                  helperText={errors.description?.message as string}
                />

                <TextField
                  label={t("cars.damages.fields.repairCost", "Repair Cost")}
                  type="number"
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  {...register("repair_cost", {
                    required: true,
                    min: { value: 0, message: "Min $0" },
                  })}
                />

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 1, display: "block" }}
                  >
                    {t("cars.damages.fields.image", "Photo Evidence")}
                  </Typography>
                  {!file ? (
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderStyle: "dashed",
                        borderColor: "divider",
                        color: "text.secondary",
                        "&:hover": { borderColor: "primary.main" },
                      }}
                    >
                      {t("cars.damages.fields.image", "Upload Photo")}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  ) : (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Avatar
                        src={filePreview || undefined}
                        variant="rounded"
                        sx={{ width: 48, height: 48 }}
                      >
                        <AttachFileIcon />
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption" noWrap>
                          {file.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.disabled"
                          display="block"
                        >
                          {(file.size / 1024).toFixed(1) + " KB"}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={clearFile}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                  )}
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
            {t("buttons.cancel", "Cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <AddLocationIcon />
              )
            }
          >
            {isSubmitting
              ? t("buttons.saving", "Saving...")
              : t("cars.damages.actions.add", "Save Damage")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
