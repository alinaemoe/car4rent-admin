import { useState, useEffect } from "react";
import { AuthPage } from "@refinedev/mui";
import { Alert, Snackbar } from "@mui/material";

export const Login = () => {
  const [showExpired, setShowExpired] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("session_expired") === "1") {
      setShowExpired(true);
      window.history.replaceState({}, "", "/login");
    }
  }, []);

  return (
    <>
      <AuthPage
        type="login"
        formProps={{}}
      />
      <Snackbar
        open={showExpired}
        autoHideDuration={6000}
        onClose={() => setShowExpired(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="warning" onClose={() => setShowExpired(false)} sx={{ width: "100%" }}>
          Your session has expired. Please log in again.
        </Alert>
      </Snackbar>
    </>
  );
};
