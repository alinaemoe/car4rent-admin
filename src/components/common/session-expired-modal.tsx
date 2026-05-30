import { useState, useEffect, useCallback } from "react";
import { useTranslate } from "@refinedev/core";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const SessionExpiredModal = () => {
  const t = useTranslate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = useCallback(() => setOpen(true), []);

  useEffect(() => {
    const handler = () => handleOpen();
    window.addEventListener("auth:session_expired", handler);
    return () => window.removeEventListener("auth:session_expired", handler);
  }, [handleOpen]);

  const handleRetry = async () => {
    setLoading(true);
    setError("");
    const ok = await (window as any).__retrySession();
    setLoading(false);
    if (ok) {
      setOpen(false);
    } else {
      setError(t("auth.session_refresh_failed", "Failed to refresh session. Please log out and try again."));
    }
  };

  const handleLogout = () => {
    setOpen(false);
    (window as any).__endSession();
  };

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      disableEscapeKeyDown
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, textAlign: "center", py: 2 },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        <ErrorOutlineIcon color="warning" sx={{ fontSize: 56 }} />
      </Box>
      <DialogTitle sx={{ pb: 1 }}>
        {t("auth.session_expired_title", "Session Expired")}
      </DialogTitle>
      <DialogContent sx={{ pb: 2 }}>
        <DialogContentText>
          {t(
            "auth.session_expired_message",
            "Your session has expired. Please refresh it to continue working without losing your data.",
          )}
        </DialogContentText>
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2, px: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRetry}
          disabled={loading}
          sx={{ minWidth: 140 }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            t("auth.refresh_session", "Refresh Session")
          )}
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          {t("auth.logout", "Logout")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
