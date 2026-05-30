import React, { useMemo, useState } from "react";
import { List, EditButton, DeleteButton, DateField } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Typography,
  Box,
  Stack,
  Chip,
  useMediaQuery,
  Theme,
  TextField,
  InputAdornment,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTranslate, useList } from "@refinedev/core";
import { CenteredCell } from "../../components/common/centered-cell";
import { CustomNoRowsOverlay } from "../../components/common/custom-no-rows-overlay";
import {
  FormLanguageProvider,
  useFormLanguage,
} from "../../contexts/form-language";
import { LanguageTabs } from "../../components/form/language-tabs";

interface NewsRow {
  id: number;
  title: Record<string, string>;
  text: Record<string, string>;
  badge: Record<string, string>;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

const NewsListInner = () => {
  const t = useTranslate();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );
  const { activeLang } = useFormLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const { result, isLoading } = useList<NewsRow>({
    resource: "news",
    pagination: { mode: "off" },
    sorters: [{ field: "created_at", order: "desc" }],
  }) as any;

  const rows = useMemo(() => {
    const data = result?.data || [];
    if (!searchQuery) return data;

    const lowerQuery = searchQuery.toLowerCase();
    return data.filter((row: any) => {
      const title = row.title?.[activeLang] || row.title?.en || "";
      const badge = row.badge?.[activeLang] || row.badge?.en || "";
      return (
        title.toLowerCase().includes(lowerQuery) ||
        badge.toLowerCase().includes(lowerQuery)
      );
    });
  }, [result?.data, searchQuery, activeLang]);

  const columns = useMemo<GridColDef<NewsRow>[]>(
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
        field: "image_url",
        headerName: t("news.fields.image", "Image"),
        minWidth: 70,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderCell: ({ value }) => (
          <CenteredCell>
            <Avatar
              src={value || undefined}
              variant="rounded"
              sx={{ width: 40, height: 40 }}
            >
              N
            </Avatar>
          </CenteredCell>
        ),
      },
      {
        field: "title",
        headerName: t("news.fields.title", "Title"),
        minWidth: 250,
        flex: 1,
        renderCell: ({ row }) => {
          const val = row.title?.[activeLang] || row.title?.en;
          const isFallback = !row.title?.[activeLang] && !!row.title?.en;
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
        field: "badge",
        headerName: t("news.fields.badge", "Badge"),
        minWidth: 140,
        renderCell: ({ row }) => {
          const val = row.badge?.[activeLang] || row.badge?.en;
          const isFallback = !row.badge?.[activeLang] && !!row.badge?.en;
          return (
            <Stack justifyContent="center" sx={{ height: "100%", py: 0.5 }}>
              <Chip
                label={val || "---"}
                size="small"
                color={isFallback ? "default" : "primary"}
                variant={isFallback ? "outlined" : "filled"}
              />
            </Stack>
          );
        },
      },
      {
        field: "is_active",
        headerName: t("news.fields.is_active", "Active"),
        minWidth: 90,
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
        headerName: t("news.fields.created_at", "Created At"),
        minWidth: 170,
        renderCell: ({ value }) => (
          <CenteredCell>
            <DateField value={value} format="LLL" />
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
              confirmTitle={t("news.messages.deleteConfirm", "Delete this news?")}
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
    <List title={t("news.titles.list", "News")}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <TextField
          size="small"
          placeholder={t("search.placeholder", "Search title or badge...")}
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

export const NewsList = () => {
  return (
    <FormLanguageProvider>
      <NewsListInner />
    </FormLanguageProvider>
  );
};
