import React, { useState, useCallback, Suspense, lazy } from "react";
import { useList, useTranslate, useInvalidate, useCustomMutation } from "@refinedev/core";
import { useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Stack,
  Typography,
  Button,
  Chip,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";
import { API_URL, axiosInstance } from "../../../../utility/axios-instance";
import { DamageListItem } from "./damage-list-item";
import { AddDamage3DDialog } from "./damage-add-dialog";

const ThreeCarScene = lazy(() => import("./ThreeCarScene"));

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
