import React, { useCallback, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import {
  Box,
  Stack,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon (Leaflet's default icon breaks with bundlers)
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

// Default center: Minsk
const DEFAULT_CENTER: [number, number] = [53.9045, 27.5615];
const DEFAULT_ZOOM = 12;

interface LocationMapProps {
  latitude: number | null;
  longitude: number | null;
  onLatitudeChange: (val: number | null) => void;
  onLongitudeChange: (val: number | null) => void;
}

const MapClickHandler = ({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const FlyToMarker = ({
  lat,
  lng,
}: {
  lat: number | null;
  lng: number | null;
}) => {
  const map = useMap();
  const prev = useRef({ lat, lng });

  useEffect(() => {
    if (
      lat != null &&
      lng != null &&
      (prev.current.lat !== lat || prev.current.lng !== lng)
    ) {
      map.flyTo([lat, lng], map.getZoom());
    }
    prev.current = { lat, lng };
  }, [lat, lng, map]);

  return null;
};

export const LocationMap = ({
  latitude,
  longitude,
  onLatitudeChange,
  onLongitudeChange,
}: LocationMapProps) => {
  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      onLatitudeChange(Number(lat.toFixed(6)));
      onLongitudeChange(Number(lng.toFixed(6)));
    },
    [onLatitudeChange, onLongitudeChange],
  );

  const handleMarkerDrag = useCallback(
    (e: L.LeafletEvent) => {
      const marker = e.target as L.Marker;
      const pos = marker.getLatLng();
      onLatitudeChange(Number(pos.lat.toFixed(6)));
      onLongitudeChange(Number(pos.lng.toFixed(6)));
    },
    [onLatitudeChange, onLongitudeChange],
  );

  const center: [number, number] =
    latitude != null && longitude != null
      ? [latitude, longitude]
      : DEFAULT_CENTER;

  return (
    <Box>
      <Box
        sx={{
          height: 350,
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          mb: 2,
          "& .leaflet-container": { height: "100%", width: "100%" },
        }}
      >
        <MapContainer
          center={center}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onMapClick={handleMapClick} />
          <FlyToMarker lat={latitude} lng={longitude} />
          {latitude != null && longitude != null && (
            <Marker
              position={[latitude, longitude]}
              draggable
              eventHandlers={{ dragend: handleMarkerDrag }}
            />
          )}
        </MapContainer>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Latitude"
            type="number"
            size="small"
            fullWidth
            inputProps={{ step: 0.000001 }}
            value={latitude ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              onLatitudeChange(v ? Number(v) : null);
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Longitude"
            type="number"
            size="small"
            fullWidth
            inputProps={{ step: 0.000001 }}
            value={longitude ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              onLongitudeChange(v ? Number(v) : null);
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
