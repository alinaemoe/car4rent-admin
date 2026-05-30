import React, { useMemo, useState } from "react";
import { List, EditButton, DeleteButton } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Typography,
  Box,
  Stack,
  useMediaQuery,
  Theme,
  TextField,
  InputAdornment,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslate, useList } from "@refinedev/core";
import { CenteredCell } from "../../components/common/centered-cell";
import { CustomNoRowsOverlay } from "../../components/common/custom-no-rows-overlay";
import {
  FormLanguageProvider,
  useFormLanguage,
} from "../../contexts/form-language";
import { LanguageTabs } from "../../components/form/language-tabs";

interface FeatureRow {
  id: number;
  internal_name: string;
  description: Record<string, string>;
  icon_url: string | null;
}

const FeatureListInner = () => {
  const t = useTranslate();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );
  const { activeLang } = useFormLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const { result, isLoading } = useList<FeatureRow>({
    resource: "features",
    pagination: { mode: "off" }, // reference table — always < 100 records
    sorters: [{ field: "internal_name", order: "asc" }],
  }) as any;

  const rows = useMemo(() => {
    const data = result?.data || [];
    if (!searchQuery) return data;
    const lower = searchQuery.toLowerCase();
    return data.filter((row: any) => {
      const desc = row.description?.[activeLang] || row.description?.en || "";
      return (
        row.internal_name?.toLowerCase().includes(lower) ||
        desc.toLowerCase().includes(lower)
      );
    });
  }, [result?.data, searchQuery, activeLang]);

  const columns = useMemo<GridColDef<FeatureRow>[]>(
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
        field: "internal_name",
        headerName: t("features.fields.internal_name", "Internal Name"),
        minWidth: 180,
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
        field: "description",
        headerName: t("features.fields.description", "Description"),
        minWidth: 250,
        flex: 1,
        renderCell: ({ row }) => {
          const val = row.description?.[activeLang] || row.description?.en;
          const isFallback =
            !row.description?.[activeLang] && !!row.description?.en;
          return (
            <Stack justifyContent="center" sx={{ height: "100%", py: 0.5 }}>
              <Typography
                variant="body2"
                color={isFallback ? "text.secondary" : "text.primary"}
                fontStyle={isFallback ? "italic" : "normal"}
                noWrap
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {val || "---"}
              </Typography>
              {isFallback && (
                <Typography variant="caption" color="text.secondary">
                  (fallback en)
                </Typography>
              )}
            </Stack>
          );
        },
      },
      {
        field: "icon_url",
        headerName: t("features.fields.icon", "Icon"),
        minWidth: 80,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderCell: ({ value }) => (
          <CenteredCell>
            {value ? (
              <Avatar
                src={value}
                variant="rounded"
                sx={{ width: 32, height: 32 }}
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
              confirmTitle={t(
                "features.messages.deleteConfirm",
                "Delete this feature?",
              )}
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
    <List title={t("features.titles.list", "Features")}>
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
            "Search internal name or description...",
          )}
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
        <Box>
          <LanguageTabs />
        </Box>
      </Stack>

      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        density="comfortable"
        loading={isLoading}
        hideFooter
        columnVisibilityModel={{
          created_at: !isMobile,
        }}
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

export const FeatureList = () => {
  return (
    <FormLanguageProvider>
      <FeatureListInner />
    </FormLanguageProvider>
  );
};
