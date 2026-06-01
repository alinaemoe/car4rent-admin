import React, { useEffect, useState } from "react";
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
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import BuildIcon from "@mui/icons-material/Build";
import SpeedIcon from "@mui/icons-material/Speed";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useTranslate } from "@refinedev/core";
import { useAppSettings } from "../../../../contexts/app-settings";
import { axiosInstance } from "../../../../utility/axios-instance";

interface DictItem {
  id: string;
  label: string;
  hex?: string;
}

interface CarDetailsTabProps {
  record: any;
}

function useDictionaries() {
  const [dicts, setDicts] = useState<Record<string, DictItem[]>>({});

  useEffect(() => {
    const fetchDicts = async () => {
      try {
        const { data } = await axiosInstance.get("/settings");
        const parseKV = (key: string): DictItem[] => {
          const setting = data.find(
            (s: { key: string; value: string }) => s.key === key,
          );
          if (!setting) return [];
          try {
            return JSON.parse(setting.value);
          } catch {
            return [];
          }
        };
        setDicts({
          colors: parseKV("DICT_COLORS"),
          transmissions: parseKV("DICT_TRANSMISSIONS"),
          fuels: parseKV("DICT_FUEL_TYPES"),
          bodies: parseKV("DICT_BODY_TYPES"),
          drives: parseKV("DICT_DRIVE_TYPES"),
        });
      } catch (err) {
        console.error("Failed to load dicts", err);
      }
    };
    fetchDicts();
  }, []);

  return dicts;
}

function lookupLabel(dict: DictItem[] | undefined, value: string | null | undefined): string {
  if (!value || !dict) return value || "—";
  const found = dict.find((d) => d.id === value);
  return found?.label || value;
}

function lookupHex(dict: DictItem[] | undefined, value: string | null | undefined): string | null {
  if (!value || !dict) return null;
  const found = dict.find((d) => d.id === value);
  return found?.hex || null;
}

function InfoRow({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
}) {
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Stack direction="row" alignItems="center" spacing={1} minWidth={0}>
          {icon && (
            <Box sx={{ color: "text.secondary", display: "flex" }}>
              {icon}
            </Box>
          )}
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{ flexShrink: 0 }}
          >
            {label}
          </Typography>
        </Stack>
        <Box
          sx={{
            textAlign: "right",
            color: color || "text.primary",
            fontWeight: color ? "bold" : "normal",
          }}
        >
          {value}
        </Box>
      </Stack>
      <Divider sx={{ my: 1.5 }} />
    </>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        {icon && <Box sx={{ color: "primary.main", display: "flex" }}>{icon}</Box>}
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
      </Stack>
      {children}
    </Paper>
  );
}

function DescriptionBlock({ record, t }: { record: any; t: any }) {
  const { languages, defaultLang } = useAppSettings();
  const [activeLang, setActiveLang] = useState(defaultLang);

  if (!record?.description) return null;

  const hasAny = languages.some(
    (lang) => record.description[lang.code]?.trim(),
  );
  if (!hasAny) return null;

  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {t("cars.fields.description", "Description")}
        </Typography>
        <Stack direction="row" spacing={1}>
          {languages.map((lang) => (
            <Chip
              key={lang.code}
              label={lang.code.toUpperCase()}
              onClick={() => setActiveLang(lang.code)}
              color={activeLang === lang.code ? "primary" : "default"}
              variant={activeLang === lang.code ? "filled" : "outlined"}
              size="small"
              clickable
            />
          ))}
        </Stack>
      </Stack>
      <Typography
        variant="body2"
        sx={{
          whiteSpace: "pre-wrap",
          color: "text.primary",
          fontStyle: record.description[activeLang] ? "normal" : "italic",
        }}
      >
        {record.description[activeLang]?.trim() ||
          t("notAvailable", "Not provided")}
      </Typography>
    </Paper>
  );
}

export const CarDetailsTab = ({ record }: CarDetailsTabProps) => {
  const t = useTranslate();
  const dicts = useDictionaries();

  const colorHex = lookupHex(dicts.colors, record.color);

  return (
    <Grid container spacing={3}>
      {/* CARD 1 - BASIC INFO */}
      <Grid item xs={12} md={6}>
        <SectionCard
          title={t("cars.titles.basic_info", "Basic Information")}
          icon={<BuildIcon />}
        >
          <InfoRow
            label={t("cars.fields.brand", "Brand")}
            value={record.brand || "—"}
          />
          <InfoRow
            label={t("cars.fields.model", "Model")}
            value={record.model || "—"}
          />
          <InfoRow
            label={t("cars.fields.year", "Year")}
            value={record.year || "—"}
          />
          <InfoRow
            label={t("cars.fields.plate", "License Plate")}
            value={record.license_plate || "—"}
          />
          <InfoRow
            label="VIN"
            value={
              <Typography
                variant="body2"
                sx={{ fontFamily: "monospace", fontSize: "0.8125rem" }}
              >
                {record.vin || "—"}
              </Typography>
            }
          />
          <InfoRow
            label={t("cars.fields.color", "Color")}
            value={
              <Stack direction="row" alignItems="center" spacing={1} justifyContent="flex-end">
                {colorHex && (
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      bgcolor: colorHex,
                      border: "1px solid",
                      borderColor: "divider",
                      flexShrink: 0,
                    }}
                  />
                )}
                <Typography variant="body2">
                  {lookupLabel(dicts.colors, record.color)}
                </Typography>
              </Stack>
            }
          />
          <InfoRow
            label={t("cars.fields.body_type", "Body Type")}
            value={lookupLabel(dicts.bodies, record.body_type)}
          />
          <InfoRow
            label={t("cars.fields.status")}
            value={
              <Chip
                label={record.status || "—"}
                color={
                  record.status === "AVAILABLE"
                    ? "success"
                    : record.status === "MAINTENANCE"
                      ? "warning"
                      : record.status === "RENTED"
                        ? "info"
                        : "default"
                }
                size="small"
              />
            }
          />
        </SectionCard>
      </Grid>

      {/* CARD 2 - TECHNICAL SPECS */}
      <Grid item xs={12} md={6}>
        <SectionCard
          title={t("cars.titles.tech_specs", "Technical Specifications")}
          icon={<SpeedIcon />}
        >
          <InfoRow
            label={t("cars.fields.transmission", "Transmission")}
            value={lookupLabel(dicts.transmissions, record.transmission)}
          />
          <InfoRow
            label={t("cars.fields.drive_type", "Drive Type")}
            value={lookupLabel(dicts.drives, record.drive_type)}
          />
          <InfoRow
            label={t("cars.fields.fuel", "Fuel Type")}
            value={lookupLabel(dicts.fuels, record.fuel_type)}
          />
          <InfoRow
            label={t("cars.fields.horsepower", "Horsepower")}
            value={
              record.horsepower != null
                ? `${record.horsepower} HP`
                : "—"
            }
          />
          <InfoRow
            label={t("cars.fields.fuel_consumption", "Fuel Consumption")}
            value={
              record.fuel_consumption != null
                ? `${record.fuel_consumption} L/100km`
                : "—"
            }
          />
          <InfoRow
            label={t("cars.fields.mileage", "Current Mileage")}
            value={
              record.current_mileage != null
                ? `${Number(record.current_mileage).toLocaleString()} km`
                : "—"
            }
          />
        </SectionCard>
      </Grid>

      {/* CARD 3 - PRICING & CONDITIONS */}
      <Grid item xs={12} md={6}>
        <SectionCard
          title={t("cars.titles.pricing", "Pricing & Conditions")}
          icon={<AttachMoneyIcon />}
        >
          <InfoRow
            label={t("cars.fields.price", "Price / Day")}
            value={
              record.price_per_day != null
                ? `Br ${Number(record.price_per_day).toFixed(2)}`
                : "—"
            }
          />
          <InfoRow
            label={t("cars.fields.deposit", "Deposit")}
            value={
              record.deposit_amount != null
                ? `Br ${Number(record.deposit_amount).toFixed(2)}`
                : "—"
            }
          />
          <InfoRow
            label={t("cars.fields.insurance", "Insurance")}
            value={record.insurance_type || "—"}
          />
          <InfoRow
            label={t("cars.fields.limit", "Mileage Limit")}
            value={
              record.mileage_limit_per_day != null
                ? `${record.mileage_limit_per_day} km/day`
                : "—"
            }
          />
          <InfoRow
            label={t("cars.fields.overlimit", "Over Limit Fee")}
            value={
              record.price_per_km_over_limit != null
                ? `Br ${Number(record.price_per_km_over_limit).toFixed(2)} / km`
                : "—"
            }
          />
          <InfoRow
            label={t("cars.fields.min_age", "Min Age")}
            value={
              record.min_age != null
                ? `${record.min_age} years`
                : "—"
            }
          />
          <InfoRow
            label={t("cars.fields.min_exp", "Min Experience")}
            value={
              record.min_experience != null
                ? `${record.min_experience} years`
                : "—"
            }
          />
          {record.discount_tiers && (
            <InfoRow
              label={t("cars.fields.discount_tiers", "Discount Tiers")}
              value={
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
                >
                  {JSON.stringify(record.discount_tiers)}
                </Typography>
              }
            />
          )}
        </SectionCard>
      </Grid>

      {/* CARD 4 - LOCATION */}
      <Grid item xs={12} md={6}>
        <SectionCard
          title={t("cars.fields.location.label", "Location")}
          icon={<LocationOnIcon />}
        >
          {record.location ? (
            <>
              <InfoRow
                label={t("cars.fields.location_name", "Name")}
                value={record.location.name || "—"}
              />
              <InfoRow
                label={t("cars.fields.location_address", "Address")}
                value={record.location.address || "—"}
              />
              <InfoRow
                label="Coordinates"
                value={
                  record.location.latitude && record.location.longitude
                    ? `${Number(record.location.latitude).toFixed(4)}, ${Number(record.location.longitude).toFixed(4)}`
                    : "—"
                }
              />
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
              {t("notAvailable", "Not specified")}
            </Typography>
          )}
        </SectionCard>
      </Grid>

      {/* OWNER */}
      <Grid item xs={12}>
        <SectionCard
          title={t("cars.fields.owner.label", "Owner")}
          icon={<PersonIcon />}
        >
          {record.owner ? (
            <InfoRow
              label={t("users.fields.name", "Name")}
              value={`${record.owner.first_name || ""} ${record.owner.last_name || ""}`.trim() || "—"}
            />
          ) : (
            <Stack direction="row" alignItems="center" spacing={1}>
              <CheckCircleIcon color="success" fontSize="small" />
              <Typography variant="body2">
                {t("cars.fields.owner.company", "Company (Our Fleet)")}
              </Typography>
            </Stack>
          )}
        </SectionCard>
      </Grid>

      {/* FEATURES */}
      {record.features && record.features.length > 0 && (
        <Grid item xs={12}>
          <SectionCard
            title={t("cars.fields.features.label", "Features")}
            icon={<LocalOfferIcon />}
          >
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {record.features.map((f: any, idx: number) => (
                <Chip key={idx} label={f.internal_name ?? f} variant="outlined" size="small" />
              ))}
            </Stack>
          </SectionCard>
        </Grid>
      )}

      {/* DESCRIPTION */}
      <Grid item xs={12}>
        <DescriptionBlock record={record} t={t} />
      </Grid>

      {/* SYSTEM INFO */}
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ p: 2.5 }}>
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            {t("users.fields.systemData", "System Data")}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <InfoRow
                label="ID"
                value={
                  <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                    {record.id}
                  </Typography>
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InfoRow
                label={t("cars.fields.avg_rating", "Rating")}
                value={
                  record.avg_rating != null
                    ? `${Number(record.avg_rating).toFixed(1)} ★`
                    : "—"
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InfoRow
                label={t("users.fields.createdAt")}
                value={
                  record.created_at
                    ? new Date(record.created_at).toLocaleDateString()
                    : "—"
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InfoRow
                label={t("users.fields.updatedAt", "Updated")}
                value={
                  record.updated_at
                    ? new Date(record.updated_at).toLocaleDateString()
                    : "—"
                }
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};
