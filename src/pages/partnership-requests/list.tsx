import React, { useMemo } from "react";
import { List, ShowButton } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Chip,
  Stack,
  Typography,
  Box,
  useMediaQuery,
  Theme,
  Avatar,
} from "@mui/material";
import { useTranslate, useList } from "@refinedev/core";
import { DateField } from "@refinedev/mui";

import { CenteredCell } from "../../components/common/centered-cell";

export const PartnershipRequestList = () => {
  const t = useTranslate();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );

  const { result, isLoading } = useList({
    resource: "partnership-requests",
    pagination: { mode: "off" },
    sorters: [
      {
        field: "created_at",
        order: "desc",
      },
    ],
  }) as any;

  const rows = result?.data || [];

  const columns = useMemo<GridColDef[]>(() => {
    const baseColumns: GridColDef[] = [
      {
        field: "id",
        headerName: t("partnership_requests.fields.id", "ID"),
        width: 70,
        renderCell: ({ value }) => <CenteredCell>#{value}</CenteredCell>,
      },
      {
        field: "car",
        headerName: t("partnership_requests.fields.car", "Автомобиль"),
        width: 300, // 👈 Увеличили ширину, как в машинах
        renderCell: ({ row }) => {
          const image = row.photos?.[0];
          return (
            // 👇 Тот самый паттерн с height="100%"
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              height="100%"
            >
              <Avatar
                src={image}
                variant="rounded"
                sx={{ width: 60, height: 40 }}
              >
                🚗
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {row.car_brand} {row.car_model}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t("partnership_requests.fields.year", "Год")}: {row.car_year}
                </Typography>
              </Box>
            </Stack>
          );
        },
      },
      {
        field: "owner",
        headerName: t("partnership_requests.fields.owner", "Владелец"),
        width: 200,
        renderCell: ({ row }) => (
          <Stack justifyContent="center" height="100%">
            <Typography variant="body2" fontWeight="bold">
              {row.owner_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.owner_phone}
            </Typography>
          </Stack>
        ),
      },
      {
        field: "status",
        headerName: t("partnership_requests.fields.status", "Статус"),
        width: 140,
        renderCell: ({ value }) => {
          let color: "info" | "success" | "error" | "default" = "default";
          if (value === "NEW") color = "info";
          if (value === "APPROVED") color = "success";
          if (value === "REJECTED") color = "error";

          const translatedStatus = t(
            `partnership_requests.status.${value}`,
            value,
          );

          return (
            <CenteredCell>
              <Chip
                label={translatedStatus}
                color={color}
                size="small"
                variant={value === "NEW" ? "filled" : "outlined"}
                sx={{ fontWeight: "bold" }}
              />
            </CenteredCell>
          );
        },
      },
      {
        field: "created_at",
        headerName: t("partnership_requests.fields.created_at", "Дата заявки"),
        width: 160,
        renderCell: ({ value }) => (
          <CenteredCell>
            <DateField value={value} format="DD.MM.YYYY HH:mm" />
          </CenteredCell>
        ),
      },
      {
        field: "actions",
        headerName: t("table.actions", "Действия"),
        sortable: false,
        width: 120,
        renderCell: ({ row }) => (
          <CenteredCell spacing={1}>
            <ShowButton size="small" hideText recordItemId={row.id} />
          </CenteredCell>
        ),
      },
    ];

    if (isMobile) {
      return baseColumns.filter(
        (c) =>
          c.field !== "id" && c.field !== "created_at" && c.field !== "owner",
      );
    }

    return baseColumns;
  }, [t, isMobile]);

  return (
    <List title={t("partnership_requests.list.title", "Заявки Партнеров")}>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          hideFooter={true}
          loading={isLoading}
          rowHeight={90} // 👈 Обязательно увеличиваем высоту строки, чтобы аватарке было не тесно
          sx={{
            border: "none",
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f0f0",
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
    </List>
  );
};
