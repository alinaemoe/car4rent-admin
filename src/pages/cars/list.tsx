import React, { useMemo } from "react";
import {
  useDataGrid,
  List,
  EditButton,
  ShowButton,
  DeleteButton,
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

export const CarList = () => {
  const t = useTranslate();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );

  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
  });

  const columns = useMemo<GridColDef[]>(() => {
    const baseColumns: GridColDef[] = [
      {
        field: "id",
        headerName: t("table.id", "ID"),
        width: 70,
        renderCell: ({ value }) => <CenteredCell>#{value}</CenteredCell>,
      },
      {
        field: "brand",
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
                <Typography variant="body2" fontWeight="bold" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220 }}>
                  {row.brand} {row.model}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220 }}>
                  {row.year} • {row.license_plate}
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
                label={t(`cars.enums.status.${value}`, value)}
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
            {row.status === "AVAILABLE" && (
              <DeleteButton size="small" hideText recordItemId={row.id} />
            )}
          </CenteredCell>
        ),
      },
    ];

    return baseColumns;
  }, [t]);

  return (
    <List>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        density="comfortable"
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        columnVisibilityModel={{
          id: !isMobile,
          price_per_day: !isMobile,
        }}
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
        disableRowSelectionOnClick
      />
    </List>
  );
};
