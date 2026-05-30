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
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DataObjectIcon from "@mui/icons-material/DataObject";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import { useTranslate, useList } from "@refinedev/core";
import { CenteredCell } from "../../components/common/centered-cell";
import { CustomNoRowsOverlay } from "../../components/common/custom-no-rows-overlay";
import { useFormLanguage } from "../../contexts/form-language";
import { FormLanguageProvider } from "../../contexts/form-language";
import { LanguageTabs } from "../../components/form/language-tabs";

interface SettingRow {
  id: string;
  key: string;
  value: string;
  description: string | null;
}

function detectValueType(value: string): { type: "string" | "object" | "array"; preview: string } {
  if (!value) return { type: "string", preview: "" };
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      const preview = JSON.stringify(parsed.slice(0, 3));
      return { type: "array", preview: preview.length > 80 ? preview.slice(0, 80) + "..." : preview };
    }
    if (typeof parsed === "object" && parsed !== null) {
      const preview = JSON.stringify(parsed);
      return { type: "object", preview: preview.length > 80 ? preview.slice(0, 80) + "..." : preview };
    }
    return { type: "string", preview: value };
  } catch {
    return { type: "string", preview: value.length > 100 ? value.slice(0, 100) + "..." : value };
  }
}

const SettingListInner = () => {
  const t = useTranslate();
  const { activeLang } = useFormLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const { result, isLoading } = useList<SettingRow>({
    resource: "settings",
    pagination: { mode: "off" },
    sorters: [{ field: "key", order: "asc" }],
  }) as any;

  const rows = useMemo(() => {
    const data = result?.data || [];
    if (!searchQuery) return data;
    const lower = searchQuery.toLowerCase();
    return data.filter((row: any) => {
      const desc = row.description || "";
      return (
        row.key?.toLowerCase().includes(lower) ||
        row.value?.toLowerCase().includes(lower) ||
        desc.toLowerCase().includes(lower)
      );
    });
  }, [result?.data, searchQuery]);

  const columns = useMemo<GridColDef<SettingRow>[]>(
    () => [
      {
        field: "key",
        headerName: t("settings.fields.key", "Key"),
        minWidth: 200,
        renderCell: ({ value }) => (
          <Stack justifyContent="center" sx={{ height: "100%" }}>
            <Typography
              variant="body2"
              fontFamily="monospace"
              fontWeight={600}
              color="primary"
            >
              {value || "---"}
            </Typography>
          </Stack>
        ),
      },
      {
        field: "value",
        headerName: t("settings.fields.value", "Value"),
        minWidth: 350,
        flex: 1,
        renderCell: ({ value }) => {
          if (!value) {
            return (
              <Stack justifyContent="center" sx={{ height: "100%" }}>
                <Typography variant="body2" color="text.disabled">
                  —
                </Typography>
              </Stack>
            );
          }
          const { type, preview } = detectValueType(value);
          return (
            <Stack
              justifyContent="center"
              sx={{ height: "100%", py: 0.5, width: "100%" }}
              spacing={0.5}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                {type === "array" || type === "object" ? (
                  <DataObjectIcon
                    sx={{ fontSize: 14, color: "warning.main", flexShrink: 0 }}
                  />
                ) : (
                  <TextFieldsIcon
                    sx={{ fontSize: 14, color: "info.main", flexShrink: 0 }}
                  />
                )}
                <Chip
                  label={type}
                  size="small"
                  color={type === "object" ? "warning" : type === "array" ? "success" : "info"}
                  variant="outlined"
                  sx={{ height: 20, fontSize: 11, flexShrink: 0 }}
                />
              </Stack>
              <Tooltip title={value} placement="bottom-start">
                <Typography
                  variant="caption"
                  fontFamily="monospace"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "100%",
                    display: "block",
                  }}
                >
                  {preview}
                </Typography>
              </Tooltip>
            </Stack>
          );
        },
      },
      {
        field: "description",
        headerName: t("settings.fields.description", "Description"),
        minWidth: 220,
        flex: 0.7,
        renderCell: ({ value }) => (
          <Stack justifyContent="center" sx={{ height: "100%" }}>
            <Typography variant="body2" color="text.secondary" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {value || "—"}
            </Typography>
          </Stack>
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
              confirmTitle={t("settings.messages.deleteConfirm", "Delete this setting?")}
              confirmOkText={t("buttons.delete", "Delete")}
              confirmCancelText={t("buttons.cancel", "Cancel")}
            />
          </CenteredCell>
        ),
      },
    ],
    [t, activeLang],
  );

  return (
    <List title={t("settings.titles.list", "Settings")}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <TextField
          size="small"
          placeholder={t("search.placeholder", "Search key, value or description...")}
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
        getRowId={(row) => row.key}
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
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

export const SettingList = () => {
  return (
    <FormLanguageProvider>
      <SettingListInner />
    </FormLanguageProvider>
  );
};
