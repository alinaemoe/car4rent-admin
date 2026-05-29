import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  Avatar,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useTranslate } from "@refinedev/core";
import { DateField } from "@refinedev/mui";

interface DocUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
}

interface DocumentData {
  id: number;
  type: string;
  image_url: string;
  document_number: string;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  user?: DocUser;
}

interface DocumentPreviewDialogProps {
  open: boolean;
  doc: DocumentData | null;
  onClose: () => void;
  onVerify?: (id: number) => void;
  onReject?: (id: number) => void;
  isPending?: boolean;
}

const docStatusChip = (
  status: string,
  t: (key: string, fallback?: string) => string,
) => {
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

export const DocumentPreviewDialog = ({
  open,
  doc,
  onClose,
  onVerify,
  onReject,
  isPending,
}: DocumentPreviewDialogProps) => {
  const t = useTranslate();

  if (!doc) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6">
            {t(`documents.type.${doc.type}`)}
          </Typography>
          {docStatusChip(doc.status, t)}
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
        <Box
          sx={{
            flex: { md: 1 },
            minWidth: { md: 300 },
            maxHeight: 500,
            overflow: "hidden",
            borderRadius: 1,
            bgcolor: "action.hover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={doc.image_url}
            alt={t(`documents.type.${doc.type}`)}
            sx={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </Box>

        <Stack spacing={2} sx={{ minWidth: 220 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {t("documents.fields.documentNumber", "Document No.")}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {doc.document_number || "---"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              {t("documents.fields.createdAt", "Created At")}
            </Typography>
            <Typography variant="body1">
              <DateField value={doc.created_at} format="LLL" />
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              {t("documents.fields.type", "Type")}
            </Typography>
            <Typography variant="body1">
              {t(`documents.type.${doc.type}`)}
            </Typography>
          </Box>

          {doc.user && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t("documents.fields.user", "User")}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                <Avatar
                  src={doc.user.avatar_url}
                  alt={doc.user.first_name}
                  sx={{ width: 28, height: 28 }}
                >
                  {doc.user.first_name?.[0]?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {doc.user.first_name} {doc.user.last_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {doc.user.email}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}

          {doc.status === "REJECTED" && doc.rejection_reason && (
            <Box
              sx={{
                p: 1.5,
                bgcolor: "error.light",
                borderRadius: 1,
                color: "error.contrastText",
              }}
            >
              <Typography variant="caption" fontWeight="bold">
                {t("documents.actions.rejectReason")}:
              </Typography>
              <Typography variant="body2">
                {doc.rejection_reason}
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      {doc.status === "PENDING" && (onVerify || onReject) && (
        <>
          <Divider />
          <DialogActions>
            {onReject && (
              <Button
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => onReject(doc.id)}
                disabled={isPending}
              >
                {t("documents.actions.reject")}
              </Button>
            )}
            {onVerify && (
              <Button
                color="success"
                variant="contained"
                startIcon={<CheckCircleIcon />}
                onClick={() => onVerify(doc.id)}
                disabled={isPending}
              >
                {t("documents.actions.verify")}
              </Button>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
