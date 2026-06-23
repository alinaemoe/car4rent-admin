import React, { useState, useCallback, Suspense, lazy, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Grid,
  Box,
  Typography,
  Paper,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Divider,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import BuildIcon from "@mui/icons-material/Build";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { useTranslate } from "@refinedev/core";

import { API_URL, axiosInstance } from "../../../utility/axios-instance";
import { DAMAGE_TYPES } from "../../cars/show/components/damage-constants";

const ThreeCarScene = lazy(
  () => import("../../cars/show/components/ThreeCarScene"),
);

// Локальная стейдж-модель повреждения (ещё не сохранённого на бэке)
export interface StagedDamage {
  tempId: number;
  type: string;
  description: string;
  repair_cost: number;
  image_url?: string;
  coord_x: number | null;
  coord_y: number | null;
  coord_z: number | null;
}

export interface FinishPayload {
  end_mileage: number;
  end_fuel: number;
  actual_return_date: string;
  damages: Omit<StagedDamage, "tempId">[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  carImageUrl?: string;
  basePrice?: number;
  onConfirm: (payload: FinishPayload) => void;
  isSubmitting?: boolean;
}

const emptyDraft = () => ({
  type: "SCRATCH",
  description: "",
  repair_cost: 0,
  image_url: "" as string | undefined,
  coords: null as { x: number; y: number; z: number } | null,
});

export const FinishRentalDialog: React.FC<Props> = ({
  open,
  onClose,
  basePrice = 0,
  onConfirm,
  isSubmitting,
}) => {
  const t = useTranslate();

  const [endMileage, setEndMileage] = useState(0);
  const [endFuel, setEndFuel] = useState(100);
  const [returnDate, setReturnDate] = useState(
    dayjs().format("YYYY-MM-DDTHH:mm:ss"),
  );

  const [damages, setDamages] = useState<StagedDamage[]>([]);
  const [draft, setDraft] = useState(emptyDraft());
  const [is3DReady, setIs3DReady] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Метки для 3D-сцены: уже добавленные повреждения (с координатами)
  const sceneDamages = useMemo(
    () =>
      damages
        .filter((d) => d.coord_x != null)
        .map((d) => ({
          id: d.tempId,
          coord_x: Number(d.coord_x),
          coord_y: Number(d.coord_y),
          coord_z: Number(d.coord_z),
          type: d.type,
          description: d.description,
          repair_cost: d.repair_cost,
          is_paid: false,
        })),
    [damages],
  );

  const repairTotal = useMemo(
    () => damages.reduce((sum, d) => sum + (Number(d.repair_cost) || 0), 0),
    [damages],
  );

  const handleCarClick = useCallback(
    (position: { x: number; y: number; z: number }) => {
      setDraft((prev) => ({ ...prev, coords: position }));
    },
    [],
  );

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axiosInstance.post(
        `${API_URL}/car-damages/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setDraft((prev) => ({ ...prev, image_url: res.data.url }));
    } catch (err) {
      console.error("Damage photo upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const addDamage = () => {
    if (!draft.description.trim()) return;
    setDamages((prev) => [
      ...prev,
      {
        tempId: Date.now() + prev.length,
        type: draft.type,
        description: draft.description.trim(),
        repair_cost: Number(draft.repair_cost) || 0,
        image_url: draft.image_url || undefined,
        coord_x: draft.coords?.x ?? null,
        coord_y: draft.coords?.y ?? null,
        coord_z: draft.coords?.z ?? null,
      },
    ]);
    setDraft(emptyDraft());
  };

  const removeDamage = (tempId: number) =>
    setDamages((prev) => prev.filter((d) => d.tempId !== tempId));

  const handleConfirm = () => {
    onConfirm({
      end_mileage: endMileage,
      end_fuel: endFuel,
      actual_return_date: returnDate,
      damages: damages.map(({ tempId: _tempId, ...rest }) => rest),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {t("rentals.edit.finishDialogTitle", "Завершение аренды и приём авто")}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* ЛЕВО: параметры возврата */}
          <Grid item xs={12} md={5}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              {t("rentals.edit.returnParams", "Параметры возврата")}
            </Typography>
            <Stack spacing={2.5}>
              <TextField
                label={t("rentals.edit.endMileage", "Пробег при возврате (км)")}
                type="number"
                fullWidth
                value={endMileage}
                onChange={(e) => setEndMileage(Number(e.target.value))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">км</InputAdornment>
                  ),
                }}
              />
              <TextField
                label={t("rentals.edit.endFuel", "Топливо при возврате (%)")}
                type="number"
                fullWidth
                value={endFuel}
                onChange={(e) => setEndFuel(Number(e.target.value))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">%</InputAdornment>
                  ),
                }}
                inputProps={{ min: 0, max: 100 }}
              />
              <DateTimePicker
                label={t("rentals.edit.actualReturnDate", "Дата возврата")}
                value={dayjs(returnDate)}
                onChange={(v) => v && setReturnDate(v.toISOString())}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Stack>

            <Divider sx={{ my: 2.5 }} />

            {/* Сводка по деньгам */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 0.5 }}
              >
                <Typography variant="body2" color="text.secondary">
                  {t("rentals.edit.basePrice", "Базовая стоимость")}
                </Typography>
                <Typography variant="body2">
                  {Number(basePrice).toFixed(2)} Br
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  {t("rentals.edit.repairTotal", "Ремонт повреждений")}
                </Typography>
                <Typography variant="body2" color="error.main">
                  +{repairTotal.toFixed(2)} Br
                </Typography>
              </Stack>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                {t(
                  "rentals.edit.penaltyNote",
                  "Штрафы за пробег/топливо/просрочку бэкенд досчитает сам.",
                )}
              </Typography>
            </Paper>
          </Grid>

          {/* ПРАВО: 3D-аудит повреждений */}
          <Grid item xs={12} md={7}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              {t("rentals.edit.damageAudit", "3D-аудит повреждений")}
            </Typography>

            <Box sx={{ height: 320, position: "relative" }}>
              <Suspense
                fallback={
                  <Box
                    sx={{
                      height: "100%",
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
                  damages={sceneDamages}
                  selectedDamageId={null}
                  onCarClick={handleCarClick}
                  onPinClick={() => {}}
                  onSceneReady={() => setIs3DReady(true)}
                  previewCoords={draft.coords}
                />
              </Suspense>
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", textAlign: "center", fontStyle: "italic" }}
            >
              {draft.coords
                ? t("rentals.edit.coordsCaptured", "Точка отмечена на модели ✓")
                : t(
                    "cars.damages.messages.clickOnCar",
                    "Кликните по авто, чтобы отметить место повреждения",
                  )}
              {!is3DReady && <CircularProgress size={12} sx={{ ml: 1 }} />}
            </Typography>

            {/* Форма добавления повреждения */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>
                      {t("cars.damages.fields.type", "Тип")}
                    </InputLabel>
                    <Select
                      label={t("cars.damages.fields.type", "Тип")}
                      value={draft.type}
                      onChange={(e) =>
                        setDraft((p) => ({ ...p, type: e.target.value }))
                      }
                    >
                      {DAMAGE_TYPES.map((dt) => (
                        <MenuItem key={dt.value} value={dt.value}>
                          {t(`cars.damages.enums.types.${dt.value}`, dt.value)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    size="small"
                    fullWidth
                    type="number"
                    label={t("cars.damages.fields.repairCost", "Стоимость")}
                    value={draft.repair_cost}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        repair_cost: Number(e.target.value),
                      }))
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">Br</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    label={t("cars.damages.fields.description", "Описание")}
                    value={draft.description}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, description: e.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                      component="label"
                      size="small"
                      variant="outlined"
                      startIcon={
                        uploading ? (
                          <CircularProgress size={14} />
                        ) : (
                          <CloudUploadIcon />
                        )
                      }
                      disabled={uploading}
                    >
                      {draft.image_url
                        ? t("cars.damages.actions.photoAdded", "Фото добавлено")
                        : t("cars.damages.actions.addPhoto", "Фото")}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleUploadPhoto}
                      />
                    </Button>
                    <Box sx={{ flex: 1 }} />
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddLocationIcon />}
                      onClick={addDamage}
                      disabled={!draft.description.trim()}
                    >
                      {t("cars.damages.actions.add", "Добавить")}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Список добавленных повреждений */}
            {damages.length === 0 ? (
              <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
                {t(
                  "rentals.edit.noDamages",
                  "Повреждений нет — авто принято без замечаний.",
                )}
              </Alert>
            ) : (
              <Stack spacing={1} sx={{ mt: 2, maxHeight: 180, overflow: "auto" }}>
                {damages.map((d) => (
                  <Paper
                    key={d.tempId}
                    variant="outlined"
                    sx={{
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <BuildIcon fontSize="small" color="action" />
                    <Chip
                      size="small"
                      label={t(
                        `cars.damages.enums.types.${d.type}`,
                        d.type,
                      )}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {d.description}
                    </Typography>
                    {d.coord_x != null && (
                      <Chip
                        size="small"
                        variant="outlined"
                        color="primary"
                        label="3D"
                      />
                    )}
                    <Typography variant="body2" fontWeight="bold">
                      {Number(d.repair_cost).toFixed(2)} Br
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeDamage(d.tempId)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Paper>
                ))}
              </Stack>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          {t("buttons.cancel", "Отмена")}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="success"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : undefined}
        >
          {t("rentals.edit.confirmFinish", "Завершить аренду")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
