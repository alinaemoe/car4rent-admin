import { Paper, Grid, FormControl, InputLabel, Select, MenuItem, TextField, Button, Chip } from "@mui/material";
import { useTranslate } from "@refinedev/core";
import { PayoutStatus, TransactionType } from "./types";
import { payoutStatusColors, payoutStatusLabels, typeLabels } from "./constants";

interface FiltersBarProps {
  filterPayoutStatus: string;
  setFilterPayoutStatus: (v: string) => void;
  filterType: string;
  setFilterType: (v: string) => void;
  fromDate: string;
  setFromDate: (v: string) => void;
  toDate: string;
  setToDate: (v: string) => void;
}

export const FiltersBar = ({
  filterPayoutStatus,
  setFilterPayoutStatus,
  filterType,
  setFilterType,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
}: FiltersBarProps) => {
  const t = useTranslate();

  return (
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
  );
};
