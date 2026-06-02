import { useEffect, useState } from "react";
import { useTranslate } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HandshakeIcon from "@mui/icons-material/Handshake";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { axiosInstance } from "../../utility/axios-instance";

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

const ALERT_COLORS: Record<string, string> = {
  pendingDocuments: "info.main",
  newLeads: "secondary.main",
  newPartnershipRequests: "#43a047",
  overdueRentals: "warning.main",
  unpaidDamages: "error.main",
};

function docsFilterUrl() {
  return `/documents?filters[0][field]=status&filters[0][operator]=eq&filters[0][value]=PENDING`;
}

const PIE_COLORS = [
  "#42a5f5",
  "#7e57c2",
  "#66bb6a",
  "#bdbdbd",
  "#ef5350",
  "#ffa726",
];

interface DashboardData {
  users: { total: number; thisMonth: number; thisWeek: number; registrationsByMonth: { month: string; count: number }[] };
  cars: { total: number; available: number; rented: number; maintenance: number; topBrands: { brand: string; count: number }[] };
  rentals: { total: number; thisMonth: number; byStatus: Record<string, number>; avgDuration: number | null };
  revenue: { total: number; thisMonth: number; pendingPayouts: number; monthlyStats: { month: string; revenue: number; fees: number; payouts: number; count: number; penalties: number }[] };
  alerts: { pendingDocuments: number; newLeads: number; newPartnershipRequests: number; overdueRentals: number; unpaidDamages: number };
}

function MetricCard({
  icon,
  label,
  value,
  sublabel,
  loading,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  loading?: boolean;
  color: string;
  onClick?: () => void;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        cursor: onClick ? "pointer" : "default",
        borderTop: 4,
        borderColor: color,
        transition: "box-shadow 0.25s, transform 0.25s",
        "&:hover": onClick
          ? { boxShadow: 6, transform: "translateY(-4px)" }
          : undefined,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      onClick={onClick}
    >
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: `${color}18`,
              color: color,
            }}
          >
            {icon}
          </Box>
          <Typography variant="overline" color="text.secondary" fontWeight={600}>
            {label}
          </Typography>
        </Stack>
        {loading ? (
          <Skeleton variant="text" width={100} height={40} />
        ) : (
          <Typography variant="h4" fontWeight={800}>
            {value}
          </Typography>
        )}
        {sublabel && (
          <Typography variant="caption" color="text.secondary">
            {sublabel}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

function AlertBadge({
  icon,
  label,
  value,
  loading,
  color,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  loading?: boolean;
  color: string;
  subtitle?: string;
  onClick?: () => void;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        cursor: onClick ? "pointer" : "default",
        borderLeft: 4,
        borderColor: color,
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": onClick
          ? { boxShadow: 4, transform: "translateY(-2px)" }
          : undefined,
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
      onClick={onClick}
    >
      <Box sx={{ color, display: "flex" }}>{icon}</Box>
      <Stack sx={{ minWidth: 0 }} spacing={0.2}>
        <Typography variant="body2" color="text.secondary" noWrap fontWeight={500}>
          {label}
        </Typography>
        {loading ? (
          <Skeleton variant="text" width={40} height={28} />
        ) : (
          <Typography variant="h6" fontWeight={700}>
            {value}
          </Typography>
        )}
        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color,
              fontWeight: 600,
              fontSize: 11,
              lineHeight: 1.2,
              opacity: 0.85,
            }}
            noWrap
          >
            {subtitle}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

export const Dashboard = () => {
  const t = useTranslate();
  const navigate = useNavigate();
  const theme = useTheme();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/admin/dashboard")
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const d = data;
  const isEmpty = !loading && !d;

  if (isEmpty) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">
          {t("messages.loading_error", "Failed to load dashboard data")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>
          {t("dashboard.title", "Dashboard")}
        </Typography>
        {loading && (
          <Chip
            icon={<CircularProgress size={14} />}
            label="Loading..."
            size="small"
            variant="outlined"
          />
        )}
      </Stack>

      {/* ─── Row 1: Key Metrics ─── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            icon={<PeopleIcon />}
            label={t("dashboard.users", "Users")}
            value={d ? formatNumber(d.users.total) : "—"}
            sublabel={
              d
                ? `${t("dashboard.thisMonth", "This month")}: +${formatNumber(d.users.thisMonth)}`
                : undefined
            }
            loading={loading}
            color={theme.palette.primary.main}
            onClick={() => navigate("/users")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            icon={<DirectionsCarIcon />}
            label={t("dashboard.cars", "Cars")}
            value={d ? formatNumber(d.cars.total) : "—"}
            sublabel={
              d
                ? `${d.cars.available} ${t("dashboard.available", "available")} · ${d.cars.rented} ${t("dashboard.rented", "rented")}`
                : undefined
            }
            loading={loading}
            color={theme.palette.success.main}
            onClick={() => navigate("/cars")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            icon={<ReceiptLongIcon />}
            label={t("dashboard.rentals", "Rentals")}
            value={d ? formatNumber(d.rentals.total) : "—"}
            sublabel={
              d
                ? `${t("dashboard.thisMonth", "This month")}: +${formatNumber(d.rentals.thisMonth)}`
                : undefined
            }
            loading={loading}
            color={theme.palette.warning.main}
            onClick={() => navigate("/rentals")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            icon={<AccountBalanceIcon />}
            label={t("dashboard.revenue", "Revenue")}
            value={d ? formatCurrency(d.revenue.total) : "—"}
            sublabel={
              d
                ? `${t("dashboard.thisMonth", "This month")}: ${formatCurrency(d.revenue.thisMonth)}`
                : undefined
            }
            loading={loading}
            color={theme.palette.success.dark}
            onClick={() => navigate("/transactions")}
          />
        </Grid>
      </Grid>

      {/* ─── Row 2: Alerts ─── */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        🔔 {t("dashboard.needsAttention", "Needs Attention")}
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {(
          [
            ["pendingDocuments", DescriptionIcon, "info.main", docsFilterUrl(), "dashboard.awaitingReview"],
            ["newLeads", AssignmentIcon, "secondary.main", "/rental-leads", "dashboard.newStatus"],
            ["newPartnershipRequests", HandshakeIcon, "#43a047", "/partnership-requests", "dashboard.newStatus"],
            ["overdueRentals", WarningAmberIcon, "warning.main", "/rentals", "dashboard.overdueStatus"],
            ["unpaidDamages", ReportProblemIcon, "error.main", "/car-damages", "dashboard.unpaidStatus"],
          ] as const
        ).map(([key, Icon, color, path, subtitleKey]) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
            <AlertBadge
              icon={<Icon />}
              label={t(`dashboard.${key}`, key)}
              value={d ? (d.alerts as any)[key] ?? 0 : 0}
              loading={loading}
              color={color}
              subtitle={t(subtitleKey, "")}
              onClick={() => navigate(path)}
            />
          </Grid>
        ))}
      </Grid>

      {/* ─── Row 3: Charts ─── */}
      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {t("dashboard.monthlyRevenue", "Monthly Revenue (Last 6 Months)")}
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={d?.revenue.monthlyStats ?? []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Bar
                    dataKey="revenue"
                    name={t("dashboard.revenue", "Revenue")}
                    fill={theme.palette.success.main}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Rentals by Status Pie */}
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {t("dashboard.rentalStatus", "Rental Status")}
            </Typography>
            {loading ? (
              <Skeleton variant="circular" width={200} height={200} sx={{ mx: "auto", mt: 2 }} />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(d?.rentals.byStatus ?? {}).map(
                      ([status, count]) => ({ name: status, value: count }),
                    )}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={40}
                    dataKey="value"
                    label={({ name, percent }: any) =>
                      `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {Object.entries(d?.rentals.byStatus ?? {}).map((_, i) => (
                      <Cell
                        key={i}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* User Registrations Chart */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {t("dashboard.userRegistrations", "User Registrations (12 Months)")}
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 1 }} />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={d?.users.registrationsByMonth ?? []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={11} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    name={t("dashboard.users", "Users")}
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Top Brands Chart */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {t("dashboard.topBrands", "Top Car Brands")}
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 1 }} />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={d?.cars.topBrands ?? []}
                  layout="vertical"
                  margin={{ left: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" fontSize={12} />
                  <YAxis type="category" dataKey="brand" fontSize={12} />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    name={t("dashboard.cars", "Cars")}
                    fill={theme.palette.warning.main}
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* ─── Bottom summary bar ─── */}
      {d && (
        <Paper variant="outlined" sx={{ mt: 3, p: 2, display: "flex", gap: 3, flexWrap: "wrap" }}>
          <Typography variant="body2" color="text.secondary">
            <strong>{t("dashboard.pendingPayouts", "Pending Payouts")}:</strong>{" "}
            {formatCurrency(d.revenue.pendingPayouts)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>{t("dashboard.avgDuration", "Avg. Rental Duration")}:</strong>{" "}
            {d.rentals.avgDuration
              ? `${d.rentals.avgDuration} days`
              : "—"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>{t("dashboard.totalThisMonth", "Total This Month")}:</strong>{" "}
            {d.rentals.thisMonth} {t("dashboard.rentals", "rentals")} ·{" "}
            {d.users.thisMonth} {t("dashboard.users", "users")} ·{" "}
            {formatCurrency(d.revenue.thisMonth)}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
