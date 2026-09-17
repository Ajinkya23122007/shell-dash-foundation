import type { IncidentType, Severity } from "@/data/incidents";

/**
 * Mock "AI" classifier — keyword heuristics over the report text.
 * Stands in for the real AI classification step until a backend is connected.
 */
export function classifyReport(text: string, peopleAffected: number): {
  type: IncidentType;
  severity: Severity;
  confidence: number;
} {
  const t = text.toLowerCase();

  let type: IncidentType = "OTHER";
  if (/(trap|collapse|stuck|buried|stranded)/.test(t)) type = "TRAPPED_PEOPLE";
  else if (/(flood|water|submerg|drown|river|rain)/.test(t)) type = "FLOOD";
  else if (/(fire|burn|smoke|flame|blaze|explosion)/.test(t)) type = "FIRE";
  else if (/(medic|injur|hospital|ambulance|blood|heart|unconscious)/.test(t))
    type = "MEDICAL";
  else if (/(road|block|debris|bridge|landslide|traffic)/.test(t))
    type = "ROAD_BLOCKAGE";
  else if (/(missing|lost|child|search)/.test(t)) type = "MISSING_PEOPLE";

  let severity: Severity = "LOW";
  if (
    peopleAffected >= 100 ||
    /(critical|dying|trapped|collapse|spreading|unconscious|life)/.test(t)
  )
    severity = "CRITICAL";
  else if (
    peopleAffected >= 20 ||
    /(urgent|serious|injur|fire|flood|missing)/.test(t)
  )
    severity = "HIGH";
  else if (peopleAffected >= 1 || /(help|need|struck|damage)/.test(t))
    severity = "MEDIUM";

  const confidence = Math.min(
    0.97,
    0.62 + (type !== "OTHER" ? 0.15 : 0) + Math.min(text.length / 400, 0.15),
  );

  return { type, severity, confidence };
}
