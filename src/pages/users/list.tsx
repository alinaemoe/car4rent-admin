import React, { useMemo, useState } from "react";
import {
  useDataGrid,
  List,
  DateField,
  EditButton,
  ShowButton,
} from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CustomNoRowsOverlay } from "../../components/common/custom-no-rows-overlay";
import {
  Avatar,
  Box,
  Chip,
  Stack,
  useMediaQuery,
  Theme,
  Typography,
  Tooltip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTranslate } from "@refinedev/core";

interface UserRow {
  id: number;
  avatar_url?: string;
  first_name: string;
  last_name: string;
  email: string;
  roles: string[];
  status: string;
  is_email_verified: boolean;
  is_documents_verified: boolean;
  created_at: string;
}

const ROLE_OPTIONS = ["CLIENT", "LESSOR", "MANAGER", "ADMIN"];
const STATUS_OPTIONS = ["ACTIVE", "BANNED", "PENDING_VERIFICATION"];

export const UserList = () => {
  const t = useTranslate();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { dataGridProps, setFilters } = useDataGrid({
    syncWithLocation: true,
  });

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );

  const buildFilters = (search: string, role: string, status: string) => {
    const filters: { field: string; operator: string; value: string }[] = [];
    if (search) filters.push({ field: "q", operator: "eq", value: search });
    if (role) filters.push({ field: "role", operator: "eq", value: role });
    if (status) filters.push({ field: "status", operator: "eq", value: status });
    return filters;
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setFilters(buildFilters(value, roleFilter, statusFilter) as any, "replace");
  };

  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
    setFilters(buildFilters(searchQuery, value, statusFilter) as any, "replace");
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setFilters(buildFilters(searchQuery, roleFilter, value) as any, "replace");
  };

  const columns = useMemo<GridColDef<UserRow>[]>(
    () => [
      {
        field: "avatar_url",
        headerName: t("users.fields.avatar", "Avatar"),
        sortable: false,
        filterable: false,
        width: 80,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value, row }) => (
          <Avatar
            src={value}
            alt={row.first_name}
            sx={{
              width: 40,
              height: 40,
              border: "1px solid",
              borderColor: "divider",
            }}
          />
        ),
      },

      {
        field: "email",
        headerName: t("users.fields.email", "Email"),
        flex: 1,
        minWidth: 200,
        renderCell: ({ value }) => (
          <Tooltip title={value || ""} placement="top-start">
            <Typography
              variant="body2"
              noWrap
              sx={{ width: "100%", fontWeight: 500 }}
            >
              {value}
            </Typography>
          </Tooltip>
        ),
      },

      {
        field: "fullName",
        headerName: t("users.fields.fullName", "Full Name"),
        flex: 1,
        minWidth: 180,
        valueGetter: (_value, row) =>
          `${row.first_name || ""} ${row.last_name || ""}`.trim(),
        renderCell: ({ value }) => (
          <Tooltip title={value || ""} placement="top-start">
            <Typography variant="body2" noWrap sx={{ width: "100%" }}>
              {value || "—"}
            </Typography>
          </Tooltip>
        ),
      },

      {
        field: "roles",
        headerName: t("users.fields.roles", "Roles"),
        minWidth: 160,
        flex: 1,
        sortable: false,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              justifyContent: "center",
              alignItems: "center",
              py: 1,
            }}
          >
            {value?.length ? (
              value.map((role: string) => (
                <Chip
                  key={role}
                  label={t(`users.enums.roles.${role}`, role)}
                  size="small"
                  color={
                    role === "ADMIN"
                      ? "error"
                      : role === "MANAGER"
                      ? "warning"
                      : role === "LESSOR"
                      ? "info"
                      : "default"
                  }
                  variant="filled"
                  sx={{ fontWeight: 500, fontSize: "0.7rem" }}
                />
              ))
            ) : (
              <Typography variant="caption" color="text.secondary">
                —
              </Typography>
            )}
          </Box>
        ),
      },

      {
        field: "status",
        headerName: t("users.fields.status", "Status"),
        minWidth: 130,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => {
          let color: "success" | "error" | "warning" | "default" = "default";

          if (value === "ACTIVE") color = "success";
          if (value === "BANNED") color = "error";
          if (value === "PENDING_VERIFICATION") color = "warning";

          return (
            <Chip
              label={t(`users.enums.status.${value}`, value)}
              color={color}
              size="small"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          );
        },
      },

      {
        field: "is_email_verified",
        headerName: t("users.fields.emailVerified", "Email Ver."),
        width: 100,
        type: "boolean",
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <Tooltip
            title={
              value
                ? t("users.tooltips.emailVerified", "Email is verified")
                : t("users.tooltips.emailNotVerified", "Email is not verified")
            }
          >
            {value ? (
              <CheckCircleIcon color="success" fontSize="small" />
            ) : (
              <CancelIcon color="disabled" fontSize="small" />
            )}
          </Tooltip>
        ),
      },

      {
        field: "is_documents_verified",
        headerName: t("users.fields.documentsVerified", "Docs Ver."),
        width: 100,
        type: "boolean",
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <Tooltip
            title={
              value
                ? t("users.tooltips.docsVerified", "Documents are verified")
                : t(
                    "users.tooltips.docsNotVerified",
                    "Documents are not verified",
                  )
            }
          >
            {value ? (
              <CheckCircleIcon color="success" fontSize="small" />
            ) : (
              <CancelIcon color="disabled" fontSize="small" />
            )}
          </Tooltip>
        ),
      },

      {
        field: "created_at",
        headerName: t("users.fields.createdAt", "Created At"),
        minWidth: 160,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <Typography variant="body2" color="text.secondary">
            <DateField value={value} format="LLL" />
          </Typography>
        ),
      },

      {
        field: "actions",
        headerName: t("users.fields.actions", "Actions"),
        sortable: false,
        width: 110,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <Stack
            direction="row"
            spacing={0.5}
            justifyContent="center"
            width="100%"
          >
            <EditButton size="small" hideText recordItemId={row.id} />
            <ShowButton size="small" hideText recordItemId={row.id} />
          </Stack>
        ),
      },
    ],
    [t],
  );

  return (
    <List>
      {/* ПАНЕЛЬ ПОИСКА И ФИЛЬТРОВ */}
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
            "users.search.placeholder",
            "Search by name or email...",
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
          sx={{ minWidth: 260 }}
        />

        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="role-filter-label">
              {t("users.fields.roles", "Role")}
            </InputLabel>
            <Select
              labelId="role-filter-label"
              label={t("users.fields.roles", "Role")}
              value={roleFilter}
              onChange={(e) => handleRoleChange(e.target.value)}
            >
              <MenuItem value="">
                <em>{t("common.all", "All")}</em>
              </MenuItem>
              {ROLE_OPTIONS.map((r) => (
                <MenuItem key={r} value={r}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                      label={t(`users.enums.roles.${r}`, r)}
                      size="small"
                      color={
                        r === "ADMIN"
                          ? "error"
                          : r === "MANAGER"
                          ? "warning"
                          : r === "LESSOR"
                          ? "info"
                          : "default"
                      }
                      variant="filled"
                      sx={{ fontWeight: 600, fontSize: "0.7rem", pointerEvents: "none" }}
                    />
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="status-filter-label">
              {t("users.fields.status", "Status")}
            </InputLabel>
            <Select
              labelId="status-filter-label"
              label={t("users.fields.status", "Status")}
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <MenuItem value="">
                <em>{t("common.all", "All")}</em>
              </MenuItem>
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                      label={t(`users.enums.status.${s}`, s)}
                      size="small"
                      color={
                        s === "ACTIVE"
                          ? "success"
                          : s === "BANNED"
                          ? "error"
                          : "warning"
                      }
                      variant="outlined"
                      sx={{ fontWeight: 600, fontSize: "0.7rem", pointerEvents: "none" }}
                    />
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        density="comfortable"
        pageSizeOptions={[10, 25, 50, 100]}
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        getRowHeight={() => "auto"}
        columnVisibilityModel={{
          created_at: !isMobile,
          is_email_verified: !isMobile,
          is_documents_verified: !isMobile,
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
      />
    </List>
  );
};
