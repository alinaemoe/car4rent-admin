import { useEffect, useState } from "react";
import { useList, useTranslate } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BuildIcon from "@mui/icons-material/Build";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HandshakeIcon from "@mui/icons-material/Handshake";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import PaymentsIcon from "@mui/icons-material/Payments";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
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

function MetricCard({
  icon,
  label,
  value,
  loading,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  loading?: boolean;
  onClick?: () => void;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        cursor: onClick ? "pointer" : "default",
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": onClick
          ? { boxShadow: 4, transform: "translateY(-2px)" }
          : undefined,
      }}
      onClick={onClick}
    >
      {icon}
      <Stack>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        {loading ? (
          <CircularProgress size={20} />
        ) : (
          <Typography variant="h5" fontWeight="bold">
            {value}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

function AlertCard({
  icon,
  label,
  value,
  loading,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  loading?: boolean;
  color?: string;
  onClick?: () => void;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        cursor: onClick ? "pointer" : "default",
        borderLeft: 4,
        borderColor: color ?? "warning.main",
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": onClick
          ? { boxShadow: 4, transform: "translateY(-2px)" }
          : undefined,
      }}
      onClick={onClick}
    >
      {icon}
      <Stack sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary" noWrap>
          {label}
        </Typography>
        {loading ? (
          <CircularProgress size={16} />
        ) : (
          <Typography variant="h6" fontWeight="bold">
            {value}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

export const Dashboard = () => {
  const t = useTranslate();
  const navigate = useNavigate();

  const { data: usersData, isLoading: usersLoading } = useList({
    resource: "users",
    pagination: { currentPage: 1, pageSize: 1 },
  }) as any;

  const { data: carsData, isLoading: carsLoading } = useList({
    resource: "cars",
    pagination: { currentPage: 1, pageSize: 1 },
  }) as any;

  const { data: rentalsData, isLoading: rentalsLoading } = useList({
    resource: "rentals",
    pagination: { currentPage: 1, pageSize: 1 },
  }) as any;

  const { data: damagesData, isLoading: damagesLoading } = useList({
    resource: "car-damages",
    pagination: { currentPage: 1, pageSize: 1 },
  }) as any;

  const { data: leadsData, isLoading: leadsLoading } = useList({
    resource: "rental-leads",
    pagination: { currentPage: 1, pageSize: 1 },
  }) as any;

  const { data: partnerData, isLoading: partnerLoading } = useList({
    resource: "partnership-requests",
    pagination: { currentPage: 1, pageSize: 1 },
  }) as any;

  const { data: overdueData, isLoading: overdueLoading } = useList({
    resource: "rentals",
    pagination: { currentPage: 1, pageSize: 1 },
    filters: [{ field: "status", operator: "eq", value: "OVERDUE" }],
  }) as any;

  const { data: unpaidDamagesData, isLoading: unpaidDamagesLoading } = useList({
    resource: "car-damages",
    pagination: { currentPage: 1, pageSize: 1 },
    filters: [{ field: "isPaid", operator: "eq", value: false }],
  }) as any;

  const { data: pendingDocsData, isLoading: pendingDocsLoading } = useList({
    resource: "documents",
    pagination: { currentPage: 1, pageSize: 1 },
    filters: [{ field: "status", operator: "eq", value: "PENDING" }],
  }) as any;

  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/transactions/admin/stats")
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));
  }, []);

  const count = (d: any) => d?.total ?? d?.data?.length ?? 0;
  const rev = stats?.totalRevenue ?? 0;
  const pendingPayouts = stats?.pendingPayouts ?? 0;
  const monthlyStats = stats?.monthlyStats ?? [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {t("dashboard.title", "Dashboard")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            icon={<PeopleIcon sx={{ fontSize: 40, color: "primary.main" }} />}
            label={t("dashboard.users", "Users")}
            value={count(usersData)}
            loading={usersLoading}
            onClick={() => navigate("/users")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            icon={
              <DirectionsCarIcon sx={{ fontSize: 40, color: "success.main" }} />
            }
            label={t("dashboard.cars", "Cars")}
            value={count(carsData)}
            loading={carsLoading}
            onClick={() => navigate("/cars")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            icon={
              <ReceiptLongIcon sx={{ fontSize: 40, color: "warning.main" }} />
            }
            label={t("dashboard.rentals", "Rentals")}
            value={count(rentalsData)}
            loading={rentalsLoading}
            onClick={() => navigate("/rentals")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            icon={
              <AccountBalanceIcon
                sx={{ fontSize: 40, color: "success.dark" }}
              />
            }
            label={t("dashboard.revenue", "Revenue")}
            value={statsLoading ? "" : formatCurrency(rev)}
            loading={statsLoading}
            onClick={() => navigate("/transactions")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            icon={
              <PaymentsIcon sx={{ fontSize: 40, color: "warning.dark" }} />
            }
            label={t("dashboard.pendingPayouts", "Pending Payouts")}
            value={statsLoading ? "" : formatCurrency(pendingPayouts)}
            loading={statsLoading}
            onClick={() => navigate("/transactions")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            icon={<BuildIcon sx={{ fontSize: 40, color: "error.main" }} />}
            label={t("dashboard.damages", "Damages")}
            value={count(damagesData)}
            loading={damagesLoading}
            onClick={() => navigate("/car-damages")}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, mb: 1 }}>
            {t("dashboard.needsAttention", "Needs Attention")}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AlertCard
            icon={<DescriptionIcon color="info" />}
            label={t("dashboard.pendingDocuments", "Pending Documents")}
            value={count(pendingDocsData)}
            loading={pendingDocsLoading}
            color="info.main"
            onClick={() => navigate("/documents")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AlertCard
            icon={<AssignmentIcon color="secondary" />}
            label={t("dashboard.newLeads", "New Rental Leads")}
            value={count(leadsData)}
            loading={leadsLoading}
            color="secondary.main"
            onClick={() => navigate("/rental-leads")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AlertCard
            icon={<HandshakeIcon sx={{ color: "#43a047" }} />}
            label={t("dashboard.partnerRequests", "Partner Requests")}
            value={count(partnerData)}
            loading={partnerLoading}
            color="#43a047"
            onClick={() => navigate("/partnership-requests")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AlertCard
            icon={<WarningAmberIcon color="warning" />}
            label={t("dashboard.overdueRentals", "Overdue Rentals")}
            value={count(overdueData)}
            loading={overdueLoading}
            color="warning.main"
            onClick={() => navigate("/rentals")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AlertCard
            icon={<ReportProblemIcon color="error" />}
            label={t("dashboard.unpaidDamages", "Unpaid Damages")}
            value={count(unpaidDamagesData)}
            loading={unpaidDamagesLoading}
            color="error.main"
            onClick={() => navigate("/car-damages")}
          />
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 3, mt: 1 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {t("dashboard.monthlyRevenue", "Monthly Revenue (Last 6 Months)")}
            </Typography>
            {statsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : monthlyStats.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                {t("messages.no_data", "No data found")}
              </Typography>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#2e7d32"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
