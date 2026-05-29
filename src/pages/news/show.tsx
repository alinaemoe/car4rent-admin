import React from "react";
import { useShow } from "@refinedev/core";
import { Show, EditButton, DeleteButton, DateField } from "@refinedev/mui";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardMedia,
  Chip,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTranslate } from "@refinedev/core";
import {
  FormLanguageProvider,
  useFormLanguage,
} from "../../contexts/form-language";
import { LanguageTabs } from "../../components/form/language-tabs";

const NewsShowInner = () => {
  const t = useTranslate();
  const { activeLang } = useFormLanguage();

  const { query } = useShow() as any;
  const { data, isLoading } = query;
  const record = data?.data as any;

  if (!record) return null;

  const title = record.title?.[activeLang] || record.title?.en || "---";
  const text = record.text?.[activeLang] || record.text?.en || "---";
  const badge = record.badge?.[activeLang] || record.badge?.en || "---";

  return (
    <Show
      isLoading={isLoading}
      title={t("news.titles.show", "News Details")}
      headerProps={{
        action: (
          <Stack direction="row" spacing={1}>
            <EditButton size="small" recordItemId={record.id} />
            <DeleteButton
              size="small"
              recordItemId={record.id}
              confirmTitle={t("news.messages.deleteConfirm", "Delete this news?")}
              confirmOkText={t("buttons.delete", "Delete")}
              confirmCancelText={t("buttons.cancel", "Cancel")}
            />
          </Stack>
        ),
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          {t("news.sections.preview", "Preview")}
        </Typography>
        <LanguageTabs />
      </Stack>

      <Stack spacing={3}>
        {record.image_url && (
          <Card>
            <CardMedia
              component="img"
              height={300}
              image={record.image_url}
              alt={title}
              sx={{ objectFit: "cover" }}
            />
          </Card>
        )}

        <Box>
          <Typography variant="caption" color="text.secondary">
            {t("news.fields.title", "Title")}
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            {title}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            {t("news.fields.badge", "Badge")}
          </Typography>
          <Box>
            <Chip label={badge} color="primary" size="small" />
          </Box>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            {t("news.fields.text", "Text")}
          </Typography>
          <Typography
            variant="body1"
            sx={{ whiteSpace: "pre-wrap", mt: 1 }}
          >
            {text}
          </Typography>
        </Box>

        <Divider />

        <Stack direction="row" spacing={4}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {t("news.fields.is_active", "Active")}
            </Typography>
            <Box>
              {record.is_active ? (
                <CheckCircleIcon color="success" fontSize="small" />
              ) : (
                <CancelIcon color="disabled" fontSize="small" />
              )}
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              {t("news.fields.id", "ID")}
            </Typography>
            <Typography variant="body2">#{record.id}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              {t("news.fields.created_at", "Created At")}
            </Typography>
            <Typography variant="body2">
              <DateField value={record.created_at} format="LLL" />
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Show>
  );
};

export const NewsShow = () => {
  return (
    <FormLanguageProvider>
      <NewsShowInner />
    </FormLanguageProvider>
  );
};
