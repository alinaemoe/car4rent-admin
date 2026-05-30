import {
  Chip,
  Avatar,
  Box,
  Typography,
  Stack,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { DateField, ShowButton } from "@refinedev/mui";
import { GridColDef } from "@mui/x-data-grid";
import { TransactionRow, TransactionType, PayoutStatus } from "./types";
import {
  payoutStatusColors,
  payoutStatusLabels,
  typeLabels,
} from "./constants";

type TranslateFn = (key: string, fallback?: string) => string;

// Хелпер-обертка для предотвращения прыжков высоты у чипов, дат и кнопок действий
const CenterCell: React.FC<{
  children: React.ReactNode;
  justifyContent?: string;
}> = ({ children, justifyContent = "center" }) => (
  <Box
    sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent,
      overflow: "hidden",
    }}
  >
    {children}
  </Box>
);

export const getTransactionColumns = (
  t: TranslateFn,
  updatingId: number | null,
  handlePayoutStatusChange: (id: number, newStatus: PayoutStatus) => void,
): GridColDef<TransactionRow>[] => [
  {
    field: "id",
    headerName: "ID",
    width: 70,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <CenterCell>
        <Typography variant="body2" fontWeight={500}>
          #{params.row.id}
        </Typography>
      </CenterCell>
    ),
  },
  {
    field: "rental",
    headerName: t("transactions.fields.rental", "Rental"),
    width: 100,
    align: "center",
    headerAlign: "center",
    valueGetter: (_, row) => row.rental?.id ?? "-",
    renderCell: (params) => (
      <CenterCell>
        <Chip
          label={`#${params.value}`}
          size="small"
          variant="outlined"
          color="primary"
        />
      </CenterCell>
    ),
  },
  {
    field: "type",
    headerName: t("transactions.fields.type", "Type"),
    width: 140, // Чуть расширили под длинные слова локализации
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      const type = params.row.type as TransactionType;
      const colorMap: Record<TransactionType, "primary" | "warning" | "error"> =
        {
          [TransactionType.RENTAL_PAYMENT]: "primary",
          [TransactionType.PENALTY]: "warning",
          [TransactionType.DAMAGE_COMPENSATION]: "error",
        };
      return (
        <CenterCell>
          <Chip
            label={typeLabels(t)[type]}
            color={colorMap[type]}
            size="small"
            variant="outlined"
          />
        </CenterCell>
      );
    },
  },
  {
    field: "car",
    headerName: t("transactions.fields.car", "Car"),
    minWidth: 220,
    flex: 1,
    renderCell: (params) => {
      const car = params.row.car;
      if (!car)
        return (
          <CenterCell justifyContent="flex-start">
            <Typography variant="body2" color="text.secondary">
              -
            </Typography>
          </CenterCell>
        );
      return (
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ height: "100%", width: "100%", overflow: "hidden" }}
        >
          {car.images?.[0]?.image_url ? (
            <Avatar
              src={car.images[0].image_url}
              variant="rounded"
              sx={{ width: 40, height: 28, flexShrink: 0 }}
            />
          ) : (
            <Avatar
              variant="rounded"
              sx={{
                width: 40,
                height: 28,
                bgcolor: "primary.light",
                flexShrink: 0,
              }}
            >
              {car.brand?.[0] || "?"}
            </Avatar>
          )}
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
              fontWeight={500}
              noWrap
              sx={{ display: "block", lineHeight: 1.2 }}
            >
              {car.brand} {car.model}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ display: "block", lineHeight: 1.2, mt: "2px" }}
            >
              {car.license_plate}
            </Typography>
          </Box>
        </Stack>
      );
    },
  },
  {
    field: "lessor",
    headerName: t("transactions.fields.lessor", "Lessor"),
    minWidth: 180,
    flex: 0.8,
    renderCell: (params) => {
      const lessor = params.row.lessor;
      if (!lessor)
        return (
          <CenterCell justifyContent="flex-start">
            <Typography variant="body2" color="text.secondary">
              -
            </Typography>
          </CenterCell>
        );
      return (
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ height: "100%", width: "100%", overflow: "hidden" }}
        >
          <Avatar
            src={lessor.avatar_url || undefined}
            sx={{ width: 28, height: 28, flexShrink: 0 }}
          >
            {(lessor.first_name?.[0] || "") + (lessor.last_name?.[0] || "") ||
              "?"}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              noWrap
              sx={{ display: "block", lineHeight: 1.2 }}
            >
              {lessor.first_name} {lessor.last_name}
            </Typography>
          </Box>
        </Stack>
      );
    },
  },
  {
    field: "total_amount",
    headerName: t("transactions.fields.totalAmount", "Total"),
    width: 110,
    align: "right",
    headerAlign: "right",
    renderCell: (params) => (
      <CenterCell justifyContent="flex-end">
        <Typography variant="body2" fontWeight={600} color="text.primary">
          ${Number(params.row.total_amount).toLocaleString()}
        </Typography>
      </CenterCell>
    ),
  },
  {
    field: "payout_status",
    headerName: t("transactions.fields.payoutStatus", "Payout"),
    width: 160, // Увеличил со 140 до 160 — теперь любой статус влезет целиком
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      const status = params.row.payout_status as PayoutStatus;
      return (
        <CenterCell>
          <FormControl
            size="small"
            sx={{ minWidth: 130, display: "flex", justifyContent: "center" }}
          >
            <Select
              value={status}
              disabled={updatingId === params.row.id}
              onChange={(e) =>
                handlePayoutStatusChange(
                  params.row.id,
                  e.target.value as PayoutStatus,
                )
              }
              sx={{
                height: 32,
                "& .MuiSelect-select": {
                  py: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                },
              }}
              renderValue={(val) => (
                <Chip
                  label={payoutStatusLabels(t)[val as PayoutStatus]}
                  color={payoutStatusColors[val as PayoutStatus]}
                  size="small"
                />
              )}
            >
              {Object.values(PayoutStatus).map((ps) => (
                <MenuItem key={ps} value={ps} sx={{ justifyContent: "center" }}>
                  <Chip
                    label={payoutStatusLabels(t)[ps]}
                    color={payoutStatusColors[ps]}
                    size="small"
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CenterCell>
      );
    },
  },
  {
    field: "created_at",
    headerName: t("transactions.fields.createdAt", "Created"),
    width: 130,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <CenterCell>
        <DateField format="MMM DD, YYYY" value={params.row.created_at} />
      </CenterCell>
    ),
  },
  {
    field: "actions",
    type: "actions",
    headerName: t("transactions.fields.actions", "Actions"),
    sortable: false,
    width: 80,
    align: "center",
    headerAlign: "center",
    renderCell: ({ row }) => (
      <CenterCell>
        <ShowButton size="small" hideText recordItemId={row.id} />
      </CenterCell>
    ),
  },
];
