import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";

export const Route = createFileRoute("/incidents")({
  head: () => ({
    meta: [
      { title: "All Incidents — RescueGraph AI" },
      {
        name: "description",
        content: "Searchable list of every reported incident with severity and status.",
      },
      { property: "og:title", content: "All Incidents — RescueGraph AI" },
      {
        property: "og:description",
        content: "Searchable list of every reported incident with severity and status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IncidentsPage,
});

function IncidentsPage() {
  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b border-edge px-6 py-5 md:px-8">
        <h1 className="font-display text-[26px] leading-none tracking-wide">
          All Incidents
        </h1>
        <span className="ml-auto flex items-center gap-2 rounded-full border border-warn/40 bg-warn/15 px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-[0.12em] text-warn">
          <span className="size-2 rounded-full bg-warn" />
          DEMO MODE — SIMULATED DATA
        </span>
      </header>
      <div className="grid flex-1 place-items-center px-6 py-10">
        <div className="flex max-w-md flex-col items-center rounded-[22px] border border-edge bg-panel p-8 text-center">
          <span className="grid size-12 place-items-center rounded-2xl border border-edge bg-background text-ok">
            <ListChecks className="size-6" />
          </span>
          <p className="mt-4 font-mono text-[11px] font-bold tracking-[0.12em] text-dim">
            MODULE PENDING
          </p>
          <p className="mt-2 text-[14px] text-dim">
            The searchable incident table with severity filters is built in the next
            step.
          </p>
        </div>
      </div>
    </main>
  );
}
