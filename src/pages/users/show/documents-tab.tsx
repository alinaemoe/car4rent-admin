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
  const invalidate = useInvalidate(); // Чтобы обновить список после действий

  // Состояние для предпросмотра документа
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  // Состояние для модалки отказа
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    docId: number | null;
  }>({
    open: false,
    docId: null,
  });
  const [rejectReason, setRejectReason] = useState("");

  // 1. Получаем список документов
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

  // 2. Хук для кастомных мутаций (Verify / Reject)
  const { mutate: mutateStatus, mutation } = useCustomMutation();
  const isPending = mutation.isPending;

  const handleVerify = (id: number) => {
    mutateStatus(
      {
        url: `${API_URL}/documents/${id}/verify`,
        method: "patch",
        values: {}, // Пустое тело
        successNotification: () => ({
          message: "Документ подтвержден",
          type: "success",
        }),
      },
      {
        onSuccess: () => {
          invalidate({ resource: "documents", invalidates: ["list"] });
          invalidate({ resource: "users", invalidates: ["detail"] }); // Обновить статус юзера (галочку)
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
        values: { reason: rejectReason }, // Передаем reason в body
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
        <Typography variant="h6">Нет загруженных документов</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {documents.map((doc: any) => (
          <Grid item xs={12} sm={6} md={4} key={doc.id}>
            <Card variant="outlined" sx={{ position: "relative" }}>
              {/* Статус чипсом поверх картинки */}
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
                sx={{ objectFit: "cover", bgcolor: "#f5f5f5", cursor: "pointer" }}
                onClick={() => setPreviewDoc(doc)}
              />

              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t(`documents.type.${doc.type}`)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  № {doc.document_number || "---"}
                </Typography>

                {/* Если отклонен, показываем причину */}
                {doc.status === "REJECTED" && doc.rejection_reason && (
                  <Box
                    mt={1}
                    p={1}
                    bgcolor="error.lighter"
                    color="error.main"
                    borderRadius={1}
                  >
                    <Typography variant="caption" fontWeight="bold">
                      Причина отказа:
                    </Typography>
                    <Typography variant="body2">
                      {doc.rejection_reason}
                    </Typography>
                  </Box>
                )}
              </CardContent>

              {/* Кнопки действий только для PENDING */}
              {doc.status === "PENDING" && (
                <CardActions>
                  <Button
                    size="small"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleVerify(doc.id)}
                    disabled={isPending}
                  >
                    {t("documents.actions.verify")}
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() =>
                      setRejectDialog({ open: true, docId: doc.id })
                    }
                    disabled={isPending}
                  >
                    {t("documents.actions.reject")}
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Диалог отклонения */}
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
            Cancel
          </Button>
          <Button
            onClick={handleRejectSubmit}
            color="error"
            variant="contained"
          >
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог предпросмотра документа */}
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

// Вспомогательный компонент для статуса
const StatusChip = ({ status, t }: { status: string; t: any }) => {
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
      sx={{ bgcolor: "background.paper", fontWeight: "bold" }} // Белый фон для читаемости на фото
    />
  );
};
