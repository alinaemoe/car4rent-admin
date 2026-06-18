import React, { useState } from "react";
import {
  useList,
  useTranslate,
  useCustomMutation,
  useInvalidate,
} from "@refinedev/core";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { API_URL } from "../../../utility/axios-instance";
import { DocumentPreviewDialog } from "../../../components/documents/document-preview-dialog";

interface DocumentsTabProps {
  userId: string | number;
}

export const DocumentsTab = ({ userId }: DocumentsTabProps) => {
  const t = useTranslate();
  const invalidate = useInvalidate();
  const theme = useTheme();

  const [previewDoc, setPreviewDoc] = useState<any>(null);

  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    docId: number | null;
  }>({
    open: false,
    docId: null,
  });
  const [rejectReason, setRejectReason] = useState("");

  const { result, isLoading } = useList({
    resource: "documents",
    filters: [
      {
        field: "userId",
        operator: "eq",
        value: userId,
      },
    ],
  }) as any;

  const { mutate: mutateStatus, mutation } = useCustomMutation();
  const isPending = mutation.isPending;

  const handleVerify = (id: number) => {
    mutateStatus(
      {
        url: `${API_URL}/documents/${id}/verify`,
        method: "patch",
        values: {},
        successNotification: () => ({
          message: "Документ подтвержден",
          type: "success",
        }),
      },
      {
        onSuccess: () => {
          invalidate({ resource: "documents", invalidates: ["list"] });
          invalidate({ resource: "users", invalidates: ["detail"] });
        },
      },
    );
  };

  const handleRejectSubmit = () => {
    if (!rejectDialog.docId || !rejectReason) return;

    mutateStatus(
      {
        url: `${API_URL}/documents/${rejectDialog.docId}/reject`,
        method: "patch",
        values: { reason: rejectReason },
        successNotification: () => ({
          message: "Документ отклонен",
          type: "success",
        }),
      },
      {
        onSuccess: () => {
          setRejectDialog({ open: false, docId: null });
          setRejectReason("");
          invalidate({ resource: "documents", invalidates: ["list"] });
          invalidate({ resource: "users", invalidates: ["detail"] });
        },
      },
    );
  };

  const documents = result?.data || [];

  if (isLoading)
    return (
      <Box p={3} textAlign="center">
        <CircularProgress />
      </Box>
    );

  if (documents.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
        <Typography variant="h6">{t("documents.messages.no_documents", "No documents uploaded")}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {documents.map((doc: any) => (
          <Grid item xs={12} sm={6} md={4} key={doc.id}>
            <Card
              variant="outlined"
              sx={{
                position: "relative",
                transition: "box-shadow 0.25s, transform 0.25s",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box sx={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}>
                <StatusChip status={doc.status} t={t} />
              </Box>

              <CardMedia
                component="img"
                height="200"
                image={
                  doc.image_url || "https://placehold.co/600x400?text=No+Image"
                }
                alt="Document"
                sx={{
                  objectFit: "cover",
                  bgcolor: "background.default",
                  cursor: "pointer",
                }}
                onClick={() => setPreviewDoc(doc)}
              />

              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {t(`documents.type.${doc.type}`)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  № {doc.document_number || "—"}
                </Typography>

                {doc.status === "REJECTED" && doc.rejection_reason && (
                  <Box
                    mt={1.5}
                    p={1.5}
                    sx={{
                      bgcolor: alpha(theme.palette.error.main, 0.08),
                      color: "error.main",
                      borderRadius: 1.5,
                      border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                    }}
                  >
                    <Typography variant="caption" fontWeight={700}>
                      Причина отказа:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.25 }}>
                      {doc.rejection_reason}
                    </Typography>
                  </Box>
                )}
              </CardContent>

              {doc.status === "PENDING" && (
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleVerify(doc.id)}
                    disabled={isPending}
                    sx={{ fontWeight: 600 }}
                  >
                    {t("documents.actions.verify")}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() =>
                      setRejectDialog({ open: true, docId: doc.id })
                    }
                    disabled={isPending}
                    sx={{ fontWeight: 600 }}
                  >
                    {t("documents.actions.reject")}
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={rejectDialog.open}
        onClose={() => setRejectDialog({ open: false, docId: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontWeight={700}>{t("documents.actions.reject")}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t("documents.actions.rejectReason")}
            fullWidth
            variant="outlined"
            multiline
            minRows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setRejectDialog({ open: false, docId: null })}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRejectSubmit}
            color="error"
            variant="contained"
            disabled={!rejectReason}
          >
            Confirm Reject
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
    </Box>
  );
};

const STATUS_CONFIG = {
  VERIFIED: { color: "success" as const, icon: CheckCircleIcon },
  REJECTED: { color: "error" as const, icon: CancelIcon },
  PENDING: { color: "warning" as const, icon: AccessTimeIcon },
};

const StatusChip = ({ status, t }: { status: string; t: any }) => {
  const theme = useTheme();
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.PENDING;
  const Icon = config.icon;
  const paletteColor = theme.palette[config.color];

  return (
    <Chip
      label={t(`documents.status.${status}`)}
      icon={<Icon sx={{ fontSize: 16, color: `${paletteColor.main} !important` }} />}
      size="small"
      sx={{
        fontWeight: 700,
        fontSize: "0.75rem",
        bgcolor: alpha(paletteColor.main, 0.85),
        color: paletteColor.contrastText,
        backdropFilter: "blur(6px)",
        border: `1px solid ${alpha(paletteColor.main, 0.4)}`,
      }}
    />
  );
};
