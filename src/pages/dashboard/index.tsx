import { useList, useTranslate } from "@refinedev/core";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import BuildIcon from "@mui/icons-material/Build";

function StatCard({
  icon,
  label,
  value,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  loading?: boolean;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}
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

export const Dashboard = () => {
  const t = useTranslate();

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

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={<PeopleIcon sx={{ fontSize: 40, color: "primary.main" }} />}
          label={t("users.titles.list", "Users")}
          value={usersData?.total ?? usersData?.data?.length ?? 0}
          loading={usersLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={
            <DirectionsCarIcon sx={{ fontSize: 40, color: "success.main" }} />
          }
          label={t("cars.titles.basic_info", "Cars")}
          value={carsData?.total ?? carsData?.data?.length ?? 0}
          loading={carsLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={
            <ReceiptLongIcon sx={{ fontSize: 40, color: "warning.main" }} />
          }
          label={t("rentals.titles.list", "Rentals")}
          value={rentalsData?.total ?? rentalsData?.data?.length ?? 0}
          loading={rentalsLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={<BuildIcon sx={{ fontSize: 40, color: "error.main" }} />}
          label={t("cars.damages.titles.list", "Damages")}
          value={damagesData?.total ?? damagesData?.data?.length ?? 0}
          loading={damagesLoading}
        />
      </Grid>
    </Grid>
  );
};
