import React, { useMemo } from "react";
import {
  useDataGrid,
  List,
  DateField,
  EditButton,
  ShowButton,
} from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CustomNoRowsOverlay } from "../../components/common/custom-no-rows-overlay";
import { Avatar, Chip, Stack, useMediaQuery, Theme } from "@mui/material";
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
  is_email_verified: boolean; // 👈
  is_documents_verified: boolean; // 👈
  created_at: string;
}

/**
 * Универсальный контейнер
 * Гарантированно центрирует контент в ячейке по X и Y
 */
const CenteredCell: React.FC<{
  children: React.ReactNode;
  spacing?: number;
}> = ({ children, spacing = 0 }) => (
  <Stack
    direction="row"
    spacing={spacing}
    justifyContent="center"
    alignItems="center"
    width="100%"
    height="100%"
  >
    {children}
  </Stack>
);

export const UserList = () => {
  const t = useTranslate();
  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
  });

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );

  const columns = useMemo<GridColDef<UserRow>[]>(
    () => [
      {
        field: "id",
        headerName: t("users.fields.id"),
        type: "number",
        minWidth: 60,
        flex: 0.4,
        align: "center",
        headerAlign: "center",
      },

      {
        field: "avatar_url",
        headerName: t("users.fields.avatar"),
        sortable: false,
        filterable: false,
        minWidth: 80,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value, row }) => (
          <CenteredCell>
            <Avatar
              src={value}
              alt={row.first_name}
              sx={{ width: 32, height: 32 }}
            />
          </CenteredCell>
        ),
      },

      {
        field: "email",
        headerName: t("users.fields.email"),
        flex: 1,
        minWidth: 220,
      },

      {
        field: "fullName",
        headerName: t("users.fields.fullName"),
        flex: 1,
        minWidth: 180,
        valueGetter: (_value, row) =>
          `${row.first_name || ""} ${row.last_name || ""}`,
      },

      {
        field: "roles",
        headerName: t("users.fields.roles"),
        minWidth: 160,
        flex: 1,
        sortable: false,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <CenteredCell spacing={0.5}>
            {value?.map((role: string) => (
              <Chip
                key={role}
                label={t(`users.enums.roles.${role}`)}
                size="small"
                color={
                  role === "ADMIN"
                    ? "error"
                    : role === "MANAGER"
                    ? "warning"
                    : "primary"
                }
                variant="outlined"
              />
            ))}
          </CenteredCell>
        ),
      },

      {
        field: "status",
        headerName: t("users.fields.status"),
        minWidth: 140,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => {
          let color: "success" | "error" | "warning" | "default" = "default";

          if (value === "ACTIVE") color = "success";
          if (value === "BANNED") color = "error";
          if (value === "PENDING_VERIFICATION") color = "warning";

          return (
            <CenteredCell>
              <Chip
                label={t(`users.enums.status.${value}`)}
                color={color}
                size="small"
              />
            </CenteredCell>
          );
        },
      },

      {
        field: "is_email_verified",
        headerName: t("users.fields.emailVerified", "Email Ver."),
        minWidth: 100,
        type: "boolean",
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <CenteredCell>
            {value ? (
              <CheckCircleIcon color="success" fontSize="small" />
            ) : (
              <CancelIcon color="disabled" fontSize="small" />
            )}
          </CenteredCell>
        ),
      },

      {
        field: "is_documents_verified",
        headerName: t("users.fields.documentsVerified", "Docs Ver."),
        minWidth: 100,
        type: "boolean",
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <CenteredCell>
            {value ? (
              <CheckCircleIcon color="success" fontSize="small" />
            ) : (
              <CancelIcon color="disabled" fontSize="small" />
            )}
          </CenteredCell>
        ),
      },

      {
        field: "created_at",
        headerName: t("users.fields.createdAt"),
        minWidth: 180,
        renderCell: ({ value }) => (
          <CenteredCell>
            <DateField value={value} format="LLL" />
          </CenteredCell>
        ),
      },

      {
        field: "actions",
        headerName: t("users.fields.actions"),
        sortable: false,
        minWidth: 120,
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
    [t],
  );

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
          created_at: !isMobile,
          roles: !isMobile,
        }}
      />
    </List>
  );
};
