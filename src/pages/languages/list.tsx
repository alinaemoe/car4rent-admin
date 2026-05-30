import React, { useMemo, useState } from "react";
import { List, EditButton, DeleteButton } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Typography,
  Box,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Avatar,
  useMediaQuery,
  Theme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTranslate, useList } from "@refinedev/core";
import { CenteredCell } from "../../components/common/centered-cell";

interface LanguageRow {
  code: string;
  name: string;
  icon_url: string | null;
  is_active: boolean;
}

const LanguageListInner = () => {
  const t = useTranslate();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { result, isLoading } = useList<LanguageRow>({
    resource: "languages",
    pagination: { mode: "off" },
    sorters: [{ field: "code", order: "asc" }],
  }) as any;

  const rows = useMemo(() => {
    const data = result?.data || [];
    if (!searchQuery) return data;
    const lower = searchQuery.toLowerCase();
    return data.filter((row: any) => {
      const name = row.name || "";
      const code = row.code || "";
      return (
        name.toLowerCase().includes(lower) ||
        code.toLowerCase().includes(lower)
      );
    });
  }, [result?.data, searchQuery]);

  const columns = useMemo<GridColDef<LanguageRow>[]>(
    () => [
      {
        field: "code",
        headerName: t("languages.fields.code", "Code"),
        minWidth: 100,
        renderCell: ({ value }) => (
          <Stack justifyContent="center" sx={{ height: "100%" }}>
            <Typography
              variant="body2"
              fontFamily="monospace"
              fontWeight={600}
              color="primary"
            >
              {value?.toUpperCase() || "---"}
            </Typography>
          </Stack>
        ),
      },
      {
        field: "name",
        headerName: t("languages.fields.name", "Name"),
        minWidth: 180,
        flex: 1,
        renderCell: ({ value }) => (
          <Stack justifyContent="center" sx={{ height: "100%" }}>
            <Typography variant="body2">
              {value || "---"}
            </Typography>
          </Stack>
        ),
      },
      {
        field: "icon_url",
        headerName: t("languages.fields.icon_url", "Flag Icon"),
        minWidth: 100,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderCell: ({ value }) => (
          <CenteredCell>
            {value ? (
              <Avatar
                src={value}
                variant="rounded"
                sx={{ width: 32, height: 24, borderRadius: 0.5 }}
              />
            ) : (
              <Typography variant="caption" color="text.disabled">
                —
              </Typography>
            )}
          </CenteredCell>
        ),
      },
      {
        field: "is_active",
        headerName: t("languages.fields.is_active", "Active"),
        minWidth: 100,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <CenteredCell>
            {value ? (
              <Chip
                icon={<CheckCircleIcon />}
                label={t("status.active", "Active")}
                size="small"
                color="success"
                variant="outlined"
              />
            ) : (
              <Chip
                icon={<CancelIcon />}
                label={t("status.inactive", "Inactive")}
                size="small"
                color="default"
                variant="outlined"
              />
            )}
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
            <EditButton size="small" hideText recordItemId={row.code} />
            <DeleteButton
              size="small"
              hideText
              recordItemId={row.code}
              confirmTitle={t("languages.messages.deleteConfirm", "Delete this language?")}
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
    <List title={t("languages.titles.list", "Languages")}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <TextField
          size="small"
          placeholder={t("search.placeholder", "Search name or code...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
      </Stack>

      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        density="comfortable"
        loading={isLoading}
        hideFooter
        getRowId={(row) => row.code}
        columnVisibilityModel={{
          created_at: !isMobile,
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

export const LanguageList = () => {
  return <LanguageListInner />;
};
