import React from "react";
import {
  Typography,
  Stack,
  Grid,
  Chip,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";

export const DetailsTab = ({ record, t }: { record: any; t: any }) => {
  return (
    <Grid container spacing={3}>
      {/* Контакты */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: "100%" }} variant="outlined">
          <Typography variant="h6" mb={2}>
            {t("users.fields.contacts", "Contacts")}
          </Typography>
          <Stack spacing={2}>
            {[
              {
                key: "email",
                label: t("users.fields.email"),
                icon: <EmailOutlinedIcon color="action" />,
                value: record?.email,
              },
              {
                key: "phone",
                label: t("users.fields.phone"),
                icon: <PhoneOutlinedIcon color="action" />,
                value: record?.phone,
              },
            ].map((item) => (
              <Stack
                key={item.key}
                direction="row"
                alignItems="center"
                spacing={2}
              >
                {item.icon}
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="body1">
                    {item.value || t("notAvailable", "N/A")}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Paper>
      </Grid>

      {/* Системные данные */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: "100%" }} variant="outlined">
          <Typography variant="h6" mb={2}>
            {t("users.fields.systemData", "System Data")}
          </Typography>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">
                {t("users.fields.id")}
              </Typography>
              <Typography sx={{ fontFamily: "monospace" }}>
                {record?.id}
              </Typography>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography color="text.secondary">
                {t("users.fields.verified")}
              </Typography>
              {record?.is_verified ? (
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Verified"
                  color="success"
                  size="small"
                />
              ) : (
                <Chip
                  icon={<CancelIcon />}
                  label="Not Verified"
                  color="error"
                  size="small"
                />
              )}
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">
                {t("users.fields.createdAt")}
              </Typography>
              <Typography>
                {record?.created_at
                  ? new Date(record.created_at).toLocaleString()
                  : "-"}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </Grid>

      {/* Комментарий админа */}
      {record?.admin_comment && (
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              bgcolor: "warning.lighter",
              borderColor: "warning.light",
            }}
            variant="outlined"
          >
            <Typography variant="subtitle2" color="warning.dark" gutterBottom>
              {t("users.fields.adminComment")}
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              {record.admin_comment}
            </Typography>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};
