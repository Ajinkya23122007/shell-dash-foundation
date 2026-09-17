export type IncidentType =
  | "TRAPPED_PEOPLE"
  | "FLOOD"
  | "FIRE"
  | "MEDICAL"
  | "ROAD_BLOCKAGE"
  | "MISSING_PEOPLE"
  | "OTHER";

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type IncidentStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export type Incident = {
  id: string;
  type: IncidentType;
  description: string;
  location: string;
  lat: number;
  lng: number;
  peopleAffected: number;
  severity: Severity;
  status: IncidentStatus;
  reportedAt: string;
};

export const mockIncidents: Incident[] = [
  {
    id: "INC-0001",
    type: "TRAPPED_PEOPLE",
    description: "Approx. 200 people trapped near the old railway bridge after partial collapse.",
    location: "Old Railway Bridge, North Ward",
    lat: 19.076,
    lng: 72.8777,
    peopleAffected: 200,
    severity: "CRITICAL",
    status: "IN_PROGRESS",
    reportedAt: "2026-09-17T04:12:00Z",
  },
  {
    id: "INC-0002",
    type: "MEDICAL",
    description: "District hospital reports oxygen supply critically low; generator backup failing.",
    location: "District Hospital, Central Zone",
    lat: 19.08,
    lng: 72.882,
    peopleAffected: 340,
    severity: "CRITICAL",
    status: "OPEN",
    reportedAt: "2026-09-17T04:38:00Z",
  },
  {
    id: "INC-0003",
    type: "FIRE",
    description: "Warehouse fire spreading toward residential block; smoke inhalation reports.",
    location: "Dockyard Warehouse 4",
    lat: 19.065,
    lng: 72.864,
    peopleAffected: 75,
    severity: "CRITICAL",
    status: "IN_PROGRESS",
    reportedAt: "2026-09-17T03:55:00Z",
  },
  {
    id: "INC-0004",
    type: "FLOOD",
    description: "Street flooding waist-deep; families evacuated to rooftops on Canal Road.",
    location: "Canal Road, East Bank",
    lat: 19.09,
    lng: 72.895,
    peopleAffected: 480,
    severity: "HIGH",
    status: "OPEN",
    reportedAt: "2026-09-17T04:20:00Z",
  },
  {
    id: "INC-0005",
    type: "FLOOD",
    description: "Underpass fully submerged; at least 6 vehicles stranded.",
    location: "Station Underpass",
    lat: 19.072,
    lng: 72.884,
    peopleAffected: 22,
    severity: "HIGH",
    status: "IN_PROGRESS",
    reportedAt: "2026-09-17T04:02:00Z",
  },
  {
    id: "INC-0006",
    type: "MISSING_PEOPLE",
    description: "Family reports 3 members missing since the embankment breach.",
    location: "Riverside Embankment",
    lat: 19.085,
    lng: 72.87,
    peopleAffected: 3,
    severity: "HIGH",
    status: "OPEN",
    reportedAt: "2026-09-17T05:01:00Z",
  },
  {
    id: "INC-0007",
    type: "ROAD_BLOCKAGE",
    description: "Fallen overpass debris blocking the main evacuation route north.",
    location: "NH-48 Junction, North Exit",
    lat: 19.1,
    lng: 72.86,
    peopleAffected: 0,
    severity: "MEDIUM",
    status: "OPEN",
    reportedAt: "2026-09-17T03:40:00Z",
  },
  {
    id: "INC-0008",
    type: "MEDICAL",
    description: "Field clinic requesting insulin and trauma kits for ~40 treated patients.",
    location: "Field Clinic, Stadium Grounds",
    lat: 19.068,
    lng: 72.891,
    peopleAffected: 40,
    severity: "MEDIUM",
    status: "IN_PROGRESS",
    reportedAt: "2026-09-17T04:45:00Z",
  },
  {
    id: "INC-0009",
    type: "OTHER",
    description: "Power substation offline; surrounding 4 blocks without electricity.",
    location: "Grid Substation 12",
    lat: 19.078,
    lng: 72.868,
    peopleAffected: 900,
    severity: "MEDIUM",
    status: "OPEN",
    reportedAt: "2026-09-17T03:22:00Z",
  },
  {
    id: "INC-0010",
    type: "ROAD_BLOCKAGE",
    description: "Landslide debris on hill road; alternative route signposted.",
    location: "Hillcrest Road",
    lat: 19.11,
    lng: 72.9,
    peopleAffected: 0,
    severity: "LOW",
    status: "RESOLVED",
    reportedAt: "2026-09-17T01:30:00Z",
  },
  {
    id: "INC-0011",
    type: "FIRE",
    description: "Small kitchen fire in shelter canteen; extinguished by volunteers.",
    location: "Shelter 7, Community Hall",
    lat: 19.062,
    lng: 72.879,
    peopleAffected: 5,
    severity: "LOW",
    status: "RESOLVED",
    reportedAt: "2026-09-17T02:15:00Z",
  },
  {
    id: "INC-0012",
    type: "OTHER",
    description: "Water distribution point running low on bottled water supplies.",
    location: "Distribution Point B",
    lat: 19.074,
    lng: 72.887,
    peopleAffected: 300,
    severity: "LOW",
    status: "OPEN",
    reportedAt: "2026-09-17T05:20:00Z",
  },
];

export type DashboardStats = {
  criticalIncidents: number;
  peopleAffected: number;
  activeRescueTeams: number;
  availableShelters: number;
};

export function computeDashboardStats(incidents: Incident[]): DashboardStats {
  return {
    criticalIncidents: incidents.filter(
      (i) => i.severity === "CRITICAL" && i.status !== "RESOLVED",
    ).length,
    peopleAffected: incidents
      .filter((i) => i.status !== "RESOLVED")
      .reduce((sum, i) => sum + i.peopleAffected, 0),
    activeRescueTeams: incidents.filter((i) => i.status === "IN_PROGRESS").length * 6,
    availableShelters: 126,
  };
}
