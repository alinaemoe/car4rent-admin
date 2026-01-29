import React, { useMemo } from "react";
import { List, EditButton, ShowButton, DeleteButton } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Avatar,
  Chip,
  Stack,
  Typography,
  Box,
  useMediaQuery,
  Theme,
} from "@mui/material";
import { useTranslate, useList } from "@refinedev/core";

// Твой компонент
import { CenteredCell } from "../../components/common/centered-cell";

export const CarList = () => {
  const t = useTranslate();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );

  // 👇 ТВОЙ ПАТТЕРН: result вместо data
  const { result, isLoading } = useList({
    resource: "cars",
    pagination: { mode: "off" }, // Пока без пагинации, если машин немного
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
        headerName: "ID",
        width: 70,
        renderCell: ({ value }) => <CenteredCell>#{value}</CenteredCell>,
      },
      {
        field: "brand", // Объединяем Бренд + Модель + Фото
        headerName: t("cars.fields.car", "Car"),
        width: 300,
        renderCell: ({ row }) => {
          const image = row.images?.[0]?.url;
          return (
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
                  {row.brand} {row.model}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {row.year} • {row.number_plate}
                </Typography>
              </Box>
            </Stack>
          );
        },
      },
      {
        field: "price_per_day",
        headerName: t("cars.fields.price", "Price / Day"),
        width: 120,
        renderCell: ({ value }) => (
          <CenteredCell>
            <Typography fontWeight="bold">${value}</Typography>
          </CenteredCell>
        ),
      },
      {
        field: "status",
        headerName: t("cars.fields.status", "Status"),
        width: 140,
        renderCell: ({ value }) => {
          let color: "success" | "warning" | "error" | "default" = "default";

          if (value === "AVAILABLE") color = "success";
          if (value === "RENTED") color = "warning";
          if (value === "MAINTENANCE") color = "error";

          return (
            <CenteredCell>
              <Chip
                label={value}
                color={color}
                size="small"
                variant={value === "RENTED" ? "outlined" : "filled"}
              />
            </CenteredCell>
          );
        },
      },
      {
        field: "actions",
        headerName: t("table.actions", "Actions"),
        sortable: false,
        width: 150,
        renderCell: ({ row }) => (
          <CenteredCell spacing={1}>
            <EditButton size="small" hideText recordItemId={row.id} />
            <ShowButton size="small" hideText recordItemId={row.id} />
            {/* Удаление только если машина свободна (пример логики) */}
            {row.status === "AVAILABLE" && (
              <DeleteButton size="small" hideText recordItemId={row.id} />
            )}
          </CenteredCell>
        ),
      },
    ];

    // Адаптив: на мобилке скрываем ID и Цену, оставляем Главное и Статус
    if (isMobile) {
      return baseColumns.filter(
        (c) => c.field !== "id" && c.field !== "price_per_day",
      );
    }

    return baseColumns;
  }, [t, isMobile]);

  return (
    <List>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          hideFooter={true}
          loading={isLoading}
          rowHeight={90}
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
