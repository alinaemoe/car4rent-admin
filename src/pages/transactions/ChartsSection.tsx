import { Box, Paper, Typography, Grid, useTheme } from "@mui/material";
import { useTranslate } from "@refinedev/core";
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
import { PIE_COLORS } from "./constants";

interface ChartsSectionProps {
  monthlyChartData: { month: string; Revenue: number; Fees: number; Payouts: number; Penalties: number }[];
  pieData: { name: string; value: number }[];
}

export const ChartsSection = ({ monthlyChartData, pieData }: ChartsSectionProps) => {
  const t = useTranslate();
  const theme = useTheme();

  return (
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
                  <Bar dataKey="Penalties" fill={theme.palette.error.main} radius={[4, 4, 0, 0]} />
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
  );
};
