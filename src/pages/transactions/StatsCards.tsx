import { Box, Typography, Grid, Card, CardContent, Avatar, Stack } from "@mui/material";
import {
  TrendingUp,
  AccountBalanceWallet,
  Receipt,
  Payments,
  AttachMoney,
} from "@mui/icons-material";
import { useTranslate } from "@refinedev/core";
import { StatsData } from "./types";

interface StatsCardsProps {
  stats: StatsData | null;
  statsLoading: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(value);

export const StatsCards = ({ stats, statsLoading }: StatsCardsProps) => {
  const t = useTranslate();

  const cards: {
    label: string;
    value: number;
    color: string;
    icon: React.ReactNode;
    textColor?: string;
    format?: (v: number) => string;
  }[] = [
    {
      label: t("transactions.stats.totalRevenue", "Total Revenue"),
      value: stats?.totalRevenue ?? 0,
      color: "primary.main",
      icon: <AttachMoney />,
    },
    {
      label: t("transactions.stats.pendingPayouts", "Pending Payouts"),
      value: stats?.pendingPayouts ?? 0,
      color: "warning.main",
      icon: <Payments />,
      textColor: "warning.main",
    },
    {
      label: t("transactions.stats.systemFees", "System Fees"),
      value: stats?.totalSystemFees ?? 0,
      color: "info.main",
      icon: <Receipt />,
      textColor: "info.main",
    },
    {
      label: t("transactions.stats.platformNetIncome", "Platform Net Income"),
      value: stats?.platformNetIncome ?? 0,
      color: "info.main",
      icon: <AccountBalanceWallet />,
      textColor: "info.main",
    },
    {
      label: t("transactions.stats.totalPenalties", "Total Penalties"),
      value: stats?.totalPenalties ?? 0,
      color: "error.main",
      icon: <Receipt />,
      textColor: "error.main",
    },
    {
      label: t("transactions.stats.totalDeposits", "Deposits in Circulation"),
      value: stats?.totalDeposits ?? 0,
      color: "warning.main",
      icon: <Payments />,
      textColor: "warning.main",
    },
    {
      label: t("transactions.stats.transactionCount", "Transactions"),
      value: stats?.transactionCount ?? 0,
      color: "success.main",
      icon: <TrendingUp />,
      format: (v: number) => v.toLocaleString(),
    },
  ];

  return (
    <Grid container spacing={2.5} mb={4}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.label}>
          <Card elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3 }}>
            <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500} textTransform="uppercase" letterSpacing={0.5}>
                    {card.label}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} mt={0.5} color={card.textColor}>
                    {statsLoading ? "-" : (card.format ? card.format(card.value) : formatCurrency(card.value))}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: card.color, width: 44, height: 44, borderRadius: 2 }}>
                  {card.icon}
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
