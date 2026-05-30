import React, { useMemo } from "react";
import { useDataGrid, List, ShowButton } from "@refinedev/mui";
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
import { useTranslate } from "@refinedev/core";
import { DateField } from "@refinedev/mui";

import { CenteredCell } from "../../components/common/centered-cell";
import { CustomNoRowsOverlay } from "../../components/common/custom-no-rows-overlay";

export const PartnershipRequestList = () => {
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
        headerName: t("partnership_requests.fields.id", "ID"),
        width: 70,
        renderCell: ({ value }) => <CenteredCell>#{value}</CenteredCell>,
      },
      {
        field: "car",
        headerName: t("partnership_requests.fields.car", "Car"),
        width: 300,
        renderCell: ({ row }) => {
          const image = row.photos?.[0];
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
                <Typography variant="body2" fontWeight="bold" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>
                  {row.car_brand} {row.car_model}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>
                  {t("partnership_requests.fields.year", "Year")}: {row.car_year}
                </Typography>
              </Box>
            </Stack>
          );
        },
      },
      {
        field: "owner",
        headerName: t("partnership_requests.fields.owner", "Owner"),
        width: 200,
        renderCell: ({ row }) => (
          <Stack justifyContent="center" height="100%">
            <Typography variant="body2" fontWeight="bold" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {row.owner_name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {row.owner_phone}
            </Typography>
          </Stack>
        ),
      },
      {
        field: "status",
        headerName: t("partnership_requests.fields.status", "Status"),
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
        headerName: t("partnership_requests.fields.created_at", "Created"),
        width: 160,
        renderCell: ({ value }) => (
          <CenteredCell>
            <DateField value={value} format="DD.MM.YYYY HH:mm" />
          </CenteredCell>
        ),
      },
      {
        field: "actions",
        headerName: t("table.actions", "Actions"),
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
    <List title={t("partnership_requests.list.title", "Partnership Requests")}>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        density="comfortable"
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
        disableRowSelectionOnClick
      />
    </List>
  );
};
