import React, { useMemo, useState } from "react";
import { List } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Avatar,
  Chip,
  Stack,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  useMediaQuery,
  Theme,
  Alert,
} from "@mui/material";
import {
  useTranslate,
  useList,
  useCustomMutation,
  useInvalidate,
} from "@refinedev/core";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import BuildIcon from "@mui/icons-material/Build";
import AddIcon from "@mui/icons-material/Add";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";

import { CenteredCell } from "../../components/common/centered-cell";
import { CustomNoRowsOverlay } from "../../components/common/custom-no-rows-overlay";
import { API_URL, axiosInstance } from "../../utility/axios-instance";
import { FILTER_STATUS } from "./components/damage-constants";
import { AddDamageDialog } from "./components/damage-add-dialog";

export const CarDamageList = () => {
  const t = useTranslate();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const { mutate: markPaid } = useCustomMutation();
  const invalidate = useInvalidate();

  const { result, query } = useList({
    resource: "car-damages",
    pagination: {
      currentPage: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
    },
    filters: [
      ...(filterStatus === "paid"
        ? [{ field: "is_paid", operator: "eq" as const, value: true }]
        : []),
      ...(filterStatus === "unpaid"
        ? [{ field: "is_paid", operator: "eq" as const, value: false }]
        : []),
    ],
    sorters: [{ field: "created_at", order: "desc" }],
  }) as any;

  const rows = result?.data || [];
  const total = result?.total || 0;
  const isLoading = query?.isLoading;
  const isError = query?.isError;
  const refetchList = query?.refetch;

  const columns = useMemo<GridColDef[]>(() => {
    const handleDelete = async (id: number) => {
      if (
        !window.confirm(
          t("cars.damages.messages.deleteConfirm", "Delete this damage record?"),
        )
      )
        return;
      try {
        await axiosInstance.delete(`/car-damages/${id}`);
        invalidate({ resource: "car-damages", invalidates: ["list"] });
      } catch (e) {
        console.error(e);
      }
    };

    const handlePay = (id: number) => {
      markPaid(
        {
          url: `${API_URL}/car-damages/${id}/pay`,
          method: "patch",
          values: {},
          successNotification: () => ({
            message: t("cars.damages.messages.paid", "Marked as paid"),
            type: "success",
          }),
        },
        {
          onSuccess: () =>
            invalidate({ resource: "car-damages", invalidates: ["list"] }),
        },
      );
    };
    const baseColumns: GridColDef[] = [
      {
        field: "id",
        headerName: t("table.id", "ID"),
        width: 70,
        renderCell: ({ value }) => <CenteredCell>#{value}</CenteredCell>,
      },
      {
        field: "image_url",
        headerName: t("cars.damages.fields.photo", "Photo"),
        width: 80,
        renderCell: ({ value }) => (
          <CenteredCell>
            <Avatar
              src={value}
              variant="rounded"
              sx={{ width: 50, height: 50 }}
            >
              <BuildIcon />
            </Avatar>
          </CenteredCell>
        ),
      },
      {
        field: "car",
        headerName: t("cars.damages.fields.car", "Car"),
        width: 160,
        renderCell: ({ row }) => {
          if (!row.car) return <CenteredCell>—</CenteredCell>;
          return (
            <CenteredCell>
              <Typography
                variant="body2"
                noWrap
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 140,
                }}
              >
                {row.car.brand} {row.car.model}
              </Typography>
            </CenteredCell>
          );
        },
        valueGetter: (_value, row) =>
          row.car ? `${row.car.brand} ${row.car.model}` : "",
      },
      {
        field: "type",
        headerName: t("cars.damages.fields.type", "Type"),
        width: 130,
        renderCell: ({ value }) => (
          <CenteredCell>
            {value ? t(`cars.damages.enums.types.${value}`, value) : "—"}
          </CenteredCell>
        ),
      },
      {
        field: "description",
        headerName: t("cars.damages.fields.description", "Description"),
        flex: 1,
        minWidth: 150,
        renderCell: ({ value }) => (
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {value || "—"}
          </Typography>
        ),
      },
      {
        field: "repair_cost",
        headerName: t("cars.damages.fields.repairCost", "Repair Cost"),
        width: 120,
        renderCell: ({ value }) => (
          <CenteredCell>
            <Typography fontWeight="bold">
              ${Number(value).toFixed(2)}
            </Typography>
          </CenteredCell>
        ),
      },
      {
        field: "is_paid",
        headerName: t("cars.damages.fields.status", "Status"),
        width: 110,
        renderCell: ({ value }) => (
          <CenteredCell>
            <Chip
              label={
                value
                  ? t("cars.damages.status.paid", "Paid")
                  : t("cars.damages.status.unpaid", "Unpaid")
              }
              color={value ? "success" : "error"}
              size="small"
              variant={value ? "filled" : "outlined"}
            />
          </CenteredCell>
        ),
      },
      {
        field: "coord",
        headerName: t("cars.damages.fields.coords", "3D Position"),
        width: 130,
        renderCell: ({ row }) => {
          const hasCoords =
            row.coord_x != null && row.coord_y != null && row.coord_z != null;
          return (
            <CenteredCell>
              {hasCoords ? (
                <Tooltip
                  title={`X: ${row.coord_x}, Y: ${row.coord_y}, Z: ${row.coord_z}`}
                >
                  <ThreeDRotationIcon
                    sx={{
                      fontSize: 20,
                      color: "primary.main",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              ) : (
                <Typography variant="caption" color="text.disabled">
                  —
                </Typography>
              )}
            </CenteredCell>
          );
        },
      },
      {
        field: "actions",
        headerName: t("cars.damages.fields.actions", "Actions"),
        width: 120,
        sortable: false,
        renderCell: ({ row }) => (
          <CenteredCell spacing={1}>
            {!row.is_paid && (
              <Tooltip
                title={t("cars.damages.actions.markPaid", "Mark as Paid")}
              >
                <IconButton
                  color="success"
                  size="small"
                  onClick={() => handlePay(row.id)}
                >
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={t("cars.damages.actions.delete", "Delete")}>
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDelete(row.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </CenteredCell>
        ),
      },
      {
        field: "created_at",
        headerName: t("cars.damages.fields.createdAt", "Created At"),
        width: 140,
        renderCell: ({ value }) => (
          <CenteredCell>
            <Typography variant="caption" color="text.secondary">
              {value ? new Date(value).toLocaleDateString() : "—"}
            </Typography>
          </CenteredCell>
        ),
      },
    ];

    return baseColumns;
  }, [t, markPaid, invalidate]);

  return (
    <List>
      <Box sx={{ width: "100%" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={1}
          mb={2}
        >
          <Stack direction="row" spacing={1}>
            {FILTER_STATUS.map((s) => (
              <Chip
                key={s}
                label={t(
                  `cars.damages.filters.${s}`,
                  s.charAt(0).toUpperCase() + s.slice(1),
                )}
                color={filterStatus === s ? "primary" : "default"}
                variant={filterStatus === s ? "filled" : "outlined"}
                size="small"
                onClick={() => setFilterStatus(s)}
              />
            ))}
          </Stack>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            onClick={() => setIsModalOpen(true)}
          >
            {t("cars.damages.actions.add", "Add Damage")}
          </Button>
        </Stack>

        <Box sx={{ height: 600, width: "100%" }}>
          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {t("messages.loading_error", "Failed to load data")}
            </Alert>
          )}
          <DataGrid
            rows={rows}
            columns={columns}
            rowCount={total}
            loading={isLoading}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50, 100]}
            rowHeight={70}
            slots={{ noRowsOverlay: CustomNoRowsOverlay }}
            columnVisibilityModel={{
              id: !isMobile,
              repair_cost: !isMobile,
              coord: !isMobile,
              created_at: !isMobile,
            }}
            sx={{
              border: "none",
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid",
                borderColor: "divider",
                whiteSpace: "normal",
                lineHeight: "1.3em",
                py: 1,
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
              },
            }}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>

      <AddDamageDialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refetchList={refetchList}
      />
    </List>
  );
};
