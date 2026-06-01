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
import {
  Avatar,
  Box,
  Chip,
  Stack,
  useMediaQuery,
  Theme,
  Typography,
  Tooltip,
} from "@mui/material";
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
              py: 1, // Отступы сверху/снизу для многострочных бейджей
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
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        density="comfortable"
        pageSizeOptions={[10, 25, 50, 100]}
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        getRowHeight={() => "auto"} // Позволяет строкам растягиваться по контенту (для ролей)
        columnVisibilityModel={{
          created_at: !isMobile,
          is_email_verified: !isMobile,
          is_documents_verified: !isMobile,
        }}
        sx={{
          border: "none",
          "& .MuiDataGrid-cell": {
            display: "flex", // Включаем флексбокс для ячеек
            alignItems: "center", // Идеальное выравнивание по вертикали
            py: 1, // Базовый отступ сверху/снизу
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
