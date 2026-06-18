import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useController, useFormContext } from "react-hook-form";
import { useTranslate } from "@refinedev/core";

interface Tier {
  days: number;
  discount: number;
}

const tiersToRecord = (tiers: Tier[]): Record<string, number> => {
  const result: Record<string, number> = {};
  tiers.forEach((t) => {
    result[String(t.days)] = t.discount;
  });
  return result;
};

const recordToTiers = (
  record: Record<string, number> | undefined | null,
): Tier[] => {
  if (!record) return [];
  return Object.entries(record)
    .map(([days, discount]) => ({ days: Number(days), discount: Number(discount) }))
    .sort((a, b) => a.days - b.days);
};

export const DiscountTiersEditor = () => {
  const t = useTranslate();
  const { control } = useFormContext();

  const { field } = useController({
    name: "discount_tiers",
    control,
    defaultValue: {},
  });

  const [tiers, setTiers] = useState<Tier[]>([]);
  const [newDays, setNewDays] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [error, setError] = useState("");
  const hasInitialized = useRef(false);

  // Sync form field → local tiers (handles edit mode where reset() fires after mount)
  useEffect(() => {
    if (hasInitialized.current) return;
    if (field.value && Object.keys(field.value).length > 0) {
      hasInitialized.current = true;
      setTiers((prev) => {
        const next = recordToTiers(field.value);
        if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
        return next;
      });
    }
  }, [field.value]);

  // Sync local tiers → form field
  useEffect(() => {
    field.onChange(tiersToRecord(tiers));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiers]);

  const handleAdd = () => {
    const days = parseInt(newDays, 10);
    const discount = parseFloat(newDiscount);

    if (!newDays || isNaN(days) || days <= 0 || !Number.isInteger(days)) {
      setError(t("cars.validation.discount_days", "Укажите целое положительное число дней"));
      return;
    }
    if (!newDiscount || isNaN(discount) || discount <= 0 || discount >= 100) {
      setError(t("cars.validation.discount_percent", "Скидка должна быть от 1 до 99%"));
      return;
    }
    if (tiers.some((tier) => tier.days === days)) {
      setError(
        t("cars.validation.discount_duplicate", `Скидка для ${days} дн. уже добавлена`),
      );
      return;
    }

    hasInitialized.current = true;
    setError("");
    setTiers((prev) =>
      [...prev, { days, discount }].sort((a, b) => a.days - b.days),
    );
    setNewDays("");
    setNewDiscount("");
  };

  const handleRemove = (days: number) => {
    setTiers((prev) => prev.filter((tier) => tier.days !== days));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Grid item xs={12}>
      <Divider sx={{ mb: 2.5 }} />
      <Typography variant="subtitle1" fontWeight="bold" mb={1.5}>
        {t("cars.titles.discounts", "Скидки за длительность аренды")}
      </Typography>

      {tiers.length > 0 ? (
        <Table
          size="small"
          sx={{ mb: 2, "& td, & th": { border: 0 } }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ pl: 0, color: "text.secondary", fontSize: "0.75rem", py: 0.5 }}
              >
                {t("cars.fields.discount_from_days", "Дней от")}
              </TableCell>
              <TableCell
                sx={{ color: "text.secondary", fontSize: "0.75rem", py: 0.5 }}
              >
                {t("cars.fields.discount_percent", "Скидка")}
              </TableCell>
              <TableCell sx={{ py: 0.5 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {tiers.map((tier) => (
              <TableRow
                key={tier.days}
                sx={{ "&:hover": { bgcolor: "action.hover" } }}
              >
                <TableCell sx={{ pl: 0, fontWeight: 500 }}>
                  {tier.days}&nbsp;{t("cars.fields.days_suffix", "дн.")}
                </TableCell>
                <TableCell sx={{ color: "success.main", fontWeight: 600 }}>
                  −{tier.discount}%
                </TableCell>
                <TableCell align="right" sx={{ pr: 0 }}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemove(tier.days)}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography variant="body2" color="text.secondary" mb={1.5}>
          {t("cars.messages.no_discounts", "Нет настроенных скидок")}
        </Typography>
      )}

      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <TextField
          value={newDays}
          onChange={(e) => {
            setNewDays(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          type="number"
          label={t("cars.fields.discount_from_days", "Дней от")}
          size="small"
          inputProps={{ min: 1, max: 365 }}
          sx={{ width: 110 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          value={newDiscount}
          onChange={(e) => {
            setNewDiscount(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          type="number"
          label={t("cars.fields.discount_percent", "Скидка")}
          size="small"
          inputProps={{ min: 1, max: 99, step: 0.5 }}
          sx={{ width: 120 }}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />
        <Button
          variant="outlined"
          size="medium"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ height: 40, whiteSpace: "nowrap" }}
        >
          {t("buttons.add", "Добавить")}
        </Button>
      </Stack>

      {error && (
        <Typography variant="caption" color="error" display="block" mt={0.5}>
          {error}
        </Typography>
      )}
    </Grid>
  );
};
