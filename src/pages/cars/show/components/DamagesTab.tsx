import React, { useState, useCallback, useEffect, lazy, Suspense } from "react";
import {
  useList,
  useTranslate,
  useInvalidate,
  useCustomMutation,
} from "@refinedev/core";
import { useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Stack,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BuildIcon from "@mui/icons-material/Build";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useForm } from "react-hook-form";

import { API_URL, axiosInstance } from "../../../../utility/axios-instance";

const ThreeCarScene = lazy(() => import("./ThreeCarScene"));

const DAMAGE_TYPES = [
  { value: "SCRATCH", color: "warning.main" },
  { value: "DENT", color: "error.main" },
  { value: "CRACK", color: "secondary.main" },
  { value: "BROKEN_PART", color: "error.light" },
  { value: "SALON", color: "info.main" },
  { value: "WHEEL", color: "grey.600" },
  { value: "OTHER", color: "grey.700" },
];

interface DamagesTabProps {
  carId: number;
}

export const DamagesTab = ({ carId }: DamagesTabProps) => {
  const t = useTranslate();
  const invalidate = useInvalidate();
  const { mutate: markPaid } = useCustomMutation();

  const [selectedDamageId, setSelectedDamageId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [capturedCoords, setCapturedCoords] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);
  const [is3DReady, setIs3DReady] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "list">("split");
  const [damagesVersion, setDamagesVersion] = useState(0);
  const queryClient = useQueryClient();

  const handleDamageSaved = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["default", "car-damages"] });
    invalidate({
      resource: "car-damages",
      invalidates: ["list", "resourceAll"],
    });
    setDamagesVersion((v) => v + 1);
  }, [queryClient, invalidate]);

  const { result, query } = useList({
    resource: "car-damages",
    filters: [{ field: "carId", operator: "eq", value: carId }],
  }) as any;

  const rows: any[] = (result?.data || []).map((d: any) => ({
    ...d,
    coord_x: Number(d.coord_x),
    coord_y: Number(d.coord_y),
    coord_z: Number(d.coord_z),
  }));
  const isLoading = query?.isLoading;
  const isError = query?.isError;

  const handleCarClick = useCallback(
    (position: { x: number; y: number; z: number }) => {
      setCapturedCoords(position);
      setIsCreateModalOpen(true);
    },
    [],
  );

  const handlePinClick = useCallback((damageId: number) => {
    setSelectedDamageId((prev) => (prev === damageId ? null : damageId));
  }, []);

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        t("cars.damages.messages.deleteConfirm", "Confirm delete?"),
      )
    )
      return;
    try {
      await axiosInstance.delete(`/car-damages/${id}`);
      invalidate({ resource: "car-damages", invalidates: ["list"] });
      if (selectedDamageId === id) setSelectedDamageId(null);
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

  return (
    <Box sx={{ mt: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        gap={1}
      >
        <Stack direction="row" spacing={1}>
          <Chip
            label={t("cars.damages.tabs.visual3d", "3D Visual")}
            icon={<ThreeDRotationIcon />}
            color={viewMode === "split" ? "primary" : "default"}
            variant={viewMode === "split" ? "filled" : "outlined"}
            size="small"
            onClick={() => setViewMode("split")}
          />
          <Chip
            label={t("cars.damages.tabs.list", "List")}
            icon={<BuildIcon />}
            color={viewMode === "list" ? "primary" : "default"}
            variant={viewMode === "list" ? "filled" : "outlined"}
            size="small"
            onClick={() => setViewMode("list")}
          />
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {rows.length} {rows.length === 1 ? "damage" : "damages"}
          {!is3DReady && viewMode === "split" && (
            <CircularProgress size={12} sx={{ ml: 1 }} />
          )}
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {viewMode === "split" && (
          <Grid item xs={12} md={7} lg={8}>
            <Suspense
              fallback={
                <Box
                  sx={{
                    height: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              }
            >
              <ThreeCarScene
                key={damagesVersion}
                damages={rows}
                selectedDamageId={selectedDamageId}
                onCarClick={handleCarClick}
                onPinClick={handlePinClick}
                onSceneReady={() => setIs3DReady(true)}
                previewCoords={capturedCoords}
              />
            </Suspense>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 1,
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              {t(
                "cars.damages.messages.clickOnCar",
                "Click on the car to mark damage location",
              )}
            </Typography>
          </Grid>
        )}

        <Grid
          item
          xs={12}
          md={viewMode === "split" ? 5 : 12}
          lg={viewMode === "split" ? 4 : 12}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="subtitle2" fontWeight="bold">
              {t("cars.damages.titles.list", "Damages")}
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddLocationIcon />}
              onClick={() => {
                setCapturedCoords(null);
                setIsCreateModalOpen(true);
              }}
            >
              {t("cars.damages.actions.add", "Add")}
            </Button>
          </Stack>

          {isError ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {t("messages.loading_error", "Failed to load data")}
            </Alert>
          ) : isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : rows.length === 0 ? (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: "background.default",
              }}
            >
              <BuildIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {t(
                  "cars.damages.messages.noDamages",
                  "No damages recorded yet",
                )}
              </Typography>
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ mt: 1, display: "block" }}
              >
                {t(
                  "cars.damages.messages.clickOnCar",
                  "Click the car in 3D view or use Add button",
                )}
              </Typography>
            </Paper>
          ) : (
            <Stack
              spacing={1}
              sx={{ maxHeight: 460, overflow: "auto", pr: 0.5 }}
            >
              {rows.map((damage: any) => (
                <DamageListItem
                  key={damage.id}
                  damage={damage}
                  isSelected={selectedDamageId === damage.id}
                  onSelect={() =>
                    setSelectedDamageId(
                      selectedDamageId === damage.id ? null : damage.id,
                    )
                  }
                  onPay={() => handlePay(damage.id)}
                  onDelete={() => handleDelete(damage.id)}
                  t={t}
                />
              ))}
            </Stack>
          )}
        </Grid>
      </Grid>

      <AddDamage3DDialog
        open={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setCapturedCoords(null);
        }}
        carId={carId}
        capturedCoords={capturedCoords}
        onSuccess={handleDamageSaved}
      />
    </Box>
  );
};

interface DamageListItemProps {
  damage: any;
  isSelected: boolean;
  onSelect: () => void;
  onPay: () => void;
  onDelete: () => void;
  t: (key: string, fallback?: string) => string;
}

function DamageListItem({
  damage,
  isSelected,
  onSelect,
  onPay,
  onDelete,
  t,
}: DamageListItemProps) {
  const hasCoords =
    damage.coord_x != null && damage.coord_y != null && damage.coord_z != null;
  const typeColor =
    DAMAGE_TYPES.find((dt) => dt.value === damage.type)?.color || "grey.700";

  return (
    <Paper
      variant="outlined"
      onClick={onSelect}
      sx={{
        p: 1.5,
        cursor: "pointer",
        transition: "all 0.15s ease",
        borderColor: isSelected ? "primary.main" : "divider",
        borderWidth: isSelected ? 2 : 1,
        bgcolor: isSelected ? "action.selected" : "background.paper",
        "&:hover": {
          borderColor: isSelected ? "primary.main" : "action.hover",
          bgcolor: isSelected ? "action.selected" : "action.hover",
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Avatar
          src={damage.image_url}
          variant="rounded"
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            bgcolor: typeColor,
          }}
        >
          <BuildIcon sx={{ fontSize: 18 }} />
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            flexWrap="wrap"
            gap={0.5}
          >
            <Typography variant="body2" fontWeight="bold">
              {t(
                "cars.damages.enums.types." + damage.type,
                damage.type || "OTHER",
              )}
            </Typography>
            <Chip
              label={
                damage.is_paid
                  ? t("cars.damages.status.paid", "Paid")
                  : t("cars.damages.status.unpaid", "Unpaid")
              }
              color={damage.is_paid ? "success" : "error"}
              size="small"
              variant={damage.is_paid ? "filled" : "outlined"}
              sx={{
                height: 20,
                "& .MuiChip-label": { fontSize: "0.65rem", px: 0.5 },
              }}
            />
            {hasCoords && (
              <Tooltip
                title={
                  "X: " +
                  damage.coord_x +
                  ", Y: " +
                  damage.coord_y +
                  ", Z: " +
                  damage.coord_z
                }
              >
                <ThreeDRotationIcon
                  sx={{ fontSize: 14, color: "primary.main", flexShrink: 0 }}
                />
              </Tooltip>
            )}
          </Stack>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 0.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {damage.description || "\u2014"}
          </Typography>

          <Typography variant="caption" fontWeight="bold" color="text.primary">
            {"$" + Number(damage.repair_cost).toFixed(2)}
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
          {!damage.is_paid && (
            <Tooltip title={t("cars.damages.actions.markPaid", "Pay")}>
              <IconButton
                color="success"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onPay();
                }}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={t("cars.damages.actions.delete", "Delete")}>
            <IconButton
              color="error"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}

interface AddDamage3DDialogProps {
  open: boolean;
  onClose: () => void;
  carId: number;
  capturedCoords: { x: number; y: number; z: number } | null;
  onSuccess?: () => void;
}

function AddDamage3DDialog({
  open,
  onClose,
  carId,
  capturedCoords,
  onSuccess,
}: AddDamage3DDialogProps) {
  const t = useTranslate();
  const invalidate = useInvalidate();

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

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      reset({ type: "SCRATCH", description: "", repair_cost: 0 });
      setFile(null);
      setFilePreview(null);
    }
  }, [open, reset]);

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
        carId,
        type: data.type,
        description: data.description,
        repair_cost: Number(data.repair_cost),
        image_url: imageUrl || undefined,
        coord_x: capturedCoords ? Number(capturedCoords.x) : undefined,
        coord_y: capturedCoords ? Number(capturedCoords.y) : undefined,
        coord_z: capturedCoords ? Number(capturedCoords.z) : undefined,
      });

      invalidate({
        resource: "car-damages",
        invalidates: ["list", "resourceAll"],
      });
      if (onSuccess) onSuccess();
      reset();
      setFile(null);
      if (filePreview) URL.revokeObjectURL(filePreview);
      setFilePreview(null);
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
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
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
          <Stack spacing={2.5}>
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
                    {t("cars.damages.fields.coords", "3D Position Captured")}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    fontFamily="monospace"
                    color="primary.main"
                  >
                    {"X: " +
                      capturedCoords.x.toFixed(4) +
                      "  |  Y: " +
                      capturedCoords.y.toFixed(4) +
                      "  |  Z: " +
                      capturedCoords.z.toFixed(4)}
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
                        {t("cars.damages.enums.types." + dt.value, dt.value)}
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
                  <IconButton size="small" onClick={clearFile} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Paper>
              )}
            </Box>
          </Stack>
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
}
