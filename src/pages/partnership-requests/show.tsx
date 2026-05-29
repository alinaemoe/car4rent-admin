import React from "react";
import { useShow, useUpdate, useTranslate } from "@refinedev/core";
import { Show } from "@refinedev/mui";
import {
  Typography,
  Stack,
  Chip,
  Box,
  Divider,
  Grid,
  Paper,
  Button,
  ImageList,
  ImageListItem,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { DateField } from "@refinedev/mui";

export const PartnershipRequestShow = () => {
  const t = useTranslate(); // 👈 Добавили хук перевода
  const { query } = useShow() as any;
  const { mutate, isLoading: isUpdating } = useUpdate() as any;

  const isLoading = query?.isLoading;
  const record = query?.data?.data;

  if (isLoading) return <div>{t("buttons.loading", "Loading...")}</div>;
  if (!record) return <div>{t("messages.no_data", "No data found")}</div>;

  const handleStatusChange = (newStatus: "APPROVED" | "REJECTED") => {
    mutate({
      resource: "partnership-requests",
      id: record.id,
      values: { status: newStatus },
      mutationMode: "optimistic",
    });
  };

  const handleCreateCar = () => {
    const brand = encodeURIComponent(record.car_brand);
    const model = encodeURIComponent(record.car_model);
    const year = record.car_year;
    const ownerId = record.user?.id || "";
    // Собираем картинки в строку через запятую
    const photos = record.photos
      ? encodeURIComponent(record.photos.join(","))
      : "";

    window.location.href = `/cars/create?brand=${brand}&model=${model}&year=${year}&owner_id=${ownerId}&photos=${photos}`;
  };

  const translatedStatus = t(
    `partnership_requests.status.${record.status}`,
    record.status,
  );

  return (
    <Show
      isLoading={isLoading}
      title={t("partnership_requests.show.title", "Просмотр заявки")}
    >
      {/* --- HEADER --- */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {t("partnership_requests.show.request_id", "Заявка #")}
            {record.id}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("partnership_requests.show.from", "От")}{" "}
            <DateField value={record.created_at} format="DD.MM.YYYY HH:mm" />
          </Typography>
        </Box>

        <Chip
          label={translatedStatus}
          color={
            record.status === "NEW"
              ? "info"
              : record.status === "APPROVED"
              ? "success"
              : "error"
          }
          sx={{ fontWeight: "bold", px: 2, py: 2.5, fontSize: "1rem" }}
        />
      </Stack>

      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={4}>
        {/* ЛЕВАЯ КОЛОНКА */}
        <Grid item xs={12} md={5}>
          <Typography variant="h6" gutterBottom>
            {t("partnership_requests.show.car_details", "Детали автомобиля")}
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("partnership_requests.show.brand_model", "Марка и Модель")}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {record.car_brand} {record.car_model}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("partnership_requests.show.year", "Год выпуска")}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {record.car_year}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Typography variant="h6" gutterBottom>
            {t("partnership_requests.show.owner", "Владелец")}
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("partnership_requests.show.owner_name", "Имя")}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {record.owner_name}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("partnership_requests.show.owner_phone", "Телефон")}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {record.owner_phone}
                </Typography>
              </Box>
              {record.user && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t(
                      "partnership_requests.show.user_id",
                      "ID пользователя в системе",
                    )}
                  </Typography>
                  <Typography variant="body1">#{record.user.id}</Typography>
                </Box>
              )}
            </Stack>
          </Paper>

          {/* БЛОК ДЕЙСТВИЙ */}
          <Box p={3} bgcolor="#f8f9fa" borderRadius={2}>
            <Typography
              variant="subtitle2"
              gutterBottom
              color="text.secondary"
              textTransform="uppercase"
            >
              {t("partnership_requests.show.management", "Управление заявкой")}
            </Typography>

            {record.status === "NEW" && (
              <Stack direction="row" spacing={2} mt={2}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleStatusChange("APPROVED")}
                  disabled={isUpdating}
                  fullWidth
                >
                  {t("partnership_requests.buttons.approve", "Одобрить")}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => handleStatusChange("REJECTED")}
                  disabled={isUpdating}
                  fullWidth
                >
                  {t("partnership_requests.buttons.reject", "Отклонить")}
                </Button>
              </Stack>
            )}

            {record.status === "APPROVED" && (
              <Box mt={2}>
                <Typography variant="body2" color="success.main" mb={2}>
                  {t(
                    "partnership_requests.messages.approved_msg",
                    "Заявка одобрена. Теперь вы можете добавить этот автомобиль в каталог.",
                  )}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<DirectionsCarIcon />}
                  onClick={handleCreateCar}
                  fullWidth
                >
                  {t(
                    "partnership_requests.buttons.create_car",
                    "Создать автомобиль",
                  )}
                </Button>
              </Box>
            )}

            {record.status === "REJECTED" && (
              <Typography variant="body2" color="error" mt={2}>
                {t(
                  "partnership_requests.messages.rejected_msg",
                  "Заявка была отклонена.",
                )}
              </Typography>
            )}
          </Box>
        </Grid>

        {/* ПРАВАЯ КОЛОНКА */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom>
            {t("partnership_requests.show.photos", "Фотографии от владельца")}
          </Typography>
          {record.photos && record.photos.length > 0 ? (
            <ImageList variant="masonry" cols={2} gap={8}>
              {record.photos.map((photo: string, index: number) => (
                <ImageListItem key={index}>
                  <img
                    src={photo}
                    alt={`Car photo ${index + 1}`}
                    loading="lazy"
                    style={{ borderRadius: 8, cursor: "pointer" }}
                    onClick={() => window.open(photo, "_blank")}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <Paper
              variant="outlined"
              sx={{ p: 4, textAlign: "center", bgcolor: "#fafafa" }}
            >
              <Typography color="text.secondary">
                {t(
                  "partnership_requests.messages.no_photos",
                  "Фотографии не были загружены.",
                )}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Show>
  );
};
