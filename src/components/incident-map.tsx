import { useEffect } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { mockIncidents, type Incident, type Severity } from "@/data/incidents";

function FlyToSelected({ incident }: { incident?: Incident | null }) {
  const map = useMap();
  useEffect(() => {
    if (incident) {
      map.flyTo([incident.lat, incident.lng], Math.max(map.getZoom(), 15), {
        duration: 0.8,
      });
    }
  }, [incident, map]);
  return null;
}

const severityColors: Record<Severity, string> = {
  CRITICAL: "#ff3b30",
  HIGH: "#ff8a00",
  MEDIUM: "#ffd23f",
  LOW: "#21d07a",
};

const typeLabels: Record<Incident["type"], string> = {
  TRAPPED_PEOPLE: "Trapped People",
  FLOOD: "Flood",
  FIRE: "Fire",
  MEDICAL: "Medical",
  ROAD_BLOCKAGE: "Road Blockage",
  MISSING_PEOPLE: "Missing People",
  OTHER: "Other",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
}

export default function IncidentMap({
  incidents = mockIncidents,
  onSelect,
}: {
  incidents?: Incident[];
  onSelect?: (incident: Incident) => void;
}) {
  const center: [number, number] = [19.08, 72.88];

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="h-full w-full rounded-2xl"
      style={{ background: "#0f1115" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {incidents.map((incident) => (
        <CircleMarker
          key={incident.id}
          center={[incident.lat, incident.lng]}
          radius={incident.severity === "CRITICAL" ? 12 : 9}
          pathOptions={{
            color: severityColors[incident.severity],
            fillColor: severityColors[incident.severity],
            fillOpacity: 0.55,
            weight: 2,
          }}
          eventHandlers={{
            click: () => onSelect?.(incident),
          }}
        >
          <Popup>
            <div className="min-w-[200px] font-sans">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block size-2.5 rounded-full"
                  style={{ backgroundColor: severityColors[incident.severity] }}
                />
                <strong className="text-[13px]">{typeLabels[incident.type]}</strong>
              </div>
              <p className="mt-1 text-[12px] text-neutral-600">{incident.description}</p>
              <dl className="mt-2 space-y-0.5 text-[12px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-500">Location</dt>
                  <dd className="text-right font-medium">{incident.location}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-500">People affected</dt>
                  <dd className="font-medium">{incident.peopleAffected}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-500">Severity</dt>
                  <dd className="font-medium">{incident.severity}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-500">Status</dt>
                  <dd className="font-medium">{incident.status.replace("_", " ")}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-500">Reported</dt>
                  <dd className="font-medium">{formatTime(incident.reportedAt)} UTC</dd>
                </div>
              </dl>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
