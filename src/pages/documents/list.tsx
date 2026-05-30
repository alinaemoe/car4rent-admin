import React, { useMemo, useState } from "react";
import { useDataGrid, List, DateField } from "@refinedev/mui";
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import {
  Avatar,
  Chip,
  Stack,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Tooltip,
  IconButton,
  useMediaQuery,
  Theme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedIcon from "@mui/icons-material/Verified";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  useTranslate,
  useCustomMutation,
  useInvalidate,
  CrudFilters,
} from "@refinedev/core";
import { API_URL } from "../../utility/axios-instance";
import { CenteredCell } from "../../components/common/centered-cell";
import { CustomNoRowsOverlay } from "../../components/common/custom-no-rows-overlay";
import { DocumentPreviewDialog } from "../../components/documents/document-preview-dialog";

interface DocumentRow {
  id: number;
  type: string;
  image_url: string;
  document_number: string;
  status: string;
  rejection_reason: string | null;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
  };
  created_at: string;
}

const StatusChip = ({
  status,
  t,
}: {
  status: string;
  t: (key: string, fallback?: string) => string;
}) => {
  let color: "warning" | "success" | "error" = "warning";
  let icon = <AccessTimeIcon />;

  if (status === "VERIFIED") {
    color = "success";
    icon = <CheckCircleIcon />;
  } else if (status === "REJECTED") {
    color = "error";
    icon = <CancelIcon />;
  }

  return (
    <Chip
      label={t(`documents.status.${status}`)}
      color={color}
      icon={icon}
      size="small"
    />
  );
};

const TypeChip = ({
  type,
  t,
}: {
  type: string;
  t: (key: string, fallback?: string) => string;
}) => {
  const color: "primary" | "secondary" =
    type === "PASSPORT" ? "primary" : "secondary";
  return (
    <Chip
      label={t(`documents.type.${type}`)}
      color={color}
      size="small"
      variant="outlined"
    />
  );
};

const STATUS_OPTIONS = ["PENDING", "VERIFIED", "REJECTED"] as const;
const TYPE_OPTIONS = ["PASSPORT", "DRIVER_LICENSE"] as const;

interface FilterDropdownProps {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  t: (key: string, fallback?: string) => string;
  transPrefix: string;
}

const FilterDropdown = ({
  label,
  value,
  options,
  onChange,
  t,
  transPrefix,
}: FilterDropdownProps) => (
  <FormControl size="small" sx={{ minWidth: 170 }}>
    <InputLabel>{label}</InputLabel>
    <Select
      value={value}
      label={label}
      onChange={(e) => onChange(e.target.value)}
    >
      <MenuItem value="">
        <em>{t("filters.all", "All")}</em>
      </MenuItem>
      {options.map((opt) => (
        <MenuItem key={opt} value={opt}>
          {t(`${transPrefix}.${opt}`, opt)}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

interface BulkToolbarProps {
  selectedIds: GridRowSelectionModel;
  onVerifyAll: () => void;
  isPending: boolean;
  filterStatus: string;
  filterType: string;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  t: (key: string, fallback?: string) => string;
}

const BulkToolbar = ({
  selectedIds,
  onVerifyAll,
  isPending,
  filterStatus,
  filterType,
  onStatusChange,
  onTypeChange,
  t,
}: BulkToolbarProps) => (
  <GridToolbarContainer sx={{ px: 1, py: 0.5, gap: 1, flexWrap: "wrap" }}>
    <FilterListIcon sx={{ color: "text.secondary", mr: 0.5 }} />
    <FilterDropdown
      label={t("documents.fields.status", "Status")}
      value={filterStatus}
      options={STATUS_OPTIONS}
      onChange={onStatusChange}
      t={t}
      transPrefix="documents.status"
    />
    <FilterDropdown
      label={t("documents.fields.type", "Type")}
      value={filterType}
      options={TYPE_OPTIONS}
      onChange={onTypeChange}
      t={t}
      transPrefix="documents.type"
    />
    {selectedIds.length > 0 && (
      <Button
        size="small"
        color="success"
        variant="outlined"
        startIcon={<VerifiedIcon />}
        onClick={onVerifyAll}
        disabled={isPending}
        sx={{ ml: "auto" }}
      >
        {t("documents.actions.verifyAll", "Verify All")} ({selectedIds.length})
      </Button>
    )}
  </GridToolbarContainer>
);

export const DocumentList = () => {
  const t = useTranslate();
  const invalidate = useInvalidate();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );

  const { dataGridProps, filters, setFilters } = useDataGrid<DocumentRow>({
    resource: "documents",
    syncWithLocation: true,
  });

  const currentFilters = (filters as CrudFilters) || [];
  const filterStatus = currentFilters.find(
    (f: any) => f.field === "status",
  )?.value as string | undefined;
  const filterType = currentFilters.find(
    (f: any) => f.field === "type",
  )?.value as string | undefined;

  const handleStatusChange = (value: string) => {
    const other = currentFilters.filter((f: any) => f.field !== "status");
    if (value) {
      setFilters([...other, { field: "status", operator: "eq", value }]);
    } else {
      setFilters(other);
    }
  };

  const handleTypeChange = (value: string) => {
    const other = currentFilters.filter((f: any) => f.field !== "type");
    if (value) {
      setFilters([...other, { field: "type", operator: "eq", value }]);
    } else {
      setFilters(other);
    }
  };

  const [previewDoc, setPreviewDoc] = useState<DocumentRow | null>(null);

  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    docId: number | null;
  }>({ open: false, docId: null });
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const { mutate: mutateStatus, mutation } = useCustomMutation();
  const isPending = mutation.isPending;

  const handleVerify = (id: number) => {
    mutateStatus(
      {
        url: `${API_URL}/documents/${id}/verify`,
        method: "patch",
        values: {},
        successNotification: () => ({
          message: t("notifications.documentVerified", "Document verified"),
          type: "success",
        }),
      },
      {
        onSuccess: () => {
          invalidate({ resource: "documents", invalidates: ["list"] });
        },
      },
    );
  };

  const handleRejectSubmit = () => {
    if (!rejectDialog.docId || !rejectReason.trim()) return;

    mutateStatus(
      {
        url: `${API_URL}/documents/${rejectDialog.docId}/reject`,
        method: "patch",
        values: { reason: rejectReason },
        successNotification: () => ({
          message: t("notifications.documentRejected", "Document rejected"),
          type: "success",
        }),
      },
      {
        onSuccess: () => {
          setRejectDialog({ open: false, docId: null });
          setRejectReason("");
          invalidate({ resource: "documents", invalidates: ["list"] });
        },
      },
    );
  };

  const handleBulkVerify = () => {
    selectedRows.forEach((id) => handleVerify(Number(id)));
  };

  const columns = useMemo<GridColDef<DocumentRow>[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        type: "number",
        minWidth: 60,
        flex: 0.3,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "user",
        headerName: t("documents.fields.user", "User"),
        minWidth: 240,
        flex: 1,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => (
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{
              height: "100%",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <Avatar
              src={row.user?.avatar_url}
              alt={`${row.user?.first_name || ""} ${row.user?.last_name || ""}`}
              // Добавляем flexShrink: 0, чтобы аватарку никогда не сжимало при флекс-лайауте
              sx={{ width: 32, height: 32, flexShrink: 0 }}
            />
            {/* Задаем Box flex: 1 и minWidth: 0. 
              Это критически важно для корректной работы 'noWrap' (ellipsis) в MUI/Flexbox, 
              иначе длинный текст будет распирать ячейку наружу и ломать сетку.
            */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body2"
                fontWeight="bold"
                noWrap
                sx={{ display: "block", lineHeight: "1.2" }}
              >
                {row.user?.first_name || ""} {row.user?.last_name || ""}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ display: "block", lineHeight: "1.2", marginTop: "2px" }}
              >
                {row.user?.email || ""}
              </Typography>
            </Box>
          </Stack>
        ),
      },
      {
        field: "type",
        headerName: t("documents.fields.type", "Type"),
        minWidth: 150,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <CenteredCell>
            <TypeChip type={value} t={t} />
          </CenteredCell>
        ),
      },
      {
        field: "status",
        headerName: t("documents.fields.status", "Status"),
        minWidth: 140,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <CenteredCell>
            <StatusChip status={value} t={t} />
          </CenteredCell>
        ),
      },
      {
        field: "document_number",
        headerName: t("documents.fields.documentNumber", "Document No."),
        minWidth: 140,
        align: "center",
        headerAlign: "center",
        renderCell: ({ value }) => (
          <CenteredCell>
            <Typography variant="body2">{value || "---"}</Typography>
          </CenteredCell>
        ),
      },
      {
        field: "created_at",
        headerName: t("documents.fields.createdAt", "Created At"),
        minWidth: 180,
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
        filterable: false,
        minWidth: 160,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <CenteredCell spacing={0.5}>
            <Tooltip title={t("buttons.view", "View")}>
              <IconButton
                size="small"
                color="info"
                onClick={() => setPreviewDoc(row)}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            {row.status === "PENDING" && (
              <>
                <Tooltip title={t("documents.actions.verify")}>
                  <IconButton
                    size="small"
                    color="success"
                    onClick={() => handleVerify(row.id)}
                    disabled={isPending}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t("documents.actions.reject")}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() =>
                      setRejectDialog({ open: true, docId: row.id })
                    }
                    disabled={isPending}
                  >
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </CenteredCell>
        ),
      },
    ],
    [t, isPending],
  );

  return (
    <>
      <List title={t("documents.titles.list", "Documents")}>
        <DataGrid
          {...dataGridProps}
          columns={columns}
          autoHeight
          density="comfortable"
          checkboxSelection
          onRowSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection);
          }}
          rowSelectionModel={selectedRows}
          columnVisibilityModel={{
            created_at: !isMobile,
            document_number: !isMobile,
          }}
          disableColumnFilter
          slots={{
            toolbar: () => (
              <BulkToolbar
                selectedIds={selectedRows}
                onVerifyAll={handleBulkVerify}
                isPending={isPending}
                filterStatus={filterStatus || ""}
                filterType={filterType || ""}
                onStatusChange={handleStatusChange}
                onTypeChange={handleTypeChange}
                t={t}
              />
            ),
            noRowsOverlay: CustomNoRowsOverlay,
          }}
          sx={{
            "& .MuiDataGrid-cell": {
              py: 0.5,
            },
          }}
          disableRowSelectionOnClick
        />
      </List>

      <Dialog
        open={rejectDialog.open}
        onClose={() => setRejectDialog({ open: false, docId: null })}
      >
        <DialogTitle>{t("documents.actions.reject")}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t("documents.actions.rejectReason")}
            fullWidth
            variant="outlined"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog({ open: false, docId: null })}>
            {t("buttons.cancel", "Cancel")}
          </Button>
          <Button
            onClick={handleRejectSubmit}
            color="error"
            variant="contained"
            disabled={!rejectReason.trim()}
          >
            {t("documents.actions.reject")}
          </Button>
        </DialogActions>
      </Dialog>

      <DocumentPreviewDialog
        open={!!previewDoc}
        doc={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onVerify={(id) => {
          handleVerify(id);
          setPreviewDoc(null);
        }}
        onReject={(id) => {
          setRejectDialog({ open: true, docId: id });
          setPreviewDoc(null);
        }}
        isPending={isPending}
      />
    </>
  );
};
