import React, { useMemo, useState } from "react";
import { List, EditButton, DeleteButton, DateField } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Typography,
  Box,
  Stack,
  useMediaQuery,
  Theme,
  TextField,
  InputAdornment,
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

interface FaqRow {
  id: number;
  question: Record<string, string>;
  answer: Record<string, string>;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const FaqListInner = () => {
  const t = useTranslate();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );
  const { activeLang } = useFormLanguage();

  const [searchQuery, setSearchQuery] = useState("");

  const { result, isLoading } = useList<FaqRow>({
    resource: "faq",
    pagination: { mode: "off" }, // reference table — always < 100 records
    sorters: [
      { field: "order_index", order: "asc" },
      { field: "created_at", order: "desc" },
    ],
  }) as any;

  const rows = useMemo(() => {
    const data = result?.data || [];
    if (!searchQuery) return data;

    const lowerQuery = searchQuery.toLowerCase();
    return data.filter((row: any) => {
      const q = row.question?.[activeLang] || row.question?.en || "";
      const a = row.answer?.[activeLang] || row.answer?.en || "";
      return (
        q.toLowerCase().includes(lowerQuery) ||
        a.toLowerCase().includes(lowerQuery)
      );
    });
  }, [result?.data, searchQuery, activeLang]);

  const columns = useMemo<GridColDef<FaqRow>[]>(
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
        field: "question",
        headerName: t("faq.fields.question", "Question"),
        minWidth: 250,
        flex: 1,
        renderCell: ({ row }) => {
          const val = row.question?.[activeLang] || row.question?.en;
          const isFallback = !row.question?.[activeLang] && !!row.question?.en;
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
        field: "answer",
        headerName: t("faq.fields.answer", "Answer"),
        minWidth: 300,
        flex: 1,
        renderCell: ({ row }) => {
          const val = row.answer?.[activeLang] || row.answer?.en;
          const isFallback = !row.answer?.[activeLang] && !!row.answer?.en;
          return (
            <Stack justifyContent="center" sx={{ height: "100%", py: 0.5 }}>
              <Typography
                variant="body2"
                color={isFallback ? "text.secondary" : "text.primary"}
                fontStyle={isFallback ? "italic" : "normal"}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
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
        field: "order_index",
        headerName: t("faq.fields.order_index", "Order"),
        minWidth: 80,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => <CenteredCell>{value}</CenteredCell>,
      },
      {
        field: "is_active",
        headerName: t("faq.fields.is_active", "Active"),
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
        headerName: t("faq.fields.created_at", "Created At"),
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
              confirmTitle={t("faq.messages.deleteConfirm", "Delete this FAQ?")}
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
    <List title={t("faq.titles.list", "FAQ")}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <TextField
          size="small"
          placeholder={t("search.placeholder", "Search question or answer...")}
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

export const FaqList = () => {
  return (
    <FormLanguageProvider>
      <FaqListInner />
    </FormLanguageProvider>
  );
};
