import React, { useMemo } from "react";
import { List, EditButton, DeleteButton } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMediaQuery, Theme, Stack, Typography } from "@mui/material";
import { useTranslate, useList } from "@refinedev/core";
import { CenteredCell } from "../../components/common/centered-cell";

interface LocationRow {
  id: number;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}

export const LocationList = () => {
  const t = useTranslate();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );

  const { result, isLoading } = useList<LocationRow>({
    resource: "locations",
    pagination: { mode: "off" },
    sorters: [{ field: "name", order: "asc" }],
  }) as any;

  const rows = result?.data || [];

  const columns = useMemo<GridColDef<LocationRow>[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        minWidth: 60,
        flex: 0.3,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => <CenteredCell>#{value}</CenteredCell>,
      },
      {
        field: "name",
        headerName: t("locations.fields.name", "Name"),
        minWidth: 200,
        flex: 1,
        renderCell: ({ value }) => (
          <Stack justifyContent="center" sx={{ height: "100%", py: 0.5 }}>
            <Typography variant="body2" fontWeight={600}>
              {value || "---"}
            </Typography>
          </Stack>
        ),
      },
      {
        field: "address",
        headerName: t("locations.fields.address", "Address"),
        minWidth: 250,
        flex: 1,
        renderCell: ({ value }) => (
          <Stack justifyContent="center" sx={{ height: "100%", py: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {value || "---"}
            </Typography>
          </Stack>
        ),
      },
      {
        field: "latitude",
        headerName: t("locations.fields.latitude", "Latitude"),
        minWidth: 120,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <CenteredCell>
            <Typography variant="body2" fontFamily="monospace">
              {value !== null && value !== undefined ? value : "—"}
            </Typography>
          </CenteredCell>
        ),
      },
      {
        field: "longitude",
        headerName: t("locations.fields.longitude", "Longitude"),
        minWidth: 120,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <CenteredCell>
            <Typography variant="body2" fontFamily="monospace">
              {value !== null && value !== undefined ? value : "—"}
            </Typography>
          </CenteredCell>
        ),
      },
      {
        field: "actions",
        headerName: t("table.actions", "Actions"),
        sortable: false,
        minWidth: 140,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <CenteredCell spacing={0.5}>
            <EditButton size="small" hideText recordItemId={row.id} />
            <DeleteButton
              size="small"
              hideText
              recordItemId={row.id}
              confirmTitle={t("locations.messages.deleteConfirm", "Delete this location?")}
              confirmOkText={t("buttons.delete", "Delete")}
              confirmCancelText={t("buttons.cancel", "Cancel")}
            />
          </CenteredCell>
        ),
      },
    ],
    [t],
  );

  return (
    <List title={t("locations.titles.list", "Locations")}>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        density="comfortable"
        loading={isLoading}
        hideFooter
        columnVisibilityModel={{
          latitude: !isMobile,
          longitude: !isMobile,
        }}
        sx={{
          border: "none",
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid",
            borderColor: "divider",
            py: 0.5,
          },
        }}
        disableRowSelectionOnClick
      />
    </List>
  );
};
