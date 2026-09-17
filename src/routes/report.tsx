import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Flame,
  LifeBuoy,
  MapPin,
  RotateCcw,
  Send,
  Siren,
  Sparkles,
  Users,
} from "lucide-react";
import { classifyReport } from "@/lib/classify";
import type { IncidentType, Severity } from "@/data/incidents";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report Emergency — RescueGraph AI" },
      {
        name: "description",
        content:
          "Report an emergency so responders can triage and route rescue teams.",
      },
      { property: "og:title", content: "Report Emergency — RescueGraph AI" },
      {
        property: "og:description",
        content:
          "Report an emergency so responders can triage and route rescue teams.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportPage,
});

const severityStyles: Record<Severity, { chip: string; dot: string }> = {
  CRITICAL: { chip: "border-crit/40 bg-crit/15 text-crit", dot: "bg-crit" },
  HIGH: { chip: "border-alert/40 bg-alert/15 text-alert", dot: "bg-alert" },
  MEDIUM: { chip: "border-warn/40 bg-warn/15 text-warn", dot: "bg-warn" },
  LOW: { chip: "border-ok/40 bg-ok/15 text-ok", dot: "bg-ok" },
};

const typeLabels: Record<IncidentType, string> = {
  TRAPPED_PEOPLE: "Trapped People",
  FLOOD: "Flood",
  FIRE: "Fire",
  MEDICAL: "Medical",
  ROAD_BLOCKAGE: "Road Blockage",
  MISSING_PEOPLE: "Missing People",
  OTHER: "Other",
};

const typeOptions = Object.entries(typeLabels) as [IncidentType, string][];

const inputCls =
  "w-full rounded-xl border border-edge bg-background px-3.5 py-2.5 text-[14px] text-ink placeholder:text-dim/50 outline-none transition-colors focus:border-dim/50";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block font-mono text-[11px] font-bold tracking-[0.12em] text-dim">
      {children}
    </span>
  );
}

function ReportPage() {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [peopleAffected, setPeopleAffected] = useState("");
  const [typeOverride, setTypeOverride] = useState<IncidentType | "AUTO">(
    "AUTO",
  );
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const classification = useMemo(() => {
    const people = Number.parseInt(peopleAffected, 10) || 0;
    if (description.trim().length < 10) return null;
    const result = classifyReport(description, people);
    return {
      ...result,
      type: typeOverride === "AUTO" ? result.type : typeOverride,
    };
  }, [description, peopleAffected, typeOverride]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: string[] = [];
    if (description.trim().length < 10)
      nextErrors.push("Describe the situation in at least 10 characters.");
    if (location.trim().length < 3) nextErrors.push("Enter a location.");
    setErrors(nextErrors);
    if (nextErrors.length > 0) return;
    const id = `INC-${String(Math.floor(1000 + Math.random() * 9000))}`;
    setSubmittedId(id);
  }

  function reset() {
    setSubmittedId(null);
    setDescription("");
    setLocation("");
    setPeopleAffected("");
    setTypeOverride("AUTO");
    setErrors([]);
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b border-edge px-6 py-5 md:px-8">
        <h1 className="font-display text-[26px] leading-none tracking-wide">
          Report Emergency
        </h1>
        <span className="ml-auto flex items-center gap-2 rounded-full border border-warn/40 bg-warn/15 px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-[0.12em] text-warn">
          <span className="size-2 rounded-full bg-warn" />
          DEMO MODE — SIMULATED DATA
        </span>
      </header>

      <div className="flex-1 px-6 py-8 md:px-8">
        {submittedId ? (
          <div className="mx-auto flex max-w-lg flex-col items-center rounded-[22px] border border-ok/40 bg-panel p-8 text-center animate-rise">
            <span className="grid size-12 place-items-center rounded-2xl border border-ok/40 bg-ok/15 text-ok">
              <CheckCircle2 className="size-6" />
            </span>
            <p className="mt-4 font-mono text-[11px] font-bold tracking-[0.12em] text-ok">
              REPORT TRANSMITTED
            </p>
            <p className="mt-2 font-display text-[28px] tracking-wide text-ink">
              {submittedId}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-dim">
              Your report has been logged and routed to the response queue. In
              demo mode it is not yet added to the live incident map.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-2 rounded-full border border-edge bg-background px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-dim/50"
              >
                <RotateCcw className="size-4" />
                File another report
              </button>
              <Link
                to="/"
                className="flex items-center gap-2 rounded-full border border-crit/40 bg-crit/15 px-4 py-2 text-[13px] font-semibold text-crit transition-colors hover:bg-crit/25"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1fr_320px]"
          >
            {/* Left: form fields */}
            <section className="rounded-[22px] border border-edge bg-panel p-6">
              <div className="mb-5 flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl border border-crit/40 bg-crit/15 text-crit">
                  <Siren className="size-4.5" />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-ink">
                    Incident report
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.12em] text-dim">
                    FIELDS MARKED * ARE REQUIRED
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <label className="block">
                  <FieldLabel>SITUATION DESCRIPTION *</FieldLabel>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    placeholder="What is happening? Who is affected? Any immediate dangers?"
                    className={cn(inputCls, "resize-y")}
                  />
                </label>

                <label className="block">
                  <FieldLabel>LOCATION *</FieldLabel>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-dim/60" />
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Street, landmark, or area"
                      className={cn(inputCls, "pl-10")}
                    />
                  </div>
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <FieldLabel>PEOPLE AFFECTED (EST.)</FieldLabel>
                    <div className="relative">
                      <Users className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-dim/60" />
                      <input
                        value={peopleAffected}
                        onChange={(e) =>
                          setPeopleAffected(e.target.value.replace(/\D/g, ""))
                        }
                        inputMode="numeric"
                        placeholder="0"
                        className={cn(inputCls, "pl-10")}
                      />
                    </div>
                  </label>

                  <label className="block">
                    <FieldLabel>INCIDENT TYPE</FieldLabel>
                    <select
                      value={typeOverride}
                      onChange={(e) =>
                        setTypeOverride(e.target.value as IncidentType | "AUTO")
                      }
                      className={cn(inputCls, "appearance-none")}
                    >
                      <option value="AUTO">Auto-detect (AI)</option>
                      {typeOptions.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {errors.length > 0 && (
                  <div className="flex flex-col gap-1 rounded-xl border border-crit/40 bg-crit/10 px-4 py-3">
                    {errors.map((err) => (
                      <p
                        key={err}
                        className="flex items-center gap-2 text-[13px] text-crit"
                      >
                        <AlertTriangle className="size-3.5 shrink-0" />
                        {err}
                      </p>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-full border border-crit/50 bg-crit px-5 py-3 text-[14px] font-bold tracking-wide text-white transition-colors hover:bg-crit/85"
                >
                  <Send className="size-4" />
                  Transmit report
                </button>
              </div>
            </section>

            {/* Right: AI classification preview */}
            <aside className="flex flex-col gap-4">
              <section className="rounded-[22px] border border-edge bg-panel p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="size-4 text-warn" />
                  <span className="font-mono text-[11px] font-bold tracking-[0.12em] text-dim">
                    AI TRIAGE PREVIEW
                  </span>
                </div>

                {classification ? (
                  <div className="flex flex-col gap-4 animate-rise">
                    <div>
                      <p className="font-mono text-[10px] tracking-[0.12em] text-dim/70">
                        DETECTED TYPE
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-[16px] font-semibold text-ink">
                        <Flame className="size-4 text-dim" />
                        {typeLabels[classification.type]}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] tracking-[0.12em] text-dim/70">
                        SUGGESTED SEVERITY
                      </p>
                      <p className="mt-1.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] font-bold tracking-[0.1em]",
                            severityStyles[classification.severity].chip,
                          )}
                        >
                          <span
                            className={cn(
                              "size-2 rounded-full",
                              severityStyles[classification.severity].dot,
                              classification.severity === "CRITICAL" &&
                                "animate-blink-fast",
                            )}
                          />
                          {classification.severity}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] tracking-[0.12em] text-dim/70">
                        CONFIDENCE
                      </p>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-background">
                        <div
                          className="h-full rounded-full bg-warn transition-all duration-500"
                          style={{
                            width: `${Math.round(classification.confidence * 100)}%`,
                          }}
                        />
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-dim">
                        {Math.round(classification.confidence * 100)}%
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-[13px] leading-relaxed text-dim">
                    Start typing a description and the triage engine will
                    suggest an incident type and severity in real time.
                  </p>
                )}
              </section>

              <section className="rounded-[22px] border border-edge bg-panel p-5">
                <div className="mb-2 flex items-center gap-2">
                  <LifeBuoy className="size-4 text-ok" />
                  <span className="font-mono text-[11px] font-bold tracking-[0.12em] text-dim">
                    REPORTING TIPS
                  </span>
                </div>
                <ul className="flex flex-col gap-1.5 text-[12px] leading-snug text-dim">
                  <li>Include landmarks responders can navigate to.</li>
                  <li>Mention hazards: fire, water depth, unstable structures.</li>
                  <li>Estimate people affected — it drives severity.</li>
                </ul>
              </section>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
}
