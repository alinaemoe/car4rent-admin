import { useState, useEffect, useMemo } from "react";
import { useTranslate } from "@refinedev/core";
import { List } from "@refinedev/mui";
import { useDataGrid } from "@refinedev/mui";
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import { CustomNoRowsOverlay } from "../../components/common/custom-no-rows-overlay";
import { axiosInstance, API_URL } from "../../utility/axios-instance";
import { PayoutStatus, StatsData } from "./types";
import { payoutStatusLabels } from "./constants";
import { getTransactionColumns } from "./columns";
import { StatsCards } from "./StatsCards";
import { ChartsSection } from "./ChartsSection";
import { FiltersBar } from "./FiltersBar";

export const TransactionList = () => {
  const t = useTranslate();

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
    const filterArr: import("@refinedev/core").CrudFilter[] = [];
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

  const columns = useMemo(
    () => getTransactionColumns(t, updatingId, handlePayoutStatusChange),
    [t, updatingId, handlePayoutStatusChange],
  );

  const monthlyChartData = useMemo(() => {
    if (!stats?.monthlyStats) return [];
    return stats.monthlyStats.map((m) => ({
      month: m.month,
      Revenue: m.revenue,
      Fees: m.fees,
      Payouts: m.payouts,
      Penalties: m.penalties,
    }));
  }, [stats]);

  const pieData = useMemo(() => {
    if (!stats?.payoutStatusCounts) return [];
    return Object.entries(stats.payoutStatusCounts).map(([name, value]) => ({
      name: payoutStatusLabels(t)[name as PayoutStatus] || name,
      value,
    }));
  }, [stats, t]);

  return (
    <List>
      <Typography variant="h5" fontWeight={700} mb={3}>
        {t("transactions.titles.dashboard", "Analytics Dashboard")}
      </Typography>

      <StatsCards stats={stats} statsLoading={statsLoading} />

      <ChartsSection monthlyChartData={monthlyChartData} pieData={pieData} />

      <FiltersBar
        filterPayoutStatus={filterPayoutStatus}
        setFilterPayoutStatus={setFilterPayoutStatus}
        filterType={filterType}
        setFilterType={setFilterType}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
      />

      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        density="comfortable"
        rowHeight={56}
        pageSizeOptions={[10, 25, 50, 100]}
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        sx={{
          "& .MuiDataGrid-cell": { display: "flex", alignItems: "center", overflow: "hidden" },
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
