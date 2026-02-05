import React, { useState } from "react";
import {
  useList,
  useTranslate,
  useInvalidate,
  useCustomMutation,
} from "@refinedev/core";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useForm } from "react-hook-form";
import {
  Box,
  Avatar,
  Chip,
  Button,
  Stack,
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
  Typography,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BuildIcon from "@mui/icons-material/Build";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { API_URL, axiosInstance } from "../../../utility/axios-instance";
import { CenteredCell } from "../../../components/common/centered-cell";

// ENUMS
const DAMAGE_TYPES = [
  { value: "SCRATCH", label: "Scratch" },
  { value: "DENT", label: "Dent" },
  { value: "SALON", label: "Interior/Salon" },
  { value: "WHEEL", label: "Wheel" },
  { value: "OTHER", label: "Other" },
];

interface DamagesTabProps {
  carId: number;
}

export const CarDamagesTab = ({ carId }: DamagesTabProps) => {
  const t = useTranslate();
  const invalidate = useInvalidate();
  const { mutate: markPaid } = useCustomMutation();

  // Состояние модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- DATA FETCHING ---
  const { result, query } = useList({
    resource: "car-damages",
    filters: [{ field: "carId", operator: "eq", value: carId }],
  }) as any;

  const rows = result?.data || [];
  const isLoading = query?.isLoading;

  // --- HANDLERS ---
  const handleDelete = async (id: number) => {
    if (!window.confirm(t("common.confirm.delete", "Are you sure?"))) return;
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
          message: t("notifications.markedPaid", "Marked as Paid"),
          type: "success",
        }),
      },
      {
        onSuccess: () =>
          invalidate({ resource: "car-damages", invalidates: ["list"] }),
      },
    );
  };

  // --- COLUMNS ---
  const columns: GridColDef[] = [
    {
      field: "image_url",
      headerName: t("cars.damages.fields.photo", "Photo"),
      width: 80,
      renderCell: ({ value }) => (
        <CenteredCell>
          <Avatar src={value} variant="rounded" sx={{ width: 50, height: 50 }}>
            <BuildIcon />
          </Avatar>
        </CenteredCell>
      ),
    },
    {
      field: "type",
      headerName: t("cars.damages.fields.type", "Type"),
      width: 120,
      renderCell: ({ value }) => (
        <CenteredCell>
          {DAMAGE_TYPES.find((d) => d.value === value)?.label || value}
        </CenteredCell>
      ),
    },
    {
      field: "description",
      headerName: t("cars.damages.fields.description", "Description"),
      flex: 1,
    },
    {
      field: "repair_cost",
      headerName: t("cars.damages.fields.cost", "Cost"),
      width: 100,
      renderCell: ({ value }) => <CenteredCell>${value}</CenteredCell>,
    },
    {
      field: "is_paid",
      headerName: t("cars.damages.fields.status", "Status"),
      width: 120,
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
      width: 120,
      sortable: false,
      renderCell: ({ row }) => (
        <CenteredCell>
          {!row.is_paid && (
            <Tooltip title="Mark as Paid">
              <IconButton
                color="success"
                size="small"
                onClick={() => handlePay(row.id)}
              >
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete">
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
  ];

  return (
    <Box sx={{ mt: 2, height: 400, width: "100%" }}>
      <Stack direction="row" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          startIcon={<BuildIcon />}
          size="small"
          onClick={() => setIsModalOpen(true)} // Открываем модалку
        >
          {t("cars.damages.actions.add", "Add Damage")}
        </Button>
      </Stack>

      <DataGrid
        rows={rows}
        columns={columns}
        rowHeight={70}
        hideFooter
        loading={isLoading}
        sx={{ border: "none" }}
      />

      {/* 👇 ВСТАВЛЯЕМ МОДАЛКУ СЮДА */}
      <AddDamageDialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        carId={carId}
      />
    </Box>
  );
};

// ==========================================
// SUB-COMPONENT: ADD DAMAGE DIALOG
// ==========================================

interface AddDamageDialogProps {
  open: boolean;
  onClose: () => void;
  carId: number;
}

const AddDamageDialog = ({ open, onClose, carId }: AddDamageDialogProps) => {
  const t = useTranslate();
  const invalidate = useInvalidate();

  // Используем обычный react-hook-form, так как это изолированная форма
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      let imageUrl = "";

      // 1. Если есть файл, грузим его
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await axiosInstance.post(
          "/car-damages/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        imageUrl = uploadRes.data.url;
      }

      // 2. Создаем запись о повреждении
      await axiosInstance.post("/car-damages", {
        carId: carId,
        type: data.type,
        description: data.description,
        repair_cost: Number(data.repair_cost),
        image_url: imageUrl || undefined,
      });

      // 3. Успех
      invalidate({ resource: "car-damages", invalidates: ["list"] });
      reset();
      setFile(null);
      onClose();
    } catch (error) {
      console.error("Failed to add damage", error);
      // Тут можно добавить notification.open({ type: 'error' ... })
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t("cars.damages.actions.add", "Add Damage Record")}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            {/* Type Select */}
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                defaultValue="SCRATCH"
                label="Type"
                {...register("type", { required: true })}
              >
                {DAMAGE_TYPES.map((dt) => (
                  <MenuItem key={dt.value} value={dt.value}>
                    {dt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Description */}
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              {...register("description", {
                required: "Description is required",
              })}
              error={!!errors.description}
              helperText={errors.description?.message as string}
            />

            {/* Cost */}
            <TextField
              label="Repair Cost"
              type="number"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              {...register("repair_cost", { required: true, min: 0 })}
            />

            {/* Image Upload */}
            <Box
              sx={{
                border: "1px dashed grey",
                p: 2,
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              <Button
                component="label"
                startIcon={<CloudUploadIcon />}
                size="small"
              >
                Upload Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setFile(e.target.files[0]);
                  }}
                />
              </Button>
              {file && (
                <Typography variant="caption" display="block" mt={1}>
                  Selected: {file.name}
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
