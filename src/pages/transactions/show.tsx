import { useShow, useTranslate } from "@refinedev/core";
import { Show } from "@refinedev/mui";
import {
  Typography,
  Stack,
  Avatar,
  Chip,
  Box,
  Divider,
  Grid,
  Paper,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import {
  AccountBalanceWallet,
  Payments,
  Receipt,
  Person,
  DirectionsCar,
  CalendarToday,
  LocalOffer,
} from "@mui/icons-material";
import { DateField } from "@refinedev/mui";
import { PayoutStatus, TransactionType, DepositStatus, PaymentStatus } from "./types";
import {
  payoutStatusColors,
  payoutStatusLabels,
  typeLabels,
  depositStatusColors,
  depositStatusLabels,
  paymentStatusColors,
  paymentStatusLabels,
} from "./constants";

const typeColorMap: Record<TransactionType, "primary" | "warning" | "error"> = {
  [TransactionType.RENTAL_PAYMENT]: "primary",
  [TransactionType.PENALTY]: "warning",
  [TransactionType.DAMAGE_COMPENSATION]: "error",
};

const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(Number(value));

export const TransactionShow = () => {
  const t = useTranslate();
  const { query } = useShow<any>();
  const isLoading = query?.isLoading;
  const record = query?.data?.data;

  if (isLoading) return <div>Loading...</div>;
  if (!record) return <div>No data found</div>;

  const total = Number(record.total_amount);
  const base = Number(record.base_rental_amount);
  const penalty = Number(record.penalty_amount);
  const customerOwes = Number(record.customer_total);
  const depositAmount = Number(record.deposit_amount);
  const fee = Number(record.system_fee);
  const income = Number(record.lessor_income);
  const payoutStatus = record.payout_status as PayoutStatus;
  const type = record.type as TransactionType;
  const depositStatus = record.deposit_status as DepositStatus;
  const paymentStatus = record.payment_status as PaymentStatus;
  const totalBar = fee + income || 1;

  return (
    <Show isLoading={isLoading}>
      {/* Header */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center" mb={4}>
        <Box textAlign={{ xs: "center", sm: "left" }}>
          <Typography variant="h4" fontWeight={700}>
            Transaction #{record.id}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} justifyContent={{ xs: "center", sm: "flex-start" }}>
            <Chip icon={<LocalOffer />} label={typeLabels(t)[type]} color={typeColorMap[type]} size="small" variant="outlined" />
            <Chip
              label={payoutStatusLabels(t)[payoutStatus]}
              color={payoutStatusColors[payoutStatus]}
              size="small"
            />
            <Chip
              label={paymentStatusLabels(t)[paymentStatus]}
              color={paymentStatusColors[paymentStatus]}
              size="small"
            />
          </Stack>
        </Box>
      </Stack>

      <Divider sx={{ mb: 4 }} />

      {/* Info Cards Row */}
      <Grid container spacing={3} mb={4}>
        {/* Car Card */}
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <DirectionsCar color="primary" />
              <Typography variant="h6" fontWeight={600}>{t("transactions.fields.car", "Car")}</Typography>
            </Stack>
            {record.car ? (
              <Stack direction="row" spacing={2} alignItems="center">
                {record.car.images?.[0]?.image_url ? (
                  <Avatar src={record.car.images[0].image_url} variant="rounded" sx={{ width: 64, height: 48 }} />
                ) : (
                  <Avatar variant="rounded" sx={{ width: 64, height: 48, bgcolor: "primary.light" }}>
                    {record.car.brand[0]}
                  </Avatar>
                )}
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    {record.car.brand} {record.car.model}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {record.car.license_plate}
                  </Typography>
                </Box>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">-</Typography>
            )}
          </Paper>
        </Grid>

        {/* Lessor Card */}
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Person color="primary" />
              <Typography variant="h6" fontWeight={600}>{t("transactions.fields.lessor", "Lessor")}</Typography>
            </Stack>
            {record.lessor ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={record.lessor.avatar_url || undefined} sx={{ width: 48, height: 48 }}>
                  {record.lessor.first_name?.[0]}{record.lessor.last_name?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    {record.lessor.first_name} {record.lessor.last_name}
                  </Typography>
                </Box>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">-</Typography>
            )}
          </Paper>
        </Grid>

        {/* Rental Card */}
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <CalendarToday color="primary" />
              <Typography variant="h6" fontWeight={600}>{t("transactions.fields.rental", "Rental")}</Typography>
            </Stack>
            {record.rental ? (
              <Typography variant="body1" fontWeight={600}>
                Rental #{record.rental.id}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">-</Typography>
            )}
            <Stack direction="row" spacing={1} mt={1}>
              <Chip icon={<CalendarToday />} label={<DateField format="MMM DD, YYYY" value={record.created_at} />} size="small" variant="outlined" />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Financial Breakdown */}
      <Typography variant="h6" fontWeight={600} mb={2}>
        {t("transactions.titles.financialBreakdown", "Financial Breakdown")}
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Stack spacing={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" fontWeight={700}>
                  {formatCurrency(total)}
                </Typography>
                <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>
                  {t("transactions.fields.totalAmount", "Total Amount")}
                </Typography>
              </Box>
              <Divider />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">{t("transactions.fields.baseRental", "Base Rental")}</Typography>
                <Typography variant="body2" fontWeight={500}>{formatCurrency(base)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="error.main">{t("transactions.fields.penalty", "Penalty")}</Typography>
                <Typography variant="body2" fontWeight={500} color="error.main">{formatCurrency(penalty)}</Typography>
              </Box>
              <Divider />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" fontWeight={700}>{t("transactions.fields.customerTotal", "Customer Owes")}</Typography>
                <Typography variant="body2" fontWeight={700} color="warning.main">{formatCurrency(customerOwes)}</Typography>
              </Box>
              <Divider />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" color="info.main">{t("transactions.fields.deposit", "Deposit")}</Typography>
                  <Chip
                    label={depositStatusLabels(t)[depositStatus] || depositStatus}
                    color={depositStatusColors[depositStatus]}
                    size="small"
                  />
                </Stack>
                <Typography variant="body2" fontWeight={500} color="info.main">{formatCurrency(depositAmount)}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Split Visualization */}
        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Typography variant="subtitle1" fontWeight={600} mb={3}>
              {t("transactions.titles.revenueSplit", "Revenue Split")}
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccountBalanceWallet fontSize="small" color="info" />
                    <Typography variant="body2">{t("transactions.fields.systemFee", "System Fee")}</Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={600} color="info.main">{formatCurrency(fee)}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(fee / totalBar) * 100}
                  sx={{ height: 8, borderRadius: 4, bgcolor: "action.hover", "& .MuiLinearProgress-bar": { bgcolor: "info.main" } }}
                />
              </Box>

              <Box>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Payments fontSize="small" color="success" />
                    <Typography variant="body2">{t("transactions.fields.lessorIncome", "Lessor Income")}</Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={600} color="success.main">{formatCurrency(income)}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(income / totalBar) * 100}
                  sx={{ height: 8, borderRadius: 4, bgcolor: "action.hover", "& .MuiLinearProgress-bar": { bgcolor: "success.main" } }}
                />
              </Box>
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Status cards */}
            <Typography variant="subtitle2" color="text.secondary" mb={2} textTransform="uppercase" letterSpacing={0.5}>
              {t("transactions.titles.statuses", "Statuses")}
            </Typography>
            <Stack spacing={1.5}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">{t("transactions.fields.payoutStatus", "Payout")}</Typography>
                <Chip label={payoutStatusLabels(t)[payoutStatus]} color={payoutStatusColors[payoutStatus]} size="small" />
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">{t("transactions.fields.paymentStatus", "Payment")}</Typography>
                <Chip label={paymentStatusLabels(t)[paymentStatus]} color={paymentStatusColors[paymentStatus]} size="small" />
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">{t("transactions.fields.type", "Type")}</Typography>
                <Chip label={typeLabels(t)[type]} color={typeColorMap[type]} size="small" variant="outlined" />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Show>
  );
};
