import React from "react";
import { Stack } from "@mui/material";

interface CenteredCellProps {
  children: React.ReactNode;
  spacing?: number;
}

/**
 * Универсальный контейнер для ячеек DataGrid.
 * Центрирует контент по горизонтали и вертикали.
 */
export const CenteredCell: React.FC<CenteredCellProps> = ({
  children,
  spacing = 0,
}) => (
  <Stack
    direction="row"
    spacing={spacing}
    justifyContent="center"
    alignItems="center"
    width="100%"
    height="100%"
  >
    {children}
  </Stack>
);
