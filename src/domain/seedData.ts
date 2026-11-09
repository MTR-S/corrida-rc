import {
  Team,
  Driver,
  Race,
  DriverRaceResult,
  TeamPost,
  RaceEvent,
  ChampionshipState,
} from './types';
import { getOfficialPoints } from './scoring';

export const SEED_TEAMS: Team[] = [
  {
    id: 'nitro-rc',
    name: 'Nitro RC',
    shortCode: 'NIT',
    teamPrincipal: 'Roberto "Beto" Almeida',
    color: '#ef4444', // Red
    carSpecs: 'Chassi Carbon-X 1/10, Motor Brushless 3.5T, ESC 160A',
    driverIds: ['drv-lucas-silveira', 'drv-pedro-santos'],
  },
  {
    id: 'apex-racing',
    name: 'Apex Racing',
    shortCode: 'APX',
    teamPrincipal: 'Carlos Moura',
    color: '#3b82f6', // Blue
    carSpecs: 'Chassi AeroPro T4, Motor Brushless 4.0T, ESC 150A',
    driverIds: ['drv-gabriel-ramos', 'drv-felipe-duarte'],
  },
  {
    id: 'turbo-vortex',
    name: 'Turbo Vortex',
    shortCode: 'VRX',
    teamPrincipal: 'Daniel Lima',
    color: '#10b981', // Green
    carSpecs: 'Chassi Vortex R1, Motor Brushless 3.5T Mod, ESC 160A',
    driverIds: ['drv-bruno-rocha', 'drv-thiago-costa'],
  },
  {
    id: 'lightning-bolt',
    name: 'Lightning Bolt',
    shortCode: 'LTN',
    teamPrincipal: 'Eduardo Castro',
    color: '#f59e0b', // Amber/Yellow
    carSpecs: 'Chassi Bolt RS, Motor Brushless 4.5T, ESC 140A',
    driverIds: ['drv-rafael-silva', 'drv-marcos-souza'],
  },
  {
    id: 'fusion-motorsport',
    name: 'Fusion Motorsport',
    shortCode: 'FUS',
    teamPrincipal: 'Leonardo Paiva',
    color: '#8b5cf6', // Purple
    carSpecs: 'Chassi Fusion Evo, Motor Brushless 3.5T, ESC 160A',
    driverIds: ['drv-andre-martins', 'drv-rodrigo-lima'],
  },
  {
    id: 'shadow-precision',
    name: 'Shadow Precision',
    shortCode: 'SDW',
    teamPrincipal: 'Marcelo Braga',
    color: '#06b6d4', // Cyan
    carSpecs: 'Chassi Shadow Stealth 2.0, Motor Brushless 4.0T, ESC 150A',
    driverIds: ['drv-vinicius-prado', 'drv-gustavo-pires'],
  },
];

export const SEED_DRIVERS: Driver[] = [
  {
    id: 'drv-lucas-silveira',
    name: 'Lucas Silveira',
    number: 7,
    teamId: 'nitro-rc',
    carModel: 'Nitro Predator 7',
    profile: 'Agressivo e técnico em traçados travados; mestre em ultrapassagens no limite.',
    totalWins: 1,
    totalPodiums: 2,
    bestLapTimeOverall: '21.050s',
  },
  {
    id: 'drv-pedro-santos',
    name: 'Pedro Santos',
    number: 12,
    teamId: 'nitro-rc',
    carModel: 'Nitro Firefly 12',
    profile: 'Constante, preservador de bateria e confiável em provas de resistência.',
    totalWins: 0,
    totalPodiums: 1,
    bestLapTimeOverall: '21.410s',
  },
  {
    id: 'drv-gabriel-ramos',
    name: 'Gabriel Ramos',
    number: 3,
    teamId: 'apex-racing',
    carModel: 'Apex Bullet 3',
    profile: 'Arrojado em voltas de classificação; especialista em finais dramáticos.',
    totalWins: 2,
    totalPodiums: 3,
    bestLapTimeOverall: '20.910s',
  },
  {
    id: 'drv-felipe-duarte',
    name: 'Felipe Duarte',
    number: 11,
    teamId: 'apex-racing',
    carModel: 'Apex Aero 11',
    profile: 'Ritmo sólido em trechos de alta velocidade; ótimo defensor de posições.',
    totalWins: 0,
    totalPodiums: 1,
    bestLapTimeOverall: '21.320s',
  },
  {
    id: 'drv-bruno-rocha',
    name: 'Bruno Rocha',
    number: 5,
    teamId: 'turbo-vortex',
    carModel: 'Vortex Phantom 5',
    profile: 'Líder frio e calculista; excelente gerenciamento de pneus e curvas de tração.',
    totalWins: 1,
    totalPodiums: 2,
    bestLapTimeOverall: '20.980s',
  },
  {
    id: 'drv-thiago-costa',
    name: 'Thiago Costa',
    number: 19,
    teamId: 'turbo-vortex',
    carModel: 'Vortex Cyclone 19',
    profile: 'Velocidade bruta em retas; agressividade moderada em disputas de pelotão.',
    totalWins: 0,
    totalPodiums: 0,
    bestLapTimeOverall: '21.490s',
  },
  {
    id: 'drv-rafael-silva',
    name: 'Rafael Silva',
    number: 8,
    teamId: 'lightning-bolt',
    carModel: 'Bolt Thunder 8',
    profile: 'Especialista em piso seco; aceleração precisa na saída de chicane.',
    totalWins: 0,
    totalPodiums: 1,
    bestLapTimeOverall: '21.280s',
  },
  {
    id: 'drv-marcos-souza',
    name: 'Marcos Souza',
    number: 23,
    teamId: 'lightning-bolt',
    carModel: 'Bolt Flash 23',
    profile: 'Excelente leitura de corrida e recuperação após largadas difíceis.',
    totalWins: 0,
    totalPodiums: 0,
    bestLapTimeOverall: '21.650s',
  },
  {
    id: 'drv-andre-martins',
    name: 'André Martins',
    number: 2,
    teamId: 'fusion-motorsport',
    carModel: 'Fusion Hyper 2',
    profile: 'Combativo em curvas médias; adapta-se bem a mudanças térmicas na pista.',
    totalWins: 0,
    totalPodiums: 0,
    bestLapTimeOverall: '21.520s',
  },
  {
    id: 'drv-rodrigo-lima',
    name: 'Rodrigo Lima',
    number: 14,
    teamId: 'fusion-motorsport',
    carModel: 'Fusion Pulse 14',
    profile: 'Rápido na primeira metade da prova; consistente nos tempos de volta.',
    totalWins: 0,
    totalPodiums: 0,
    bestLapTimeOverall: '21.710s',
  },
  {
    id: 'drv-vinicius-prado',
    name: 'Vinícius Prado',
    number: 9,
    teamId: 'shadow-precision',
    carModel: 'Shadow Blade 9',
    profile: 'Traçados cirúrgicos e freios tardios; foco total em eficiência aerodinâmica.',
    totalWins: 0,
    totalPodiums: 1,
    bestLapTimeOverall: '21.390s',
  },
  {
    id: 'drv-gustavo-pires',
    name: 'Gustavo Pires',
    number: 17,
    teamId: 'shadow-precision',
    carModel: 'Shadow Arrow 17',
    profile: 'Jovem talento em ascensão; agressivo na tomada de tangentes.',
    totalWins: 0,
    totalPodiums: 0,
    bestLapTimeOverall: '21.840s',
  },
];

export const SEED_RACES: Record<number, Race> = {
  1: {
    id: 'race-1',
    number: 1,
    name: 'Prova 1 — Circuito da Colina',
    circuit: 'Circuito da Colina (Fortaleza/CE)',
    date: '2026-10-10',
    totalLaps: 20,
    currentLap: 20,
    status: 'completed',
    winnerDriverId: 'drv-lucas-silveira',
    fastestLapDriverId: 'drv-lucas-silveira',
    fastestLapFormatted: '21.050s',
    highlights: 'Vitória dominante de Lucas Silveira (Nitro RC) na abertura da temporada.',
  },
  2: {
    id: 'race-2',
    number: 2,
    name: 'Prova 2 — Autódromo Lagoa Seca',
    circuit: 'Autódromo Lagoa Seca (Eusébio/CE)',
    date: '2026-10-17',
    totalLaps: 20,
    currentLap: 20,
    status: 'completed',
    winnerDriverId: 'drv-bruno-rocha',
    fastestLapDriverId: 'drv-bruno-rocha',
    fastestLapFormatted: '20.980s',
    highlights: 'Bruno Rocha (Turbo Vortex) vence de ponta a ponta com estratégia limpa de economia.',
  },
  3: {
    id: 'race-3',
    number: 3,
    name: 'Prova 3 — Arena Velocidade',
    circuit: 'Arena Velocidade (Aquiraz/CE)',
    date: '2026-10-24',
    totalLaps: 20,
    currentLap: 20,
    status: 'completed',
    winnerDriverId: 'drv-gabriel-ramos',
    fastestLapDriverId: 'drv-gabriel-ramos',
    fastestLapFormatted: '20.910s',
    highlights: 'Desfecho dramático: Gabriel Ramos ultrapassou Bruno Rocha na curva final da volta 20!',
  },
  4: {
    id: 'race-4',
    number: 4,
    name: 'Prova 4 — Circuito Urbano das Flores',
    circuit: 'Circuito Urbano das Flores (Aldeota/CE)',
    date: '2026-11-09',
    totalLaps: 20,
    currentLap: 14,
    status: 'in_progress',
    highlights: 'Etapa ao vivo: Volta 14 de 20. Lucas Silveira (Nitro RC) pressiona o 2º lugar com alerta de bateria!',
  },
  5: {
    id: 'race-5',
    number: 5,
    name: 'Prova 5 — Grande Prêmio Final dos Campeões',
    circuit: 'Super Speed Speedway (Fortaleza/CE)',
    date: '2026-11-21',
    totalLaps: 20,
    currentLap: 0,
    status: 'scheduled',
    highlights: 'Grande final com pontuação decisiva e definição matemática do campeonato.',
  },
};


export function buildDeterministicRaceResults(): Record<number, DriverRaceResult[]> {
  // Prova 1 Results (Lucas Silveira P1, Gabriel Ramos P2, Bruno Rocha P3)
  const r1Order = [
    'drv-lucas-silveira', // P1 (10 pts)
    'drv-gabriel-ramos',  // P2 (6 pts)
    'drv-bruno-rocha',    // P3 (3 pts)
    'drv-pedro-santos',   // P4 (2 pts)
    'drv-rafael-silva',   // P5 (1 pt)
    'drv-felipe-duarte',  // P6 (0)
    'drv-thiago-costa',   // P7
    'drv-vinicius-prado', // P8
    'drv-andre-martins',  // P9
    'drv-marcos-souza',   // P10
    'drv-rodrigo-lima',   // P11
    'drv-gustavo-pires',  // P12
  ];

  // Prova 2 Results (Bruno Rocha P1, Gabriel Ramos P2, Pedro Santos P3)
  const r2Order = [
    'drv-bruno-rocha',    // P1 (10 pts)
    'drv-gabriel-ramos',  // P2 (6 pts)
    'drv-pedro-santos',   // P3 (3 pts)
    'drv-lucas-silveira', // P4 (2 pts)
    'drv-vinicius-prado', // P5 (1 pt)
    'drv-felipe-duarte',  // P6
    'drv-rafael-silva',   // P7
    'drv-andre-martins',  // P8
    'drv-thiago-costa',   // P9
    'drv-marcos-souza',   // P10
    'drv-rodrigo-lima',   // P11
    'drv-gustavo-pires',  // P12
  ];

  // Prova 3 Results (Gabriel Ramos P1, Bruno Rocha P2, Lucas Silveira P3)
  // Dramatic last-lap overtake! Gabriel Ramos passed Bruno Rocha in lap 20!
  const r3Order = [
    'drv-gabriel-ramos',  // P1 (10 pts) - last lap 21.340s
    'drv-bruno-rocha',    // P2 (6 pts) - last lap 22.180s (overtaken)
    'drv-lucas-silveira', // P3 (3 pts) - last lap 21.610s
    'drv-felipe-duarte',  // P4 (2 pts)
    'drv-rafael-silva',   // P5 (1 pt)
    'drv-pedro-santos',   // P6
    'drv-vinicius-prado', // P7
    'drv-thiago-costa',   // P8
    'drv-andre-martins',  // P9
    'drv-marcos-souza',   // P10
    'drv-rodrigo-lima',   // P11
    'drv-gustavo-pires',  // P12
  ];

  // Prova 4 Current Live Standings (at lap 14):
  // 1. Gabriel Ramos (APX)
  // 2. Bruno Rocha (VRX)
  // 3. Lucas Silveira (NIT) - Pacing dropping in laps 12, 13, 14, battery warning!
  // 4. Felipe Duarte (APX)
  // 5. Rafael Silva (LTN)
  // 6. Pedro Santos (NIT)
  // 7. Vinícius Prado (SDW)
  // 8. Thiago Costa (VRX)
  // 9. André Martins (FUS)
  // 10. Marcos Souza (LTN)
  // 11. Rodrigo Lima (FUS)
  // 12. Gustavo Pires (SDW)
  const r4Order = [
    'drv-gabriel-ramos',
    'drv-bruno-rocha',
    'drv-lucas-silveira',
    'drv-felipe-duarte',
    'drv-rafael-silva',
    'drv-pedro-santos',
    'drv-vinicius-prado',
    'drv-thiago-costa',
    'drv-andre-martins',
    'drv-marcos-souza',
    'drv-rodrigo-lima',
    'drv-gustavo-pires',
  ];

  const driverMap = new Map(SEED_DRIVERS.map((d) => [d.id, d]));

  const createResultsForRace = (order: string[], raceNum: number, currentLap: number): DriverRaceResult[] => {
    return order.map((driverId, idx) => {
      const driver = driverMap.get(driverId)!;
      const position = idx + 1;
      const points = currentLap === 20 ? getOfficialPoints(position) : 0;
      const isLucas = driverId === 'drv-lucas-silveira';
      const isPedro = driverId === 'drv-pedro-santos';

      // Base time per driver
      const baseTime = 21.0 + (position * 0.12);
      const laps = [];

      for (let l = 1; l <= currentLap; l++) {
        let time = baseTime + Math.sin(l + position) * 0.25;

        // Specific scenario for Race 4: Lucas Silveira pacing drop on laps 12, 13, 14
        if (raceNum === 4 && isLucas) {
          if (l === 11) time = 21.850;
          if (l === 12) time = 22.310;
          if (l === 13) time = 22.780;
          if (l === 14) time = 23.320;
        }

        // Specific scenario for Race 3: Gabriel Ramos winning overtake on lap 20
        if (raceNum === 3) {
          if (driverId === 'drv-gabriel-ramos' && l === 20) time = 21.340;
          if (driverId === 'drv-bruno-rocha' && l === 20) time = 22.180;
        }

        const roundedTime = parseFloat(time.toFixed(3));
        laps.push({
          lapNumber: l,
          lapTimeSeconds: roundedTime,
          formattedTime: `${roundedTime.toFixed(3)}s`,
          position,
          batteryId: 'BAT-01',
        });
      }

      const totalTimeSeconds = laps.reduce((acc, curr) => acc + curr.lapTimeSeconds, 0);
      const bestLapSeconds = Math.min(...laps.map((l) => l.lapTimeSeconds));
      const lastLapSeconds = laps[laps.length - 1]?.lapTimeSeconds ?? baseTime;

      // Battery modeling
      let chargePercent = 100 - (currentLap * 4.2);
      let voltage = 7.4 - (currentLap * 0.045);
      let health: 'ideal' | 'warning' | 'critical' = 'ideal';
      let estLapsRemaining = Math.max(0, Math.floor(chargePercent / 4.2));

      if (raceNum === 4 && isLucas) {
        // Lucas: 14 laps done, warning health, 6 laps estimated remaining for 6 remaining laps of race
        chargePercent = 26;
        voltage = 6.78;
        health = 'warning';
        estLapsRemaining = 6;
      } else if (raceNum === 4 && isPedro) {
        chargePercent = 42;
        voltage = 7.02;
        health = 'ideal';
        estLapsRemaining = 10;
      }

      if (currentLap === 20) {
        chargePercent = 12;
        voltage = 6.72;
        health = 'ideal';
        estLapsRemaining = 2;
      }

      return {
        driverId,
        teamId: driver.teamId,
        position,
        lapsCompleted: currentLap,
        totalTimeSeconds: parseFloat(totalTimeSeconds.toFixed(3)),
        bestLapTimeSeconds: parseFloat(bestLapSeconds.toFixed(3)),
        bestLapFormatted: `${bestLapSeconds.toFixed(3)}s`,
        lastLapTimeSeconds: parseFloat(lastLapSeconds.toFixed(3)),
        lastLapFormatted: `${lastLapSeconds.toFixed(3)}s`,
        estimatedLapTimeSeconds: parseFloat(lastLapSeconds.toFixed(3)),
        estimatedLapFormatted: `${lastLapSeconds.toFixed(3)}s`,
        points,
        batteriesUsed: ['BAT-01'],
        activeBatteryId: 'BAT-01',
        paceStrategy: 'normal',
        batteryTelemetry: {
          batteryId: 'BAT-01',
          lapsCompleted: currentLap,
          voltage: parseFloat(voltage.toFixed(2)),
          chargePercent: Math.max(0, Math.round(chargePercent)),
          drainPerLap: 4.2,
          estimatedLapsRemaining: estLapsRemaining,
          health,
        },
        batteryHistory: {
          'BAT-01': {
            lapsCompleted: currentLap,
            finalVoltage: parseFloat(voltage.toFixed(2)),
            finalChargePercent: Math.max(0, Math.round(chargePercent)),
          },
        },
        laps,
      };
    });
  };

  return {
    1: createResultsForRace(r1Order, 1, 20),
    2: createResultsForRace(r2Order, 2, 20),
    3: createResultsForRace(r3Order, 3, 20),
    4: createResultsForRace(r4Order, 4, 14),
    5: [],
  };
}

export const SEED_TEAM_POSTS: Record<number, TeamPost[]> = {
  1: [
    {
      id: 'post-1-1',
      raceNumber: 1,
      teamId: 'nitro-rc',
      author: 'Beto Almeida',
      role: 'Técnico de Equipe',
      category: 'resultados',
      timestamp: '2026-10-10 15:35',
      lapNumber: 20,
      content: 'Grande vitória de Lucas Silveira no Circuito da Colina! Estratégia de pneus e bateria funcionou com perfeição.',
    },
    {
      id: 'post-1-2',
      raceNumber: 1,
      teamId: 'apex-racing',
      author: 'Carlos Moura',
      role: 'Chefe de Equipe',
      category: 'resultados',
      timestamp: '2026-10-10 15:40',
      lapNumber: 20,
      content: 'P2 sólido para Gabriel Ramos na abertura. O carro tem ritmo para brigar pelo título em todas as etapas.',
    },
  ],
  2: [
    {
      id: 'post-2-1',
      raceNumber: 2,
      teamId: 'turbo-vortex',
      author: 'Daniel Lima',
      role: 'Chefe de Equipe',
      category: 'resultados',
      timestamp: '2026-10-17 16:15',
      lapNumber: 20,
      content: 'Vitória impecável de Bruno Rocha em Lagoa Seca! Gerenciamento de temperatura de bateria nota 10.',
    },
  ],
  3: [
    {
      id: 'post-3-1',
      raceNumber: 3,
      teamId: 'apex-racing',
      author: 'Carlos Moura',
      role: 'Chefe de Equipe',
      category: 'acontecimentos',
      timestamp: '2026-10-24 16:20',
      lapNumber: 20,
      content: 'HISTÓRICO! Gabriel Ramos mergulhou na curva final da volta 20 e garantiu a vitória mais emocionante do ano!',
    },
    {
      id: 'post-3-2',
      raceNumber: 3,
      teamId: 'turbo-vortex',
      author: 'Daniel Lima',
      role: 'Chefe de Equipe',
      category: 'bastidores',
      timestamp: '2026-10-24 16:28',
      lapNumber: 20,
      content: 'Pronunciamento oficial: Bruno Rocha liderou 19 voltas com maestria, mas o desgaste na bateria tirou a tração na saída da última curva. Lutamos com dignidade e vamos responder na Prova 4!',
    },
    {
      id: 'post-3-3',
      raceNumber: 3,
      teamId: 'nitro-rc',
      author: 'Beto Almeida',
      role: 'Técnico de Equipe',
      category: 'resultados',
      timestamp: '2026-10-24 16:32',
      lapNumber: 20,
      content: 'Lucas Silveira no pódio em P3. Somamos pontos cruciais e mantemos a Nitro RC no topo da tabela de equipes.',
    },
  ],
  4: [
    {
      id: 'post-4-1',
      raceNumber: 4,
      teamId: 'nitro-rc',
      author: 'Beto Almeida',
      role: 'Técnico de Equipe',
      category: 'bastidores',
      timestamp: '2026-11-09 14:18',
      lapNumber: 14,
      content: 'Volta 14: Lucas está em 3º atacando o P2, mas a telemetria acusa aumento de temperatura e queda de autonomia. Avaliando orientação de poupar equipamento no rádio.',
    },
    {
      id: 'post-4-2',
      raceNumber: 4,
      teamId: 'apex-racing',
      author: 'Carlos Moura',
      role: 'Chefe de Equipe',
      category: 'acontecimentos',
      timestamp: '2026-11-09 14:20',
      lapNumber: 14,
      content: 'Gabriel Ramos lidera com autoridade no traçado urbano. Manter ritmo constante até a bandeirada.',
    },
  ],
  5: [],
};

export const SEED_RACE_EVENTS: Record<number, RaceEvent[]> = {
  1: [
    {
      id: 'ev-1-1',
      raceNumber: 1,
      lapNumber: 1,
      type: 'overtake',
      driverId: 'drv-lucas-silveira',
      teamId: 'nitro-rc',
      description: 'Lucas Silveira assume a ponta na largada contornando por fora.',
      timestamp: '14:02',
    },
    {
      id: 'ev-1-2',
      raceNumber: 1,
      lapNumber: 15,
      type: 'fastest_lap',
      driverId: 'drv-lucas-silveira',
      teamId: 'nitro-rc',
      description: 'Volta mais rápida da prova: Lucas Silveira crava 21.050s.',
      timestamp: '14:22',
    },
  ],
  2: [
    {
      id: 'ev-2-1',
      raceNumber: 2,
      lapNumber: 18,
      type: 'fastest_lap',
      driverId: 'drv-bruno-rocha',
      teamId: 'turbo-vortex',
      description: 'Volta mais rápida: Bruno Rocha crava 20.980s.',
      timestamp: '15:26',
    },
  ],
  3: [
    {
      id: 'ev-3-1',
      raceNumber: 3,
      lapNumber: 10,
      type: 'overtake',
      driverId: 'drv-gabriel-ramos',
      teamId: 'apex-racing',
      description: 'Gabriel Ramos supera Lucas Silveira e assume o 2º lugar.',
      timestamp: '16:12',
    },
    {
      id: 'ev-3-2',
      raceNumber: 3,
      lapNumber: 17,
      type: 'fastest_lap',
      driverId: 'drv-gabriel-ramos',
      teamId: 'apex-racing',
      description: 'Volta mais rápida da prova: Gabriel Ramos crava 20.910s.',
      timestamp: '16:22',
    },
    {
      id: 'ev-3-3',
      raceNumber: 3,
      lapNumber: 20,
      type: 'overtake',
      driverId: 'drv-gabriel-ramos',
      teamId: 'apex-racing',
      description: 'ULTRAPASSAGEM DECISIVA NA VOLTA 20! Gabriel Ramos ultrapassa Bruno Rocha nos metros finais!',
      timestamp: '16:26',
    },
  ],
  4: [
    {
      id: 'ev-4-1',
      raceNumber: 4,
      lapNumber: 8,
      type: 'overtake',
      driverId: 'drv-lucas-silveira',
      teamId: 'nitro-rc',
      description: 'Lucas Silveira ultrapassa Felipe Duarte e assume a 3ª posição.',
      timestamp: '14:10',
    },
    {
      id: 'ev-4-2',
      raceNumber: 4,
      lapNumber: 12,
      type: 'fastest_lap',
      driverId: 'drv-gabriel-ramos',
      teamId: 'apex-racing',
      description: 'Volta mais rápida provisória: Gabriel Ramos com 21.010s.',
      timestamp: '14:15',
    },
  ],
  5: [],
};

export function buildInitialChampionshipState(): ChampionshipState {
  return {
    teams: SEED_TEAMS,
    drivers: SEED_DRIVERS,
    races: SEED_RACES,
    raceResults: buildDeterministicRaceResults(),
    teamPosts: SEED_TEAM_POSTS,
    raceEvents: SEED_RACE_EVENTS,
    pressReleaseDrafts: {
      3: {
        raceNumber: 3,
        headline: 'Gabriel Ramos Vence Prova 3 em Final Épico na Volta 20',
        body: 'A 3ª etapa da temporada na Arena Velocidade entregou o momento mais emocionante do campeonato até aqui...',
        citedPostIds: ['post-3-1', 'post-3-2'],
        citedEventIds: ['ev-3-3'],
        lastUpdated: '2026-10-24 16:45',
      },
    },
    selectedRaceNumber: 4,
    selectedTeamId: 'nitro-rc',
    selectedPersona: 'tech_lead',
    currentView: 'dashboard',
    theme: 'dark',
    isSimulationPaused: false,
  };
}
