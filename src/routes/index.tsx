import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useState } from "react";
import { computeDashboardStats, mockIncidents } from "@/data/incidents";
import { cn } from "@/lib/utils";

const IncidentMap = lazy(() => import("@/components/incident-map"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Operations Overview — RescueGraph AI" },
      {
        name: "description",
        content:
          "Live disaster-response posture: critical incidents, people affected, rescue teams, and available shelters.",
      },
      { property: "og:title", content: "Operations Overview — RescueGraph AI" },
      {
        property: "og:description",
        content:
          "Live disaster-response posture: critical incidents, people affected, rescue teams, and available shelters.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

const statConfig = [
  { key: "criticalIncidents", label: "Critical Incidents", tag: "CRITICAL", color: "crit", blinking: true },
  { key: "peopleAffected", label: "People Affected", tag: "ALERT", color: "alert", blinking: false },
  { key: "activeRescueTeams", label: "Active Rescue Teams", tag: "ACTIVE", color: "ops", blinking: false },
  { key: "availableShelters", label: "Available Shelters", tag: "OPEN", color: "ok", blinking: false },
] as const;

const colorClasses: Record<
  (typeof statConfig)[number]["color"],
  { text: string; bg: string }
> = {
  crit: { text: "text-crit", bg: "bg-crit" },
  alert: { text: "text-alert", bg: "bg-alert" },
  ops: { text: "text-ops", bg: "bg-ops" },
  ok: { text: "text-ok", bg: "bg-ok" },
};

function DashboardPage() {
  const stats = computeDashboardStats(mockIncidents);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b border-edge px-6 py-5 md:px-8">
        <h1 className="font-display text-[26px] leading-none tracking-wide">
          Operations Overview
        </h1>
        <span className="ml-auto flex items-center gap-2 rounded-full border border-warn/40 bg-warn/15 px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-[0.12em] text-warn">
          <span className="size-2 rounded-full bg-warn" />
          DEMO MODE — SIMULATED DATA
        </span>
      </header>

      <div className="flex flex-col gap-5 px-6 py-6 md:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statConfig.map((stat, idx) => {
            const colors = colorClasses[stat.color];
            return (
              <div
                key={stat.key}
                className="animate-rise rounded-[22px] border border-edge bg-panel p-5"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "font-mono text-[11px] font-bold tracking-[0.12em]",
                      colors.text,
                    )}
                  >
                    {stat.tag}
                  </span>
                  <span
                    className={cn(
                      "size-2.5 rounded-full",
                      colors.bg,
                      stat.blinking && "animate-blink-fast",
                    )}
                  />
                </div>
                <div
                  className={cn(
                    "mt-3 font-display text-[64px] leading-[0.85]",
                    colors.text,
                  )}
                >
                  {stats[stat.key].toLocaleString("en-US")}
                </div>
                <div className="mt-2 text-[13px] text-dim">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="rounded-[22px] border border-edge bg-panel p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-bold tracking-[0.12em] text-dim">
              LIVE OPERATIONS MAP
            </span>
            <div className="flex items-center gap-3">
              {(
                [
                  ["CRITICAL", "bg-crit"],
                  ["HIGH", "bg-alert"],
                  ["MEDIUM", "bg-warn"],
                  ["LOW", "bg-ok"],
                ] as const
              ).map(([label, dot]) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 font-mono text-[10px] text-dim"
                >
                  <span className={cn("size-2 rounded-full", dot)} />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="h-[420px] w-full overflow-hidden rounded-2xl border border-edge bg-background md:h-[480px]">
            {mounted ? (
              <Suspense
                fallback={
                  <div className="grid h-full place-items-center font-mono text-[10px] uppercase tracking-[0.15em] text-dim/50">
                    Loading map…
                  </div>
                }
              >
                <IncidentMap incidents={mockIncidents} />
              </Suspense>
            ) : (
              <div className="grid h-full place-items-center font-mono text-[10px] uppercase tracking-[0.15em] text-dim/50">
                Initializing map…
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
