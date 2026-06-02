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
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

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
    return [
      {
        field: "car",
        headerName: t("partnership_requests.fields.car", "Car"),
        flex: 1.5,
        minWidth: 250,
        renderCell: ({ row }) => {
          const image = row.photos?.[0];
          return (
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              height="100%"
              width="100%"
            >
              <Avatar
                src={image}
                variant="rounded"
                sx={{
                  width: 56,
                  height: 40,
                  bgcolor: "action.hover",
                  color: "text.secondary",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {!image && <DirectionsCarIcon />}
              </Avatar>
              <Box sx={{ minWidth: 0, overflow: "hidden" }}>
                <Typography
                  variant="body2"
                  fontWeight="600"
                  noWrap
                  sx={{ width: "100%" }}
                >
                  {row.car_brand} {row.car_model}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ width: "100%", display: "block" }}
                >
                  {t("partnership_requests.fields.year", "Year")}:{" "}
                  {row.car_year}
                </Typography>
              </Box>
            </Stack>
          );
        },
      },
      {
        field: "owner",
        headerName: t("partnership_requests.fields.owner", "Owner"),
        flex: 1,
        minWidth: 200,
        renderCell: ({ row }) => (
          <Stack
            justifyContent="center"
            height="100%"
            width="100%"
            sx={{ minWidth: 0 }}
          >
            <Typography
              variant="body2"
              fontWeight="500"
              noWrap
              sx={{ width: "100%" }}
            >
              {row.owner_name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ width: "100%", display: "block" }}
            >
              {row.owner_phone}
            </Typography>
          </Stack>
        ),
      },
      {
        field: "status",
        headerName: t("partnership_requests.fields.status", "Status"),
        width: 150,
        align: "center",
        headerAlign: "center",
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
            <Chip
              label={translatedStatus}
              color={color}
              size="small"
              variant={value === "NEW" ? "filled" : "outlined"}
              sx={{ fontWeight: "bold" }}
            />
          );
        },
      },
      {
        field: "created_at",
        headerName: t("partnership_requests.fields.created_at", "Created"),
        width: 160,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <Typography variant="body2" color="text.secondary">
            <DateField value={value} format="DD.MM.YYYY HH:mm" />
          </Typography>
        ),
      },
      {
        field: "actions",
        headerName: t("table.actions", "Actions"),
        sortable: false,
        width: 100,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <ShowButton size="small" hideText recordItemId={row.id} />
        ),
      },
    ];
  }, [t]);

  return (
    <List title={t("partnership_requests.list.title", "Partnership Requests")}>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        density="comfortable"
        pageSizeOptions={[10, 25, 50, 100]}
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        getRowHeight={() => "auto"}
        columnVisibilityModel={{
          owner: !isMobile,
          created_at: !isMobile,
        }}
        sx={{
          border: "none",
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            py: 1,
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "action.hover",
          },
        }}
        disableRowSelectionOnClick
      />
    </List>
  );
};
