import React, { useMemo } from "react";
import {
  useDataGrid,
  List,
  DateField,
  EditButton,
  ShowButton,
} from "@refinedev/mui";
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
import { useTranslate } from "@refinedev/core";
import { CenteredCell } from "../../components/common/centered-cell";
import { CustomNoRowsOverlay } from "../../components/common/custom-no-rows-overlay";

export const RentalList = () => {
  const t = useTranslate();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );

  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
    // Если бэкенд не поддерживает сортировку/пагинацию через параметры _start/_sort,
    // Refine будет делать это на клиенте, если pagination.mode = "client".
    // Но пока оставим дефолт.
  });

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: t("table.id", "ID"),
        width: 70,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => <CenteredCell>{value ? `#${value}` : "—"}</CenteredCell>,
      },

      // 1. КОЛОНКА: АВТОМОБИЛЬ 🚗
      {
        field: "car",
        headerName: t("rentals.fields.car", "Car"),
        width: 280,
        renderCell: ({ row }) => {
          const car = row.car;
          const image = car?.images?.[0]?.url;
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
                sx={{ width: 50, height: 35 }}
              >
                🚗
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="bold" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>
                  {car ? `${car.brand} ${car.model}` : "—"}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>
                  {car?.license_plate || "—"}
                </Typography>
              </Box>
            </Stack>
          );
        },
      },

      // 2. КОЛОНКА: ВОДИТЕЛЬ 👤
      {
        field: "user",
        headerName: t("rentals.fields.user", "User"),
        width: 220,
        renderCell: ({ row }) => {
          const user = row.user;
          return (
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              height="100%"
            >
              <Avatar src={user?.avatar_url} sx={{ width: 32, height: 32 }}>
                {user?.first_name?.[0]}
              </Avatar>
              <Box>
                <Typography variant="body2" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>
                  {user ? `${user.first_name} ${user.last_name}` : "—"}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>
                  {user?.email || "—"}
                </Typography>
              </Box>
            </Stack>
          );
        },
      },

      // 3. КОЛОНКА: СТАТУС ✅
      {
        field: "status",
        headerName: t("rentals.fields.status", "Status"),
        width: 140,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => {
          let color: any = "default";

          switch (value) {
            case "ACTIVE":
              color = "success";
              break;
            case "APPROVED":
              color = "primary";
              break;
            case "CREATED":
              color = "info";
              break;
            case "OVERDUE":
              color = "warning";
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
                label={t(`rentals.enums.status.${value}`, value)}
                color={color}
                size="small"
                variant={value === "COMPLETED" ? "outlined" : "filled"}
              />
            </CenteredCell>
          );
        },
      },

      // 4. КОЛОНКА: ДАТЫ 📅 (На десктопе разбиваем, на мобилке - стеком)
      {
        field: "start_date",
        headerName: t("rentals.fields.startDate", "Start"),
        width: 140,
        renderCell: ({ value }) => (
          <CenteredCell>
            {value ? <DateField value={value} format="L HH:mm" /> : "—"}
          </CenteredCell>
        ),
      },
      {
        field: "end_date",
        headerName: t("rentals.fields.endDate", "End"),
        width: 140,
        renderCell: ({ value }) => (
          <CenteredCell>
            {value ? <DateField value={value} format="L HH:mm" /> : "—"}
          </CenteredCell>
        ),
      },

      // 5. КОЛОНКА: ЦЕНА 💰
      {
        field: "total_price",
        headerName: t("rentals.fields.price", "Total Price"),
        width: 120,
        align: "right",
        headerAlign: "right",
        renderCell: ({ row }) => {
          // Если аренда завершена, показываем total, иначе base
          const price = row.total_price || row.base_price || 0;
          const hasPenalty = row.penalty_price > 0;

          return (
            <Stack
              justifyContent="center"
              alignItems="flex-end"
              height="100%"
              width="100%"
            >
              <Typography fontWeight="bold">${price}</Typography>
              {hasPenalty && (
                <Typography variant="caption" color="error">
                  +${row.penalty_price} fine
                </Typography>
              )}
            </Stack>
          );
        },
      },

      // 6. ACTIONS ⚙️
      {
        field: "actions",
        headerName: t("table.actions"),
        sortable: false,
        width: 120,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <CenteredCell spacing={1}>
            <EditButton size="small" hideText recordItemId={row.id} />
            <ShowButton size="small" hideText recordItemId={row.id} />
          </CenteredCell>
        ),
      },
    ],
    [t, isMobile],
  );

  return (
    <List>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        density="comfortable"
        pageSizeOptions={[10, 25, 50, 100]}
        columnVisibilityModel={{
          id: !isMobile,
          start_date: !isMobile,
          end_date: !isMobile,
          email: !isMobile,
        }}
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
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
      />
    </List>
  );
};
