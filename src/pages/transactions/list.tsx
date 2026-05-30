import { useState, useEffect, useMemo } from "react";
import { useTranslate, CrudFilter } from "@refinedev/core";
import { List, DateField } from "@refinedev/mui";
import { useDataGrid } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { axiosInstance, API_URL } from "../../utility/axios-instance";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  Stack,
  TextField,
  Button,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import {
  TrendingUp,
  AccountBalanceWallet,
  Receipt,
  Payments,
  AttachMoney,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

enum PayoutStatus {
  NOT_APPLICABLE = "NOT_APPLICABLE",
  PENDING = "PENDING",
  PAID = "PAID",
}

enum TransactionType {
  RENTAL_PAYMENT = "RENTAL_PAYMENT",
  PENALTY = "PENALTY",
  DAMAGE_COMPENSATION = "DAMAGE_COMPENSATION",
}

interface TransactionRow {
  id: number;
  rental: { id: number } | null;
  car: { id: number; brand: string; model: string; license_plate: string; images?: { image_url: string }[] } | null;
  lessor: { id: string; first_name: string; last_name: string; avatar_url?: string } | null;
  total_amount: string;
  system_fee: string;
  lessor_income: string;
  payout_status: PayoutStatus;
  type: TransactionType;
  created_at: string;
}

interface StatsData {
  totalRevenue: number;
  totalSystemFees: number;
  totalLessorIncome: number;
  pendingPayouts: number;
  transactionCount: number;
  monthlyStats: { month: string; revenue: number; fees: number; payouts: number; count: number }[];
  payoutStatusCounts: Record<string, number>;
  typeCounts: Record<string, number>;
}

const payoutStatusColors: Record<PayoutStatus, "default" | "warning" | "success"> = {
  [PayoutStatus.NOT_APPLICABLE]: "default",
  [PayoutStatus.PENDING]: "warning",
  [PayoutStatus.PAID]: "success",
};

const payoutStatusLabels = (t: (key: string, fallback?: string) => string): Record<PayoutStatus, string> => ({
  [PayoutStatus.NOT_APPLICABLE]: t("transactions.payoutStatus.notApplicable", "N/A"),
  [PayoutStatus.PENDING]: t("transactions.payoutStatus.pending", "Pending"),
  [PayoutStatus.PAID]: t("transactions.payoutStatus.paid", "Paid"),
});

const typeLabels = (t: (key: string, fallback?: string) => string): Record<TransactionType, string> => ({
  [TransactionType.RENTAL_PAYMENT]: t("transactions.type.rentalPayment", "Rental Payment"),
  [TransactionType.PENALTY]: t("transactions.type.penalty", "Penalty"),
  [TransactionType.DAMAGE_COMPENSATION]: t("transactions.type.damageCompensation", "Damage Comp."),
});

const PIE_COLORS = ["#90a4ae", "#ff9800", "#4caf50"];

export const TransactionList = () => {
  const t = useTranslate();
  const theme = useTheme();

  const [stats, setStats] = useState<StatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [filterPayoutStatus, setFilterPayoutStatus] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const { dataGridProps, setFilters } = useDataGrid({
    syncWithLocation: true,
    pagination: { pageSize: 25 },
  });

  useEffect(() => {
    const filterArr: CrudFilter[] = [];
    if (filterPayoutStatus) filterArr.push({ field: "payout_status", operator: "eq", value: filterPayoutStatus });
    if (filterType) filterArr.push({ field: "type", operator: "eq", value: filterType });
    if (fromDate) filterArr.push({ field: "from_date", operator: "gte", value: fromDate });
    if (toDate) filterArr.push({ field: "to_date", operator: "lte", value: toDate });
    setFilters(filterArr);
  }, [filterPayoutStatus, filterType, fromDate, toDate, setFilters]);

  useEffect(() => {
    setStatsLoading(true);
    axiosInstance
      .get(`${API_URL}/transactions/admin/stats`)
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  const handlePayoutStatusChange = async (id: number, newStatus: PayoutStatus) => {
    setUpdatingId(id);
    try {
      await axiosInstance.patch(`${API_URL}/transactions/${id}/payout-status`, {
        payout_status: newStatus,
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = useMemo<GridColDef<TransactionRow>[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 70,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "rental",
        headerName: t("transactions.fields.rental", "Rental ID"),
        width: 100,
        align: "center",
        headerAlign: "center",
        valueGetter: (_, row) => row.rental?.id ?? "-",
        renderCell: (params) => (
          <Chip label={`#${params.value}`} size="small" variant="outlined" color="primary" />
        ),
      },
      {
        field: "car",
        headerName: t("transactions.fields.car", "Car"),
        minWidth: 180,
        flex: 1,
        renderCell: (params) => {
          const car = params.row.car;
          if (!car) return <Typography variant="body2" color="text.secondary">-</Typography>;
          return (
            <Stack direction="row" spacing={1} alignItems="center">
              {car.images?.[0]?.image_url ? (
                <Avatar src={car.images[0].image_url} sx={{ width: 32, height: 32, borderRadius: 1 }} />
              ) : (
                <Avatar sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: "primary.light" }}>
                  {car.brand[0]}
                </Avatar>
              )}
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {car.brand} {car.model}
                </Typography>
                <Typography variant="caption" color="text.secondary">
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
        minWidth: 160,
        flex: 1,
        renderCell: (params) => {
          const lessor = params.row.lessor;
          if (!lessor) return <Typography variant="body2" color="text.secondary">-</Typography>;
          return (
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar src={lessor.avatar_url || undefined} sx={{ width: 28, height: 28 }}>
                {lessor.first_name?.[0]}{lessor.last_name?.[0]}
              </Avatar>
              <Typography variant="body2">
                {lessor.first_name} {lessor.last_name}
              </Typography>
            </Stack>
          );
        },
      },
      {
        field: "total_amount",
        headerName: t("transactions.fields.totalAmount", "Total"),
        width: 120,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={600} color="text.primary">
            ${Number(params.row.total_amount).toLocaleString()}
          </Typography>
        ),
      },
      {
        field: "system_fee",
        headerName: t("transactions.fields.systemFee", "Fee"),
        width: 100,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <Typography variant="body2" color="text.secondary">
            ${Number(params.row.system_fee).toLocaleString()}
          </Typography>
        ),
      },
      {
        field: "lessor_income",
        headerName: t("transactions.fields.lessorIncome", "Income"),
        width: 110,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={500} color="success.main">
            ${Number(params.row.lessor_income).toLocaleString()}
          </Typography>
        ),
      },
      {
        field: "payout_status",
        headerName: t("transactions.fields.payoutStatus", "Payout"),
        width: 140,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const status = params.row.payout_status as PayoutStatus;
          return (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={status}
                disabled={updatingId === params.row.id}
                onChange={(e) =>
                  handlePayoutStatusChange(params.row.id, e.target.value as PayoutStatus)
                }
                sx={{
                  height: 32,
                  "& .MuiSelect-select": { py: 0.5 },
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
                  <MenuItem key={ps} value={ps}>
                    <Chip
                      label={payoutStatusLabels(t)[ps]}
                      color={payoutStatusColors[ps]}
                      size="small"
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        },
      },
      {
        field: "type",
        headerName: t("transactions.fields.type", "Type"),
        width: 150,
        renderCell: (params) => {
          const type = params.row.type as TransactionType;
          const colorMap: Record<TransactionType, "primary" | "warning" | "error"> = {
            [TransactionType.RENTAL_PAYMENT]: "primary",
            [TransactionType.PENALTY]: "warning",
            [TransactionType.DAMAGE_COMPENSATION]: "error",
          };
          return (
            <Chip label={typeLabels(t)[type]} color={colorMap[type]} size="small" variant="outlined" />
          );
        },
      },
      {
        field: "created_at",
        headerName: t("transactions.fields.createdAt", "Created"),
        width: 140,
        renderCell: (params) => (
          <DateField format="MMM DD, YYYY" value={params.row.created_at} />
        ),
      },
    ],
    [t, updatingId],
  );

  const monthlyChartData = useMemo(() => {
    if (!stats?.monthlyStats) return [];
    return stats.monthlyStats.map((m) => ({
      month: m.month,
      Revenue: m.revenue,
      Fees: m.fees,
      Payouts: m.payouts,
    }));
  }, [stats]);

  const pieData = useMemo(() => {
    if (!stats?.payoutStatusCounts) return [];
    return Object.entries(stats.payoutStatusCounts).map(([name, value]) => ({
      name: payoutStatusLabels(t)[name as PayoutStatus] || name,
      value,
    }));
  }, [stats, t]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(value);

  return (
    <List>
      {/* Analytics Dashboard */}
      <Typography variant="h5" fontWeight={700} mb={3}>
        {t("transactions.titles.dashboard", "Analytics Dashboard")}
      </Typography>

      <Grid container spacing={2.5} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3 }}>
            <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500} textTransform="uppercase" letterSpacing={0.5}>
                    {t("transactions.stats.totalRevenue", "Total Revenue")}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} mt={0.5}>
                    {statsLoading ? "-" : formatCurrency(stats?.totalRevenue || 0)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "primary.main", width: 44, height: 44, borderRadius: 2 }}>
                  <AttachMoney />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3 }}>
            <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500} textTransform="uppercase" letterSpacing={0.5}>
                    {t("transactions.stats.pendingPayouts", "Pending Payouts")}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} mt={0.5} color="warning.main">
                    {statsLoading ? "-" : formatCurrency(stats?.pendingPayouts || 0)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "warning.main", width: 44, height: 44, borderRadius: 2 }}>
                  <Payments />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3 }}>
            <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500} textTransform="uppercase" letterSpacing={0.5}>
                    {t("transactions.stats.systemFees", "System Fees")}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} mt={0.5} color="info.main">
                    {statsLoading ? "-" : formatCurrency(stats?.totalSystemFees || 0)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "info.main", width: 44, height: 44, borderRadius: 2 }}>
                  <Receipt />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3 }}>
            <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500} textTransform="uppercase" letterSpacing={0.5}>
                    {t("transactions.stats.transactionCount", "Transactions")}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} mt={0.5}>
                    {statsLoading ? "-" : (stats?.transactionCount || 0).toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "success.main", width: 44, height: 44, borderRadius: 2 }}>
                  <TrendingUp />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={2.5} mb={4}>
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              {t("transactions.charts.monthlyRevenue", "Monthly Revenue (Last 6 Months)")}
            </Typography>
            <Box sx={{ width: "100%", height: 300 }}>
              {monthlyChartData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyChartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke={theme.palette.text.secondary} />
                    <YAxis tick={{ fontSize: 12 }} stroke={theme.palette.text.secondary} />
                    <Tooltip
                      formatter={(value: any) => [`$${Number(value ?? 0).toLocaleString()}`, undefined]}
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                      }}
                    />
                    <Bar dataKey="Revenue" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Fees" fill={theme.palette.info.main} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Payouts" fill={theme.palette.success.main} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              {t("transactions.charts.payoutStatus", "Payout Status")}
            </Typography>
            <Box sx={{ width: "100%", height: 300, display: "flex", justifyContent: "center" }}>
              {pieData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>{t("transactions.filters.payoutStatus", "Payout Status")}</InputLabel>
              <Select
                value={filterPayoutStatus}
                label={t("transactions.filters.payoutStatus", "Payout Status")}
                onChange={(e) => setFilterPayoutStatus(e.target.value)}
              >
                <MenuItem value="">
                  <em>{t("transactions.filters.all", "All")}</em>
                </MenuItem>
                {Object.values(PayoutStatus).map((ps) => (
                  <MenuItem key={ps} value={ps}>
                    <Chip label={payoutStatusLabels(t)[ps]} color={payoutStatusColors[ps as PayoutStatus]} size="small" />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>{t("transactions.filters.type", "Type")}</InputLabel>
              <Select
                value={filterType}
                label={t("transactions.filters.type", "Type")}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="">
                  <em>{t("transactions.filters.all", "All")}</em>
                </MenuItem>
                {Object.values(TransactionType).map((tp) => (
                  <MenuItem key={tp} value={tp}>
                    {typeLabels(t)[tp]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label={t("transactions.filters.fromDate", "From")}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label={t("transactions.filters.toDate", "To")}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              variant="text"
              color="secondary"
              size="small"
              onClick={() => {
                setFilterPayoutStatus("");
                setFilterType("");
                setFromDate("");
                setToDate("");
              }}
            >
              {t("transactions.filters.clear", "Clear Filters")}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* DataGrid */}
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        density="comfortable"
        rowHeight={56}
        pageSizeOptions={[10, 25, 50, 100]}
        sx={{
          "& .MuiDataGrid-cell": { display: "flex", alignItems: "center" },
          "& .MuiDataGrid-row:hover": { backgroundColor: "action.hover" },
          border: 0,
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: 2,
            borderColor: "divider",
            backgroundColor: "action.hover",
          },
        }}
      />
    </List>
  );
};
