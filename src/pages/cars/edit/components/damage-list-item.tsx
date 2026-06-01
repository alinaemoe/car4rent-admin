import React from "react";
import {
  Box,
  Stack,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BuildIcon from "@mui/icons-material/Build";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";
import EditIcon from "@mui/icons-material/Edit";
import { DAMAGE_TYPES } from "./damage-constants";

interface DamageListItemProps {
  damage: any;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onReposition?: () => void;
  onPay: () => void;
  onDelete: () => void;
  t: (key: string, fallback?: string) => string;
}

export function DamageListItem({
  damage,
  isSelected,
  onSelect,
  onEdit,
  onReposition,
  onPay,
  onDelete,
  t,
}: DamageListItemProps) {
  const hasCoords =
    damage.coord_x != null && damage.coord_y != null && damage.coord_z != null;
  const typeColor =
    DAMAGE_TYPES.find((dt) => dt.value === damage.type)?.color || "grey.700";

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        cursor: "pointer",
        transition: "all 0.15s ease",
        borderColor: isSelected ? "primary.main" : "divider",
        borderWidth: isSelected ? 2 : 1,
        bgcolor: isSelected ? "action.selected" : "background.paper",
        "&:hover": {
          borderColor: isSelected ? "primary.main" : "action.hover",
          bgcolor: isSelected ? "action.selected" : "action.hover",
        },
      }}
      onClick={onSelect}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Avatar
          src={damage.image_url}
          variant="rounded"
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            bgcolor: typeColor,
          }}
        >
          <BuildIcon sx={{ fontSize: 18 }} />
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            flexWrap="wrap"
            gap={0.5}
          >
            <Typography variant="body2" fontWeight="bold">
              {t(
                "cars.damages.enums.types." + damage.type,
                damage.type || "OTHER",
              )}
            </Typography>
            <Chip
              label={
                damage.is_paid
                  ? t("cars.damages.status.paid", "Paid")
                  : t("cars.damages.status.unpaid", "Unpaid")
              }
              color={damage.is_paid ? "success" : "error"}
              size="small"
              variant={damage.is_paid ? "filled" : "outlined"}
              sx={{
                height: 20,
                "& .MuiChip-label": { fontSize: "0.65rem", px: 0.5 },
              }}
            />
            {hasCoords && (
              <Tooltip
                title={
                  "X: " +
                  damage.coord_x +
                  ", Y: " +
                  damage.coord_y +
                  ", Z: " +
                  damage.coord_z
                }
              >
                <ThreeDRotationIcon
                  sx={{ fontSize: 14, color: "primary.main", flexShrink: 0 }}
                />
              </Tooltip>
            )}
          </Stack>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 0.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {damage.description || "\u2014"}
          </Typography>

          <Typography variant="caption" fontWeight="bold" color="text.primary">
            {"$" + Number(damage.repair_cost).toFixed(2)}
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
          <Tooltip title={t("cars.damages.actions.edit", "Edit")}>
            <IconButton
              color="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {onReposition && (
            <Tooltip title={t("cars.damages.actions.reposition", "Reposition on 3D")}>
              <IconButton
                color="info"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onReposition();
                }}
              >
                <ThreeDRotationIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {!damage.is_paid && (
            <Tooltip title={t("cars.damages.actions.markPaid", "Pay")}>
              <IconButton
                color="success"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onPay();
                }}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={t("cars.damages.actions.delete", "Delete")}>
            <IconButton
              color="error"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}
