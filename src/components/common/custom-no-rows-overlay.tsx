import { Stack, Typography } from "@mui/material";
import { useTranslate } from "@refinedev/core";
import InboxIcon from "@mui/icons-material/Inbox";

export function CustomNoRowsOverlay() {
  const t = useTranslate();
  return (
    <Stack height="100%" alignItems="center" justifyContent="center" spacing={1}>
      <InboxIcon sx={{ fontSize: 40, color: "text.disabled" }} />
      <Typography variant="body2" color="text.secondary">
        {t("messages.no_data", "No data found")}
      </Typography>
    </Stack>
  );
}
