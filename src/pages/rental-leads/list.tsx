import React, { useMemo, useState } from "react";
import { List, DateField } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Typography,
  Box,
  Stack,
  Chip,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  useMediaQuery,
  Theme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PhoneIcon from "@mui/icons-material/Phone";
import { useTranslate, useList } from "@refinedev/core";
import { CenteredCell } from "../../components/common/centered-cell";
import { CustomNoRowsOverlay } from "../../components/common/custom-no-rows-overlay";
import { axiosInstance } from "../../utility/axios-instance";
import { API_URL } from "../../utility/axios-instance";

interface RentalLeadRow {
  id: number;
  name: string;
  phone: string;
  car: { id: number; brand: string; model: string } | null;
  start_date: string | null;
  end_date: string | null;
  comment: string | null;
  status: "NEW" | "PROCESSED" | "REJECTED";
  created_at: string;
}

const statusConfig: Record<
  string,
  { label: string; color: "default" | "primary" | "success" | "error" | "warning" | "info" }
> = {
  NEW: { label: "New", color: "info" },
  PROCESSED: { label: "Processed", color: "success" },
  REJECTED: { label: "Rejected", color: "error" },
};

const StatusCell = ({
  value,
  row,
  onStatusChange,
}: {
  value: string;
  row: RentalLeadRow;
  onStatusChange: (id: number, status: string) => void;
}) => {
  const cfg = statusConfig[value] || { label: value, color: "default" };
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ height: "100%" }}>
      <Select
        size="small"
        value={value}
        onChange={(e) => onStatusChange(row.id, e.target.value)}
        variant="outlined"
        sx={{
          minWidth: 130,
          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
        }}
        renderValue={(v) => (
          <Chip
            label={statusConfig[v]?.label || v}
            color={statusConfig[v]?.color || "default"}
            size="small"
          />
        )}
      >
        <MenuItem value="NEW">
          <Chip label="New" color="info" size="small" />
        </MenuItem>
        <MenuItem value="PROCESSED">
          <Chip label="Processed" color="success" size="small" />
        </MenuItem>
        <MenuItem value="REJECTED">
          <Chip label="Rejected" color="error" size="small" />
        </MenuItem>
      </Select>
    </Stack>
  );
};

export const RentalLeadList = () => {
  const t = useTranslate();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [snackMessage, setSnackMessage] = useState<string | null>(null);

  const { result, isLoading } = useList<RentalLeadRow>({
    resource: "rental-leads",
    pagination: { mode: "off" },
    sorters: [{ field: "created_at", order: "desc" }],
  }) as any;

  const [leads, setLeads] = useState<RentalLeadRow[]>([]);

  useMemo(() => {
    setLeads(result?.data || []);
  }, [result?.data]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      await axiosInstance.patch(`${API_URL}/rental-leads/${id}/status`, {
        status: newStatus,
      });
      setLeads((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status: newStatus as RentalLeadRow["status"] } : l,
        ),
      );
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = useMemo<GridColDef<RentalLeadRow>[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        minWidth: 60,
        flex: 0.3,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => <CenteredCell>#{value}</CenteredCell>,
      },
      {
        field: "name",
        headerName: t("rental_leads.fields.name", "Name"),
        minWidth: 150,
        flex: 1,
        renderCell: ({ value, row }) => (
          <Stack justifyContent="center" sx={{ height: "100%", py: 0.5 }}>
            <Typography variant="body2" fontWeight={600} noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {value}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <PhoneIcon sx={{ fontSize: 12, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary" noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                {row.phone}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
      {
        field: "car",
        headerName: t("rental_leads.fields.car", "Car"),
        minWidth: 160,
        renderCell: ({ value }) => (
          <Stack justifyContent="center" sx={{ height: "100%", py: 0.5 }}>
            {value ? (
              <>
                <Typography variant="body2" fontWeight={600} noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: 140 }}>
                  {value.brand} {value.model}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {value.id}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.disabled">
                {t("rental_leads.notSpecified", "Not specified")}
              </Typography>
            )}
          </Stack>
        ),
      },
      {
        field: "start_date",
        headerName: t("rental_leads.fields.start_date", "Start Date"),
        minWidth: 120,
        renderCell: ({ value }) => (
          <CenteredCell>
            {value ? (
              <DateField value={value} format="MMM DD, YYYY" />
            ) : (
              <Typography variant="body2" color="text.disabled">
                —
              </Typography>
            )}
          </CenteredCell>
        ),
      },
      {
        field: "end_date",
        headerName: t("rental_leads.fields.end_date", "End Date"),
        minWidth: 120,
        renderCell: ({ value }) => (
          <CenteredCell>
            {value ? (
              <DateField value={value} format="MMM DD, YYYY" />
            ) : (
              <Typography variant="body2" color="text.disabled">
                —
              </Typography>
            )}
          </CenteredCell>
        ),
      },
      {
        field: "comment",
        headerName: t("rental_leads.fields.comment", "Comment"),
        minWidth: 200,
        flex: 1,
        renderCell: ({ value }) => (
          <Stack justifyContent="center" sx={{ height: "100%", py: 0.5 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {value || "—"}
            </Typography>
          </Stack>
        ),
      },
      {
        field: "status",
        headerName: t("rental_leads.fields.status", "Status"),
        minWidth: 150,
        sortable: true,
        renderCell: ({ value, row }) => (
          <StatusCell
            value={value}
            row={row}
            onStatusChange={handleStatusChange}
          />
        ),
      },
      {
        field: "created_at",
        headerName: t("rental_leads.fields.created_at", "Created At"),
        minWidth: 160,
        renderCell: ({ value }) => (
          <CenteredCell>
            <DateField value={value} format="LLL" />
          </CenteredCell>
        ),
      },
      {
        field: "actions",
        headerName: t("table.actions", "Actions"),
        sortable: false,
        minWidth: 100,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <CenteredCell spacing={0.5}>
            {row.status === "NEW" && (
              <>
                <Tooltip title={t("rental_leads.process", "Process")}>
                  <IconButton
                    size="small"
                    color="success"
                    disabled={updatingId === row.id}
                    onClick={() => handleStatusChange(row.id, "PROCESSED")}
                  >
                    <CheckCircleIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t("rental_leads.reject", "Reject")}>
                  <IconButton
                    size="small"
                    color="error"
                    disabled={updatingId === row.id}
                    onClick={() => handleStatusChange(row.id, "REJECTED")}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {row.status === "PROCESSED" && (
              <Chip
                label={t("rental_leads.processed", "Processed")}
                color="success"
                size="small"
                variant="outlined"
              />
            )}
            {row.status === "REJECTED" && (
              <Chip
                label={t("rental_leads.rejected", "Rejected")}
                color="error"
                size="small"
                variant="outlined"
              />
            )}
          </CenteredCell>
        ),
      },
    ],
    [t, updatingId],
  );

  return (
    <List title={t("rental_leads.titles.list", "Rental Leads")}>
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            icon={<CheckCircleIcon />}
            label={`${t("rental_leads.fields.status", "Status")}: ${t("rental_leads.new", "New")}`}
            color="info"
            variant="outlined"
            size="small"
          />
          <Typography variant="caption" color="text.secondary">
            {t(
              "rental_leads.hint",
              "Click the status chip to change, or use the action buttons",
            )}
          </Typography>
        </Stack>
      </Box>

      <DataGrid
        rows={leads}
        columns={columns}
        autoHeight
        density="comfortable"
        loading={isLoading}
        hideFooter
        columnVisibilityModel={{
          created_at: !isMobile,
          comment: !isMobile,
          end_date: !isMobile,
        }}
        getRowHeight={() => 72}
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        sx={{
          border: "none",
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid",
            borderColor: "divider",
            py: 0.5,
          },
        }}
        disableRowSelectionOnClick
      />
    </List>
  );
};
