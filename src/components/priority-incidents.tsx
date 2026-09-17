import { useMemo } from "react";
import type { Incident, Severity } from "@/data/incidents";
import { cn } from "@/lib/utils";

const severityRank: Record<Severity, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

const severityStyles: Record<
  Severity,
  { text: string; dot: string; border: string; chip: string }
> = {
  CRITICAL: {
    text: "text-crit",
    dot: "bg-crit",
    border: "border-crit/60",
    chip: "border-crit/40 bg-crit/15 text-crit",
  },
  HIGH: {
    text: "text-alert",
    dot: "bg-alert",
    border: "border-alert/60",
    chip: "border-alert/40 bg-alert/15 text-alert",
  },
  MEDIUM: {
    text: "text-warn",
    dot: "bg-warn",
    border: "border-warn/60",
    chip: "border-warn/40 bg-warn/15 text-warn",
  },
  LOW: {
    text: "text-ok",
    dot: "bg-ok",
    border: "border-ok/60",
    chip: "border-ok/40 bg-ok/15 text-ok",
  },
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

export default function PriorityIncidents({
  incidents,
  selectedId,
  onSelect,
}: {
  incidents: Incident[];
  selectedId?: string | null;
  onSelect?: (incident: Incident) => void;
}) {
  const sorted = useMemo(
    () =>
      [...incidents]
        .filter((i) => i.status !== "RESOLVED")
        .sort(
          (a, b) =>
            severityRank[a.severity] - severityRank[b.severity] ||
            b.peopleAffected - a.peopleAffected,
        ),
    [incidents],
  );

  return (
    <section className="flex min-h-0 flex-col rounded-[22px] border border-edge bg-panel p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-bold tracking-[0.12em] text-dim">
          PRIORITY INCIDENTS
        </span>
        <span className="font-mono text-[11px] text-dim/70">
          {sorted.length} ACTIVE
        </span>
      </div>

      <ul className="flex max-h-[420px] flex-col gap-2.5 overflow-y-auto pr-1 md:max-h-[480px]">
        {sorted.map((incident) => {
          const s = severityStyles[incident.severity];
          const active = selectedId === incident.id;
          return (
            <li key={incident.id}>
              <button
                type="button"
                onClick={() => onSelect?.(incident)}
                aria-pressed={active}
                className={cn(
                  "w-full rounded-2xl border bg-background/60 p-3.5 text-left transition-colors duration-150",
                  active
                    ? cn(s.border, "bg-background")
                    : "border-edge hover:border-dim/40",
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2.5 shrink-0 rounded-full",
                      s.dot,
                      incident.severity === "CRITICAL" && "animate-blink-fast",
                    )}
                  />
                  <span className="truncate text-[13px] font-semibold text-ink">
                    {typeLabels[incident.type]}
                  </span>
                  <span
                    className={cn(
                      "ml-auto shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.1em]",
                      s.chip,
                    )}
                  >
                    {incident.severity}
                  </span>
                </div>

                <p className="mt-1.5 line-clamp-2 text-[12px] leading-snug text-dim">
                  {incident.description}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.08em] text-dim/70">
                  <span className="truncate">{incident.location}</span>
                  <span>{incident.peopleAffected} AFFECTED</span>
                  <span className="ml-auto">
                    {formatTime(incident.reportedAt)} UTC
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
