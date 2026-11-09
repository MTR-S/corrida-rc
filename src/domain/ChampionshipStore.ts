import {
  ChampionshipState,
  PaceStrategy,
  PersonaType,
  ThemeType,
  AppView,
  TeamPost,
  DriverStanding,
  TeamStanding,
  BatteryHealth,
} from './types';
import { StorageAdapter, LocalStorageAdapter } from './storage';
import { buildInitialChampionshipState } from './seedData';
import { computeDriverStandings, computeTeamStandings, getOfficialPoints } from './scoring';

const STORAGE_KEY = 'corrida_rc_championship_state_v1';
const MAX_UNDO_HISTORY = 30;

export class ChampionshipStore {
  private state: ChampionshipState;
  private storage: StorageAdapter;
  private listeners: Set<() => void> = new Set();
  private undoHistory: ChampionshipState[] = [];

  constructor(storageAdapter?: StorageAdapter) {
    this.storage = storageAdapter || new LocalStorageAdapter();
    this.state = this.loadState();
  }

  private loadState(): ChampionshipState {
    try {
      const serialized = this.storage.getItem(STORAGE_KEY);
      if (serialized) {
        const parsed = JSON.parse(serialized);
        // Basic schema integrity check
        if (parsed.teams && parsed.drivers && parsed.races && parsed.raceResults) {
          return parsed;
        }
      }
    } catch {
      // In case of parsing error, fallback to seed
    }
    const seed = buildInitialChampionshipState();
    this.storage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }

  private persistAndNotify() {
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Ignore storage write issues
    }
    this.listeners.forEach((listener) => listener());
  }

  private pushUndoSnapshot() {
    // Clone state for undo
    const snapshot = JSON.parse(JSON.stringify(this.state));
    this.undoHistory.push(snapshot);
    if (this.undoHistory.length > MAX_UNDO_HISTORY) {
      this.undoHistory.shift();
    }
  }

  public getState(): ChampionshipState {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public canUndo(): boolean {
    return this.undoHistory.length > 0;
  }

  public undo(): boolean {
    if (this.undoHistory.length === 0) return false;
    const previousState = this.undoHistory.pop()!;
    this.state = previousState;
    this.persistAndNotify();
    return true;
  }

  public resetToDeterministicSeed(): void {
    this.pushUndoSnapshot();
    this.state = buildInitialChampionshipState();
    this.persistAndNotify();
  }

  public selectRace(raceNumber: number): void {
    if (raceNumber < 1 || raceNumber > 5 || raceNumber === this.state.selectedRaceNumber) return;
    this.pushUndoSnapshot();
    this.state = {
      ...this.state,
      selectedRaceNumber: raceNumber,
    };
    this.persistAndNotify();
  }

  public selectTeam(teamId: string): void {
    if (this.state.selectedTeamId === teamId) return;
    this.pushUndoSnapshot();
    this.state = {
      ...this.state,
      selectedTeamId: teamId,
    };
    this.persistAndNotify();
  }

  public selectPersona(persona: PersonaType): void {
    if (this.state.selectedPersona === persona) return;
    this.pushUndoSnapshot();
    this.state = {
      ...this.state,
      selectedPersona: persona,
      // Contextual default view depending on persona
      currentView: persona === 'tech_lead' ? 'dashboard' : 'results',
    };
    this.persistAndNotify();
  }

  public setCurrentView(view: AppView): void {
    if (this.state.currentView === view) return;
    this.pushUndoSnapshot();
    this.state = {
      ...this.state,
      currentView: view,
    };
    this.persistAndNotify();
  }

  public setTheme(theme: ThemeType): void {
    if (this.state.theme === theme) return;
    this.pushUndoSnapshot();
    this.state = {
      ...this.state,
      theme,
    };
    this.persistAndNotify();
  }

  public toggleTheme(): void {
    const nextTheme: ThemeType = this.state.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  public toggleSimulation(): void {
    this.pushUndoSnapshot();
    this.state = {
      ...this.state,
      isSimulationPaused: !this.state.isSimulationPaused,
    };
    this.persistAndNotify();
  }

  public setPaceStrategy(raceNumber: number, driverId: string, strategy: PaceStrategy): void {
    const results = this.state.raceResults[raceNumber];
    if (!results) return;

    this.pushUndoSnapshot();
    const updatedResults = results.map((r) => {
      if (r.driverId !== driverId) return r;

      const race = this.state.races[raceNumber];
      const remainingLaps = Math.max(0, (race?.totalLaps ?? 20) - r.lapsCompleted);

      let drainPerLap = 4.2;
      if (strategy === 'attack') drainPerLap = 5.5;
      if (strategy === 'save_battery') drainPerLap = 3.2;

      const estLapsRemaining = Math.max(0, Math.floor(r.batteryTelemetry.chargePercent / drainPerLap));
      let health: 'ideal' | 'warning' | 'critical' = 'ideal';

      if (estLapsRemaining < remainingLaps) {
        health = estLapsRemaining < remainingLaps / 2 ? 'critical' : 'warning';
      }

      return {
        ...r,
        paceStrategy: strategy,
        batteryTelemetry: {
          ...r.batteryTelemetry,
          drainPerLap,
          estimatedLapsRemaining: estLapsRemaining,
          health,
        },
      };
    });

    this.state = {
      ...this.state,
      raceResults: {
        ...this.state.raceResults,
        [raceNumber]: updatedResults,
      },
    };
    this.persistAndNotify();
  }

  public performPitStop(raceNumber: number, driverId: string): void {
    const results = this.state.raceResults[raceNumber];
    if (!results) return;

    this.pushUndoSnapshot();
    const nextBatteryId = 'BAT-02';

    const updatedResults = results.map((r) => {
      if (r.driverId !== driverId) return r;

      const oldBattery = r.activeBatteryId;
      const history = {
        ...r.batteryHistory,
        [oldBattery]: {
          lapsCompleted: r.batteryTelemetry.lapsCompleted,
          finalVoltage: r.batteryTelemetry.voltage,
          finalChargePercent: r.batteryTelemetry.chargePercent,
        },
      };

      const race = this.state.races[raceNumber];
      const remainingLaps = Math.max(0, (race?.totalLaps ?? 20) - r.lapsCompleted);
      const estLaps = Math.floor(100 / 4.2);
      const health: BatteryHealth = estLaps >= remainingLaps ? 'ideal' : 'warning';

      // Pit stop penalty: 15.0s box stop penalty added to totalTimeSeconds
      const pitPenaltySeconds = 15.0;

      return {
        ...r,
        totalTimeSeconds: Math.round((r.totalTimeSeconds + pitPenaltySeconds) * 100) / 100,
        activeBatteryId: nextBatteryId,
        batteriesUsed: r.batteriesUsed.includes(nextBatteryId)
          ? r.batteriesUsed
          : [...r.batteriesUsed, nextBatteryId],
        batteryHistory: history,
        batteryTelemetry: {
          batteryId: nextBatteryId,
          lapsCompleted: 0,
          voltage: 7.4,
          chargePercent: 100,
          drainPerLap: 4.2,
          estimatedLapsRemaining: estLaps,
          health,
        },
      };
    });

    // Add pit stop event
    const driver = this.state.drivers.find((d) => d.id === driverId);
    const race = this.state.races[raceNumber];
    const newEvent = {
      id: `ev-pit-${Date.now()}`,
      raceNumber,
      lapNumber: race?.currentLap ?? 14,
      type: 'pit_stop' as const,
      driverId,
      teamId: driver?.teamId,
      description: `PIT STOP: ${driver?.name} realizou troca para a Bateria #2.`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    const currentEvents = this.state.raceEvents[raceNumber] || [];

    this.state = {
      ...this.state,
      raceResults: {
        ...this.state.raceResults,
        [raceNumber]: updatedResults,
      },
      raceEvents: {
        ...this.state.raceEvents,
        [raceNumber]: [...currentEvents, newEvent],
      },
    };
    this.persistAndNotify();
  }

  public getTeamPostQuota(raceNumber: number, teamId: string): {
    used: number;
    max: number;
    remaining: number;
    canPost: boolean;
  } {
    const posts = this.state.teamPosts[raceNumber] || [];
    const teamPosts = posts.filter((p) => p.teamId === teamId);
    const used = teamPosts.length;
    const max = 4;
    const remaining = Math.max(0, max - used);
    return {
      used,
      max,
      remaining,
      canPost: remaining > 0,
    };
  }

  public addTeamPost(postData: Omit<TeamPost, 'id' | 'timestamp'>): {
    success: boolean;
    error?: string;
  } {
    const quota = this.getTeamPostQuota(postData.raceNumber, postData.teamId);
    if (!quota.canPost) {
      return {
        success: false,
        error: `Regulamento do Campeonato: limite regulamentar de ${quota.max} publicações por equipe nesta prova atingido.`,
      };
    }

    if (!postData.content.trim()) {
      return {
        success: false,
        error: 'O conteúdo da publicação não pode estar vazio.',
      };
    }

    this.pushUndoSnapshot();
    const newPost: TeamPost = {
      ...postData,
      id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
    };

    const currentPosts = this.state.teamPosts[postData.raceNumber] || [];
    this.state = {
      ...this.state,
      teamPosts: {
        ...this.state.teamPosts,
        [postData.raceNumber]: [newPost, ...currentPosts],
      },
    };

    this.persistAndNotify();
    return { success: true };
  }

  public deleteTeamPost(postId: string): void {
    this.pushUndoSnapshot();
    const updatedTeamPosts: Record<number, TeamPost[]> = {};

    for (const [rNum, posts] of Object.entries(this.state.teamPosts)) {
      updatedTeamPosts[Number(rNum)] = posts.filter((p) => p.id !== postId);
    }

    this.state = {
      ...this.state,
      teamPosts: updatedTeamPosts,
    };
    this.persistAndNotify();
  }

  // Domain queries
  public getOfficialPoints(position: number): number {
    return getOfficialPoints(position);
  }

  public getDriverStandings(upToRaceNumber?: number): DriverStanding[] {
    const targetRace = upToRaceNumber ?? (this.state.races[4].status === 'completed' ? 4 : 3);
    return computeDriverStandings(
      this.state.drivers,
      this.state.teams,
      this.state.raceResults,
      targetRace
    );
  }

  public getTeamStandings(upToRaceNumber?: number): TeamStanding[] {
    const targetRace = upToRaceNumber ?? (this.state.races[4].status === 'completed' ? 4 : 3);
    const driverStandings = this.getDriverStandings(targetRace);
    return computeTeamStandings(this.state.teams, driverStandings, targetRace);
  }
}
