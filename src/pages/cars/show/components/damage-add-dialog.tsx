import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
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
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";
import { useTranslate, useInvalidate } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { API_URL, axiosInstance } from "../../../../utility/axios-instance";
import { DAMAGE_TYPES } from "./damage-constants";

interface AddDamage3DDialogProps {
  open: boolean;
  onClose: () => void;
  carId: number;
  capturedCoords: { x: number; y: number; z: number } | null;
  onSuccess?: () => void;
}

export function AddDamage3DDialog({
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
