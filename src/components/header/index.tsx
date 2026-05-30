import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { HamburgerMenu, RefineThemedLayoutHeaderProps } from "@refinedev/mui";
import React, { useContext, useState, useRef } from "react";
import { ColorModeContext } from "../../contexts/color-mode";
import { useTranslation } from "react-i18next";
import { MenuItem, Select, FormControl, Menu, ListItemIcon, Divider } from "@mui/material";

type IUser = {
  id: number;
  name: string;
  email: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutHeaderProps> = ({
  sticky = true,
}) => {
  const { mode, setMode } = useContext(ColorModeContext);
  const { data: user } = useGetIdentity<IUser>();
  const { mutate: logout } = useLogout();
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  return (
    <AppBar position={sticky ? "sticky" : "relative"}>
      <Toolbar>
        <Stack
          direction="row"
          width="100%"
          justifyContent="flex-end"
          alignItems="center"
        >
          <HamburgerMenu />

          <Stack
            direction="row"
            width="100%"
            justifyContent="flex-end"
            alignItems="center"
            gap={2}
          >
            <FormControl size="small" variant="standard">
              <Select
                disableUnderline
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                sx={{ color: "inherit", fontSize: "0.875rem" }}
              >
                <MenuItem value="en">EN</MenuItem>
                <MenuItem value="ru">RU</MenuItem>
              </Select>
            </FormControl>

            <IconButton
              color="inherit"
              onClick={() => {
                setMode();
              }}
            >
              {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>

            {(user?.avatar || user?.name) && (
              <Stack
                ref={avatarRef}
                direction="row"
                gap="16px"
                alignItems="center"
                justifyContent="center"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ cursor: "pointer" }}
              >
                {user?.name && (
                  <Typography
                    sx={{ display: { xs: "none", sm: "inline-block" } }}
                    variant="subtitle2"
                  >
                    {user?.name}
                  </Typography>
                )}
                <Avatar src={user?.avatar} alt={user?.name} sx={{ width: 32, height: 32 }} />
              </Stack>
            )}
          </Stack>
        </Stack>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { minWidth: 180, mt: 0.5, borderRadius: 1.5 } } }}
      >
        <Stack sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {user?.name}
          </Typography>
          {user?.email && (
            <Typography variant="caption" color="text.secondary">
              {user.email}
            </Typography>
          )}
        </Stack>
        <Divider />
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            logout();
          }}
          sx={{ gap: 1.5 }}
        >
          <ListItemIcon sx={{ minWidth: "auto" }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {t("buttons.logout", "Logout")}
        </MenuItem>
      </Menu>
    </AppBar>
  );
};
