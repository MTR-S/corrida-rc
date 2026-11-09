export type RaceStatus = 'completed' | 'in_progress' | 'scheduled';

export type PaceStrategy = 'attack' | 'normal' | 'save_battery';

export type BatteryHealth = 'ideal' | 'warning' | 'critical';

export interface BatteryTelemetry {
  batteryId: string;
  lapsCompleted: number;
  voltage: number;
  chargePercent: number;
  drainPerLap: number;
  estimatedLapsRemaining: number;
  health: BatteryHealth;
}

export interface LapTelemetry {
  lapNumber: number;
  lapTimeSeconds: number;
  formattedTime: string;
  position: number;
  batteryId: string;
  isPitStop?: boolean;
}

export interface Driver {
  id: string;
  name: string;
  number: number;
  teamId: string;
  carModel: string;
  profile: string;
  totalWins: number;
  totalPodiums: number;
  bestLapTimeOverall: string;
}

export interface Team {
  id: string;
  name: string;
  shortCode: string;
  teamPrincipal: string;
  color: string;
  carSpecs: string;
  driverIds: [string, string];
}

export interface DriverRaceResult {
  driverId: string;
  teamId: string;
  position: number;
  lapsCompleted: number;
  totalTimeSeconds: number;
  bestLapTimeSeconds: number;
  bestLapFormatted: string;
  lastLapTimeSeconds: number;
  lastLapFormatted: string;
  points: number;
  batteriesUsed: string[];
  activeBatteryId: string;
  paceStrategy: PaceStrategy;
  batteryTelemetry: BatteryTelemetry;
  batteryHistory: Record<string, { lapsCompleted: number; finalVoltage: number; finalChargePercent: number }>;
  laps: LapTelemetry[];
}

export interface Race {
  id: string;
  number: number;
  name: string;
  circuit: string;
  date: string;
  totalLaps: number;
  currentLap: number;
  status: RaceStatus;
  winnerDriverId?: string;
  fastestLapDriverId?: string;
  fastestLapFormatted?: string;
  highlights?: string;
}

export type PostCategory = 'pilotos' | 'acontecimentos' | 'resultados' | 'bastidores';

export interface TeamPost {
  id: string;
  raceNumber: number;
  teamId: string;
  author: string;
  role: string;
  category: PostCategory;
  timestamp: string;
  lapNumber: number;
  content: string;
  citedInPressRelease?: boolean;
}

export type RaceEventType = 'overtake' | 'fastest_lap' | 'pit_stop' | 'incident' | 'penalty';

export interface RaceEvent {
  id: string;
  raceNumber: number;
  lapNumber: number;
  type: RaceEventType;
  driverId?: string;
  teamId?: string;
  description: string;
  timestamp: string;
}

export interface DriverStanding {
  driverId: string;
  driverName: string;
  teamId: string;
  teamName: string;
  carNumber: number;
  position: number;
  totalPoints: number;
  pointsByRace: Record<number, number>;
  wins: number;
  podiums: number;
  gapToLeader: number;
  gapToAhead: number;
}

export interface TeamStanding {
  teamId: string;
  teamName: string;
  shortCode: string;
  position: number;
  totalPoints: number;
  pointsByRace: Record<number, number>;
  driverScores: { driverId: string; driverName: string; points: number }[];
  wins: number;
  podiums: number;
  gapToLeader: number;
  gapToAhead: number;
}

export interface PressReleaseDraft {
  raceNumber: number;
  headline: string;
  body: string;
  citedPostIds: string[];
  citedEventIds: string[];
  lastUpdated: string;
}

export type PersonaType = 'tech_lead' | 'reporter';
export type ThemeType = 'dark' | 'light';
export type AppView = 'dashboard' | 'batteries' | 'results' | 'feed';

export interface ChampionshipState {
  teams: Team[];
  drivers: Driver[];
  races: Record<number, Race>;
  raceResults: Record<number, DriverRaceResult[]>;
  teamPosts: Record<number, TeamPost[]>;
  raceEvents: Record<number, RaceEvent[]>;
  pressReleaseDrafts: Record<number, PressReleaseDraft>;
  selectedRaceNumber: number;
  selectedTeamId: string;
  selectedPersona: PersonaType;
  currentView: AppView;
  theme: ThemeType;
  isSimulationPaused: boolean;
}
