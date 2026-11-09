import { Driver, Team, DriverRaceResult, DriverStanding, TeamStanding } from './types';

export const OFFICIAL_POINTS_TABLE: Record<number, number> = {
  1: 10,
  2: 6,
  3: 3,
  4: 2,
  5: 1,
};

export function getOfficialPoints(position: number): number {
  return OFFICIAL_POINTS_TABLE[position] ?? 0;
}

export function computeDriverStandings(
  drivers: Driver[],
  teams: Team[],
  raceResults: Record<number, DriverRaceResult[]>,
  upToRaceNumber: number = 5
): DriverStanding[] {
  const teamMap = new Map<string, Team>(teams.map((t) => [t.id, t]));

  // Aggregate stats per driver
  const standingMap = new Map<
    string,
    {
      driver: Driver;
      totalPoints: number;
      pointsByRace: Record<number, number>;
      positionsByRace: Record<number, number>;
      wins: number;
      podiums: number;
    }
  >();

  for (const driver of drivers) {
    standingMap.set(driver.id, {
      driver,
      totalPoints: 0,
      pointsByRace: {},
      positionsByRace: {},
      wins: 0,
      podiums: 0,
    });
  }

  for (let r = 1; r <= upToRaceNumber; r++) {
    const results = raceResults[r] || [];
    for (const res of results) {
      const entry = standingMap.get(res.driverId);
      if (!entry) continue;

      const pts = res.points ?? getOfficialPoints(res.position);
      entry.pointsByRace[r] = pts;
      entry.positionsByRace[r] = res.position;
      entry.totalPoints += pts;

      if (res.position === 1) {
        entry.wins += 1;
      }
      if (res.position <= 3) {
        entry.podiums += 1;
      }
    }
  }

  const sortedList = Array.from(standingMap.values()).sort((a, b) => {
    // 1. Total points descending
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    // 2. Number of wins descending
    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }
    // 3. Number of 2nd places descending
    const a2nds = Object.values(a.positionsByRace).filter((p) => p === 2).length;
    const b2nds = Object.values(b.positionsByRace).filter((p) => p === 2).length;
    if (b2nds !== a2nds) {
      return b2nds - a2nds;
    }
    // 4. Number of 3rd places descending
    const a3rds = Object.values(a.positionsByRace).filter((p) => p === 3).length;
    const b3rds = Object.values(b.positionsByRace).filter((p) => p === 3).length;
    if (b3rds !== a3rds) {
      return b3rds - a3rds;
    }
    // 5. Best placement in most recent race
    const aRecent = a.positionsByRace[upToRaceNumber] ?? 99;
    const bRecent = b.positionsByRace[upToRaceNumber] ?? 99;
    return aRecent - bRecent;
  });

  const leaderPoints = sortedList.length > 0 ? sortedList[0].totalPoints : 0;

  return sortedList.map((item, index) => {
    const team = teamMap.get(item.driver.teamId);
    const gapToLeader = leaderPoints - item.totalPoints;
    const gapToAhead = index === 0 ? 0 : sortedList[index - 1].totalPoints - item.totalPoints;

    return {
      driverId: item.driver.id,
      driverName: item.driver.name,
      teamId: item.driver.teamId,
      teamName: team?.name ?? 'Equipe Desconhecida',
      carNumber: item.driver.number,
      position: index + 1,
      totalPoints: item.totalPoints,
      pointsByRace: item.pointsByRace,
      wins: item.wins,
      podiums: item.podiums,
      gapToLeader,
      gapToAhead,
    };
  });
}

export function computeTeamStandings(
  teams: Team[],
  driverStandings: DriverStanding[],
  upToRaceNumber: number = 5
): TeamStanding[] {
  const driverMap = new Map<string, DriverStanding>(driverStandings.map((ds) => [ds.driverId, ds]));

  const teamList = teams.map((team) => {
    const d1 = driverMap.get(team.driverIds[0]);
    const d2 = driverMap.get(team.driverIds[1]);

    const pointsByRace: Record<number, number> = {};
    for (let r = 1; r <= upToRaceNumber; r++) {
      const p1 = d1?.pointsByRace[r] ?? 0;
      const p2 = d2?.pointsByRace[r] ?? 0;
      pointsByRace[r] = p1 + p2;
    }

    const totalPoints = (d1?.totalPoints ?? 0) + (d2?.totalPoints ?? 0);
    const wins = (d1?.wins ?? 0) + (d2?.wins ?? 0);
    const podiums = (d1?.podiums ?? 0) + (d2?.podiums ?? 0);

    const driverScores = [
      {
        driverId: team.driverIds[0],
        driverName: d1?.driverName ?? 'Piloto 1',
        points: d1?.totalPoints ?? 0,
      },
      {
        driverId: team.driverIds[1],
        driverName: d2?.driverName ?? 'Piloto 2',
        points: d2?.totalPoints ?? 0,
      },
    ];

    return {
      teamId: team.id,
      teamName: team.name,
      shortCode: team.shortCode,
      position: 0,
      totalPoints,
      pointsByRace,
      driverScores,
      wins,
      podiums,
      gapToLeader: 0,
      gapToAhead: 0,
    };
  });

  teamList.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }
    if (b.podiums !== a.podiums) {
      return b.podiums - a.podiums;
    }
    return a.teamName.localeCompare(b.teamName);
  });

  const leaderPoints = teamList.length > 0 ? teamList[0].totalPoints : 0;

  return teamList.map((item, index) => ({
    ...item,
    position: index + 1,
    gapToLeader: leaderPoints - item.totalPoints,
    gapToAhead: index === 0 ? 0 : teamList[index - 1].totalPoints - item.totalPoints,
  }));
}
