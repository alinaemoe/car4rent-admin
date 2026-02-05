import React, { useMemo } from "react";
import { useList, useTranslate } from "@refinedev/core";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Stack,
  Chip,
  Avatar,
  Typography,
  Box,
  CircularProgress,
  useMediaQuery,
  Theme,
} from "@mui/material";
import { DateField } from "@refinedev/mui";
import { CenteredCell } from "../../../components/common/centered-cell";

interface CarRentalsTabProps {
  carId: string | number;
}

// 👇 ПЕРЕИМЕНОВАЛ КОМПОНЕНТ: CarRentalsTab
export const CarRentalsTab = ({ carId }: CarRentalsTabProps) => {
  const t = useTranslate();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );

  const { result, isLoading } = useList({
    resource: "rentals",
    filters: [
      {
        field: "car.id", // 👈 ФИЛЬТРУЕМ ПО МАШИНЕ
        operator: "eq",
        value: carId,
      },
    ],
    sorters: [
      {
        field: "created_at",
        order: "desc",
      },
    ],
    pagination: {
      mode: "off",
    },
  }) as any;

  const rows = result?.data || [];

  const columns = useMemo<GridColDef[]>(() => {
    const baseColumns: GridColDef[] = [
      {
        field: "id",
        headerName: "ID",
        width: 70,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => <CenteredCell>#{value}</CenteredCell>,
      },
      // 👇 ВАЖНО: ТУТ МЫ ПОКАЗЫВАЕМ ЮЗЕРА (ВОДИТЕЛЯ), А НЕ МАШИНУ
      {
        field: "user",
        headerName: t("rentals.fields.driver", "Driver"),
        width: 250,
        renderCell: ({ row }) => {
          const user = row.user;
          return (
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              height="100%"
            >
              <Avatar src={user?.avatar_url} sx={{ width: 35, height: 35 }}>
                {user?.first_name?.[0]}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </Stack>
          );
        },
      },
      {
        field: "status",
        headerName: t("rentals.fields.status", "Status"),
        width: 140,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => {
          let color:
            | "default"
            | "primary"
            | "secondary"
            | "error"
            | "info"
            | "success"
            | "warning" = "default";

          switch (value) {
            case "ACTIVE":
              color = "success";
              break;
            case "CREATED":
              color = "info";
              break;
            case "APPROVED":
              color = "primary";
              break;
            case "COMPLETED":
              color = "default";
              break;
            case "CANCELED":
            case "REJECTED":
              color = "error";
              break;
          }

          return (
            <CenteredCell>
              <Chip
                label={value}
                color={color}
                size="small"
                variant={value === "COMPLETED" ? "outlined" : "filled"}
              />
            </CenteredCell>
          );
        },
      },
      {
        field: "total_price",
        headerName: t("rentals.fields.price", "Price"),
        width: 120,
        align: "right",
        headerAlign: "right",
        renderCell: ({ row }) => {
          const price = row.total_price || row.base_price;
          return (
            <Stack
              justifyContent="center"
              height="100%"
              width="100%"
              alignItems="flex-end"
            >
              <Typography fontWeight="bold">${price}</Typography>
              {row.penalty_price > 0 && (
                <Typography variant="caption" color="error">
                  + ${row.penalty_price} fine
                </Typography>
              )}
            </Stack>
          );
        },
      },
    ];

    if (isMobile) {
      // На мобилке — один столбец с двумя датами
      baseColumns.splice(3, 0, {
        field: "dates",
        headerName: t("rentals.fields.dates", "Dates"),
        width: 220,
        renderCell: ({ row }) => (
          <Stack justifyContent="center" height="100%">
            <Typography variant="caption" color="text.secondary">
              Start:
            </Typography>
            <DateField value={row.start_date} format="L HH:mm" />

            <Typography variant="caption" color="text.secondary" mt={0.5}>
              End:
            </Typography>
            <DateField value={row.end_date} format="L HH:mm" />
          </Stack>
        ),
      });
    } else {
      // На десктопе — два отдельных столбца: start_date и end_date
      baseColumns.splice(
        3,
        0,
        {
          field: "start_date",
          headerName: t("rentals.fields.start_date", "Start Date"),
          width: 140,
          renderCell: ({ value }) => (
            <CenteredCell>
              <DateField value={value} format="L HH:mm" />
            </CenteredCell>
          ),
        },
        {
          field: "end_date",
          headerName: t("rentals.fields.end_date", "End Date"),
          width: 140,
          renderCell: ({ value }) => (
            <CenteredCell>
              <DateField value={value} format="L HH:mm" />
            </CenteredCell>
          ),
        },
      );
    }

    return baseColumns;
  }, [t, isMobile]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (rows.length === 0) {
    return (
      <Box textAlign="center" py={5} color="text.secondary">
        <Typography>Нет активных или прошлых аренд</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooter={true}
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
  );
};
