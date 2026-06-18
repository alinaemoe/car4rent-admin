import React, { useMemo, useState } from "react";
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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslate } from "@refinedev/core";

import { CenteredCell } from "../../components/common/centered-cell";
import { CustomNoRowsOverlay } from "../../components/common/custom-no-rows-overlay";

const STATUS_OPTIONS = ["AVAILABLE", "RENTED", "MAINTENANCE"];

export const CarList = () => {
  const t = useTranslate();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { dataGridProps, setFilters } = useDataGrid({
    syncWithLocation: true,
  });

  const buildFilters = (search: string, status: string) => {
    const filters: { field: string; operator: string; value: string }[] = [];
    if (search) filters.push({ field: "q", operator: "eq", value: search });
    if (status) filters.push({ field: "status", operator: "eq", value: status });
    return filters;
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setFilters(buildFilters(value, statusFilter) as any, "replace");
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setFilters(buildFilters(searchQuery, value) as any, "replace");
  };

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: t("table.id", "ID"),
        minWidth: 60,
        flex: 0.3,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => <CenteredCell>#{value}</CenteredCell>,
      },
      {
        field: "brand",
        headerName: t("cars.fields.car", "Car"),
        minWidth: 280,
        flex: 1,
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
                sx={{ width: 60, height: 40, flexShrink: 0 }}
              >
                🚗
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {row.brand} {row.model}
                </Typography>
                <Typography variant="caption" color="text.secondary">
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
        minWidth: 110,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <CenteredCell>
            <Typography fontWeight="bold">${value}</Typography>
          </CenteredCell>
        ),
      },
      {
        field: "owner",
        headerName: t("cars.fields.owner.label", "Owner"),
        minWidth: 180,
        flex: 0.5,
        renderCell: ({ row }) => {
          const owner = row.owner;
          if (!owner) {
            return (
              <CenteredCell>
                <Typography variant="caption" color="text.disabled">
                  —
                </Typography>
              </CenteredCell>
            );
          }
          const name =
            `${owner.first_name || ""} ${owner.last_name || ""}`.trim() ||
            owner.email;
          return (
            <Stack justifyContent="center" height="100%">
              <Typography variant="body2">{name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {owner.email}
              </Typography>
            </Stack>
          );
        },
      },
      {
        field: "status",
        headerName: t("cars.fields.status", "Status"),
        minWidth: 130,
        align: "center",
        headerAlign: "center",
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
        minWidth: 140,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <CenteredCell spacing={0.5}>
            <EditButton size="small" hideText recordItemId={row.id} />
            <ShowButton size="small" hideText recordItemId={row.id} />
            {row.status === "AVAILABLE" && (
              <DeleteButton size="small" hideText recordItemId={row.id} />
            )}
          </CenteredCell>
        ),
      },
    ],
    [t],
  );

  return (
    <List>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <TextField
          size="small"
          placeholder={t(
            "search.placeholder",
            "Search brand, model or plate...",
          )}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="status-filter-label">
            {t("cars.fields.status", "Status")}
          </InputLabel>
          <Select
            labelId="status-filter-label"
            label={t("cars.fields.status", "Status")}
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <MenuItem value="">
              <em>{t("common.all", "All")}</em>
            </MenuItem>
            {STATUS_OPTIONS.filter(Boolean).map((s) => (
              <MenuItem key={s} value={s}>
                {t(`cars.enums.status.${s}`, s)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        density="comfortable"
        rowHeight={70}
        pageSizeOptions={[10, 25, 50, 100]}
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        columnVisibilityModel={{
          id: !isMobile,
          price_per_day: !isMobile,
          owner: !isMobile,
        }}
        sx={{
          border: "none",
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid",
            borderColor: "divider",
            whiteSpace: "normal", // Включаем перенос текста
            lineHeight: "1.3em",
            alignItems: "center",
            display: "flex",
          },
        }}
        disableRowSelectionOnClick
      />
    </List>
  );
};
