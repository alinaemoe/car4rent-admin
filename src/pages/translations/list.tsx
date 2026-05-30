import React, { useMemo, useState } from "react";
import { List, EditButton, DeleteButton } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Typography,
  Box,
  useMediaQuery,
  Theme,
  TextField,
  InputAdornment,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslate, useList } from "@refinedev/core";

// Наши компоненты
import { CenteredCell } from "../../components/common/centered-cell";
import { CustomNoRowsOverlay } from "../../components/common/custom-no-rows-overlay";
import {
  FormLanguageProvider,
  useFormLanguage,
} from "../../contexts/form-language";
import { LanguageTabs } from "../../components/form/language-tabs";

// Внутренний компонент списка (чтобы использовать хук useFormLanguage)
const TranslationListInner = () => {
  const t = useTranslate();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );
  const { activeLang } = useFormLanguage(); // 👈 Достаем выбранный язык из табов

  const [searchQuery, setSearchQuery] = useState("");

  // Получаем список переводов.
  // Используем фильтр по полю key (contains), если введен поиск
  const { result, isLoading } = useList({
    resource: "translations",
    filters: searchQuery
      ? [
          {
            field: "key",
            operator: "contains",
            value: searchQuery,
          },
        ]
      : [],
    pagination: { mode: "off" }, // Для переводов обычно отключают пагинацию
    sorters: [{ field: "id", order: "desc" }],
  }) as any;

  // Опционально: можно фильтровать еще и на клиенте по value,
  // чтобы поиск искал и по самим переводам
  const rows = useMemo(() => {
    const data = result?.data || [];
    if (!searchQuery) return data;

    const lowerQuery = searchQuery.toLowerCase();
    return data.filter((row: any) => {
      // Ищем по ключу
      if (row.key?.toLowerCase().includes(lowerQuery)) return true;
      // Ищем по значению текущего языка
      const val = row.value?.[activeLang] || row.value?.["en"] || "";
      if (val.toLowerCase().includes(lowerQuery)) return true;
      return false;
    });
  }, [result?.data, searchQuery, activeLang]);

  const columns = useMemo<GridColDef[]>(() => {
    const baseColumns: GridColDef[] = [
      {
        field: "id",
        headerName: t("table.id", "ID"),
        width: 70,
        renderCell: ({ value }) => <CenteredCell>#{value}</CenteredCell>,
      },
      {
        field: "key",
        headerName: t("translations.fields.key", "Translation Key"),
        width: 250,
        renderCell: ({ value }) => (
          <Box display="flex" alignItems="center" height="100%">
            <Typography variant="body2" fontWeight="bold" color="primary" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {value}
            </Typography>
          </Box>
        ),
      },
      {
        field: "value",
        headerName: t("translations.fields.value", "Value"),
        flex: 1,
        minWidth: 300,
        renderCell: ({ row }) => {
          // 👇 Логика отображения перевода: берем активный, либо фоллбэк на "en"
          const val = row.value?.[activeLang] || row.value?.["en"];
          const isFallback = !row.value?.[activeLang] && row.value?.["en"];

          return (
            <Box display="flex" alignItems="center" height="100%">
              <Typography
                variant="body2"
                color={isFallback ? "text.secondary" : "text.primary"}
                fontStyle={isFallback ? "italic" : "normal"}
                noWrap
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {val || "—"} {isFallback && "(fallback en)"}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "actions",
        headerName: t("table.actions", "Actions"),
        sortable: false,
        width: 120,
        renderCell: ({ row }) => (
          <CenteredCell spacing={1}>
            <EditButton size="small" hideText recordItemId={row.id} />
            <DeleteButton size="small" hideText recordItemId={row.id} />
          </CenteredCell>
        ),
      },
    ];

    if (isMobile) {
      return baseColumns.filter((c) => c.field !== "id");
    }

    return baseColumns;
  }, [t, isMobile, activeLang]);

  return (
    <List>
      {/* ПАНЕЛЬ УПРАВЛЕНИЯ: ПОИСК И ТАБЫ */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <TextField
          size="small"
          placeholder={t("search.placeholder", "Search key or value...")}
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

        {/* Табы переключения языков */}
        <Box>
          <LanguageTabs />
        </Box>
      </Stack>

      {/* ТАБЛИЦА */}
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          hideFooter={true}
          loading={isLoading}
          rowHeight={60}
          slots={{ noRowsOverlay: CustomNoRowsOverlay }}
          sx={{
            border: "none",
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid",
              borderColor: "divider",
              whiteSpace: "normal",
              lineHeight: "1.3em",
              py: 1,
            },
          }}
          disableRowSelectionOnClick
        />
      </Box>
    </List>
  );
};

// Главная обертка с провайдером языка
export const TranslationList = () => {
  return (
    <FormLanguageProvider>
      <TranslationListInner />
    </FormLanguageProvider>
  );
};
