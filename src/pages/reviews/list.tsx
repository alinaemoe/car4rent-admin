import React, { useMemo } from "react";
import {
  useDataGrid,
  List,
  DateField,
  EditButton,
  ShowButton,
  DeleteButton,
} from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CustomNoRowsOverlay } from "../../components/common/custom-no-rows-overlay";
import {
  Avatar,
  Chip,
  Stack,
  Rating,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  Theme,
} from "@mui/material";
import { useTranslate, CrudFilters } from "@refinedev/core";

interface ReviewRow {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user?: {
    id: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  car?: {
    id: number;
    brand: string;
    model: string;
    license_plate?: string;
  } | null;
}

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
    sx={{ overflow: "hidden" }}
  >
    {children}
  </Stack>
);

export const ReviewList = () => {
  const t = useTranslate();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );

  const { dataGridProps, filters, setFilters } = useDataGrid({
    syncWithLocation: true,
  });

  const currentFilters: CrudFilters = (filters as CrudFilters) || [];
  const filterRating = currentFilters.find((f: any) => f.field === "rating")
    ?.value as string | undefined;

  const handleRatingChange = (value: string) => {
    const other = currentFilters.filter((f: any) => f.field !== "rating");
    if (value) {
      setFilters([...other, { field: "rating", operator: "eq", value }]);
    } else {
      setFilters(other);
    }
  };

  const columns = useMemo<GridColDef<ReviewRow>[]>(
    () => [
      {
        field: "id",
        headerName: t("reviews.fields.id", "ID"),
        type: "number",
        minWidth: 70,
        flex: 0.4,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "user",
        headerName: t("reviews.fields.user", "User"),
        minWidth: 220,
        flex: 1,
        sortable: false,
        renderCell: ({ value }) => (
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ height: "100%", width: "100%", overflow: "hidden" }}
          >
            <Avatar
              src={value?.avatar_url || undefined}
              alt={value?.first_name || ""}
              sx={{ width: 32, height: 32, flexShrink: 0 }}
            >
              {value?.first_name?.[0]?.toUpperCase() || "?"}
            </Avatar>
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                noWrap
                sx={{ display: "block", lineHeight: 1.2 }}
              >
                {value?.first_name || ""} {value?.last_name || ""}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ display: "block", lineHeight: 1.2, mt: "2px" }}
              >
                {value?.id ? `#${value.id.slice(0, 8)}` : ""}
              </Typography>
            </Box>
          </Stack>
        ),
      },
      {
        field: "car",
        headerName: t("reviews.fields.car", "Car"),
        minWidth: 200,
        flex: 1,
        sortable: false,
        renderCell: ({ value }) => (
          <Stack
            justifyContent="center"
            sx={{ height: "100%", width: "100%", overflow: "hidden" }}
          >
            {value ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  noWrap
                  sx={{ display: "block", lineHeight: 1.2 }}
                >
                  {value.brand} {value.model}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ display: "block", lineHeight: 1.2, mt: "2px" }}
                >
                  {value.license_plate || `#${value.id}`}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Chip
                  label={t("reviews.companyReview", "Company Review")}
                  size="small"
                  variant="outlined"
                  color="info"
                />
              </Box>
            )}
          </Stack>
        ),
      },
      {
        field: "rating",
        headerName: t("reviews.fields.rating", "Rating"),
        minWidth: 140,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <CenteredCell>
            <Rating value={value ?? 0} readOnly precision={0.5} size="small" />
          </CenteredCell>
        ),
      },
      {
        field: "comment",
        headerName: t("reviews.fields.comment", "Comment"),
        minWidth: 300,
        flex: 2,
        renderCell: ({ value }) => (
          <Stack justifyContent="center" sx={{ height: "100%", width: "100%" }}>
            <Typography
              variant="body2"
              sx={{
                // Принудительно разрешаем перенос строк (сбрасываем дефолт DataGrid)
                whiteSpace: "normal",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                lineHeight: 1.3,
                maxHeight: "2.6em",
                wordBreak: "break-word",
              }}
            >
              {value || "-"}
            </Typography>
          </Stack>
        ),
      },
      {
        field: "created_at",
        headerName: t("reviews.fields.createdAt", "Created At"),
        minWidth: 150,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <CenteredCell>
            <DateField value={value} format="LLL" />
          </CenteredCell>
        ),
      },
      {
        field: "actions",
        headerName: t("reviews.fields.actions", "Actions"),
        sortable: false,
        minWidth: 140,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <CenteredCell spacing={0.5}>
            <ShowButton size="small" hideText recordItemId={row.id} />
            <EditButton size="small" hideText recordItemId={row.id} />
            <DeleteButton size="small" hideText recordItemId={row.id} />
          </CenteredCell>
        ),
      },
    ],
    [t],
  );

  return (
    <List>
      <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>{t("reviews.fields.rating", "Rating")}</InputLabel>
          <Select
            value={filterRating ?? ""}
            label={t("reviews.fields.rating", "Rating")}
            onChange={(e) => handleRatingChange(e.target.value)}
          >
            <MenuItem value="">{t("reviews.filters.all", "All")}</MenuItem>
            {[1, 2, 3, 4, 5].map((r) => (
              <MenuItem key={r} value={String(r)}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating value={r} readOnly size="small" />
                  <Typography variant="body2">({r})</Typography>
                </Stack>
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
        rowHeight={72}
        pageSizeOptions={[10, 25, 50, 100]} // Фиксируем высоту строки, чтобы 2 строки текста и аватарки вставали идеально
        columnVisibilityModel={{
          id: !isMobile,
          created_at: !isMobile,
        }}
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        sx={{
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
          },
        }}
      />
    </List>
  );
};
