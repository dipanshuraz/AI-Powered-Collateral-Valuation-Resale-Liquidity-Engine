"use client";

import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LayersControl,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MAP_HEIGHT = "min(320px, 55vh)";

/** Rough center of India when no coords yet. */
const DEFAULT_CENTER: LatLngExpression = [20.5937, 78.9629];

type Props = {
  lat: string;
  lon: string;
  onPositionChange: (next: { lat: string; lon: string }) => void;
  onAddressResolved?: (formattedAddress: string) => void;
};

function parseLng(s: string): number | null {
  const n = parseFloat(s.trim());
  if (!Number.isFinite(n) || n < -180 || n > 180) return null;
  return n;
}

function parseLat(s: string): number | null {
  const n = parseFloat(s.trim());
  if (!Number.isFinite(n) || n < -90 || n > 90) return null;
  return n;
}

function MapClickHandler({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/** Leaflet only uses `center` on mount — pan when lat/lon change (inputs or pin). Keeps user zoom. */
function ViewSync({ lat, lon }: { lat: string; lon: string }) {
  const map = useMap();
  useEffect(() => {
    const la = parseLat(lat);
    const lo = parseLng(lon);
    if (la == null || lo == null) return;
    map.panTo([la, lo]);
  }, [map, lat, lon]);
  return null;
}

/** Fix default marker assets when bundling (Leaflet + webpack/Next). */
function useLeafletDefaultIcon() {
  useEffect(() => {
    const icon = new L.Icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    L.Marker.prototype.options.icon = icon;
  }, []);
}

/**
 * Defer mounting the map until after paint so any previous Leaflet instance on this
 * subtree is fully torn down (helps with Strict Mode and fast step navigation).
 */
function useDeferredMapMount() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setReady(true);
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, []);
  return ready;
}

export function LocationMapPicker({
  lat,
  lon,
  onPositionChange,
  onAddressResolved,
}: Props) {
  useLeafletDefaultIcon();
  const mapContainerReady = useDeferredMapMount();
  /** Unique id for the map wrapper so React never reuses a DOM node Leaflet has touched. */
  const mapInstanceKey = useMemo(
    () => `leaflet-${Math.random().toString(36).slice(2, 11)}`,
    []
  );

  const parsed = useMemo(() => {
    const la = parseLat(lat);
    const lo = parseLng(lon);
    if (la != null && lo != null) return { lat: la, lng: lo };
    return null;
  }, [lat, lon]);

  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number }>(() => {
    if (parsed) return { lat: parsed.lat, lng: parsed.lng };
    return { lat: 20.5937, lng: 78.9629 };
  });

  useEffect(() => {
    if (parsed) setMarkerPos({ lat: parsed.lat, lng: parsed.lng });
  }, [parsed]);

  const reverseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reverseGeocode = useCallback(
    (position: { lat: number; lng: number }) => {
      if (!onAddressResolved) return;
      if (reverseTimer.current) clearTimeout(reverseTimer.current);
      reverseTimer.current = setTimeout(async () => {
        try {
          const q = new URLSearchParams({
            lat: String(position.lat),
            lon: String(position.lng),
          });
          const res = await fetch(`/api/reverse-geocode?${q.toString()}`);
          if (!res.ok) return;
          const data = (await res.json()) as { display_name?: string };
          if (data.display_name) onAddressResolved(data.display_name);
        } catch {
          /* ignore */
        }
      }, 1000);
    },
    [onAddressResolved]
  );

  useEffect(() => {
    return () => {
      if (reverseTimer.current) clearTimeout(reverseTimer.current);
    };
  }, []);

  const applyPosition = useCallback(
    (la: number, ln: number) => {
      const position = { lat: la, lng: ln };
      setMarkerPos(position);
      onPositionChange({
        lat: position.lat.toFixed(6),
        lon: position.lng.toFixed(6),
      });
    },
    [onPositionChange]
  );

  const onMapClick = useCallback(
    (la: number, ln: number) => {
      applyPosition(la, ln);
      reverseGeocode({ lat: la, lng: ln });
    },
    [applyPosition, reverseGeocode]
  );

  const center: LatLngExpression = parsed
    ? [parsed.lat, parsed.lng]
    : DEFAULT_CENTER;

  const zoom = parsed ? 17 : 5;

  return (
    <div className="space-y-2">
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Free <strong>OpenStreetMap</strong> tiles — tap the map or drag the pin. Use the layer
        control (top-right) to switch to aerial imagery (Esri) for rough land context. Address
        fill uses our server + Nominatim (throttled).
      </p>
      <div
        key={mapInstanceKey}
        className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 [&_.leaflet-container]:z-[1] [&_.leaflet-container]:min-h-[240px] [&_.leaflet-container]:w-full [&_.leaflet-container]:font-[family-name:var(--font-geist-sans)]"
      >
        {!mapContainerReady ? (
          <div
            className="animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800"
            style={{ height: MAP_HEIGHT, minHeight: "240px", width: "100%" }}
            aria-hidden
          />
        ) : (
          <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom
            className="[&_.leaflet-container]:h-[min(320px,55vh)]"
            style={{
              height: MAP_HEIGHT,
              width: "100%",
              minHeight: "240px",
            }}
          >
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="Map (OSM)">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Aerial (Esri)">
                <TileLayer
                  attribution="Esri, Maxar, Earthstar Geographics"
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              </LayersControl.BaseLayer>
            </LayersControl>
            <MapClickHandler onClick={onMapClick} />
            <ViewSync lat={lat} lon={lon} />
            <Marker
              position={[markerPos.lat, markerPos.lng]}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const p = e.target.getLatLng();
                  applyPosition(p.lat, p.lng);
                  reverseGeocode({ lat: p.lat, lng: p.lng });
                },
              }}
            />
          </MapContainer>
        )}
      </div>
    </div>
  );
}
