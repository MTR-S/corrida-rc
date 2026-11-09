import { describe, it, expect, beforeEach } from 'vitest';
import { ChampionshipStore } from './ChampionshipStore';
import { InMemoryAdapter } from './storage';

describe('ChampionshipStore (Motor Determinístico do Campeonato)', () => {
  let storage: InMemoryAdapter;
  let store: ChampionshipStore;

  beforeEach(() => {
    storage = new InMemoryAdapter();
    store = new ChampionshipStore(storage);
  });

  describe('Estado Inicial Determinístico', () => {
    it('deve inicializar com 6 equipes e 12 pilotos (exatamente 2 por equipe)', () => {
      const state = store.getState();
      expect(state.teams).toHaveLength(6);
      expect(state.drivers).toHaveLength(12);

      // Cada equipe deve ter exatamente 2 pilotos
      state.teams.forEach((team) => {
        expect(team.driverIds).toHaveLength(2);
        const driversForTeam = state.drivers.filter((d) => d.teamId === team.id);
        expect(driversForTeam).toHaveLength(2);
      });

      // Equipe Nitro RC do Técnico Beto deve existir
      const nitroTeam = state.teams.find((t) => t.id === 'nitro-rc' || t.name === 'Nitro RC');
      expect(nitroTeam).toBeDefined();
      expect(nitroTeam?.teamPrincipal).toContain('Beto');
    });

    it('deve inicializar com 5 Provas com status coerentes (1 a 3 Concluídas, 4 Ao Vivo, 5 Agendada)', () => {
      const state = store.getState();
      expect(Object.keys(state.races)).toHaveLength(5);

      expect(state.races[1].status).toBe('completed');
      expect(state.races[1].currentLap).toBe(20);

      expect(state.races[2].status).toBe('completed');
      expect(state.races[2].currentLap).toBe(20);

      expect(state.races[3].status).toBe('completed');
      expect(state.races[3].currentLap).toBe(20);

      expect(state.races[4].status).toBe('in_progress');
      expect(state.races[4].currentLap).toBe(14);
      expect(state.races[4].totalLaps).toBe(20);

      expect(state.races[5].status).toBe('scheduled');
      expect(state.races[5].currentLap).toBe(0);
    });

    it('deve reproduzir na Prova 4 o cenário do Técnico Beto (Lucas Silveira em 3º, queda de ritmo e alerta de bateria)', () => {
      const state = store.getState();
      const race4Results = state.raceResults[4];
      expect(race4Results).toBeDefined();

      const lucasResult = race4Results.find((r) => r.driverId === 'drv-lucas-silveira');
      expect(lucasResult).toBeDefined();
      expect(lucasResult?.position).toBe(3);
      expect(lucasResult?.batteryTelemetry.health).toBe('warning');

      // Últimas voltas devem demonstrar queda de ritmo (ex: tempos aumentando)
      const laps = lucasResult?.laps || [];
      expect(laps.length).toBeGreaterThanOrEqual(14);
      const lap12 = laps[11].lapTimeSeconds;
      const lap13 = laps[12].lapTimeSeconds;
      const lap14 = laps[13].lapTimeSeconds;
      expect(lap14).toBeGreaterThan(lap13);
      expect(lap13).toBeGreaterThan(lap12);
    });

    it('deve reproduzir na Prova 3 o desfecho dramático na última volta e o feed com pronunciamento da equipe derrotada', () => {
      const state = store.getState();
      const race3 = state.races[3];
      expect(race3.status).toBe('completed');

      // Vencedor da Prova 3 com tempo da última volta registrado
      const race3Results = state.raceResults[3];
      const winner = race3Results.find((r) => r.position === 1);
      expect(winner).toBeDefined();
      expect(winner?.lastLapTimeSeconds).toBeDefined();
      expect(winner?.lastLapFormatted).toBeDefined();

      // Evento de ultrapassagem na volta 20
      const events = state.raceEvents[3] || [];
      const decisiveOvertake = events.find((e) => e.lapNumber === 20 && e.type === 'overtake');
      expect(decisiveOvertake).toBeDefined();

      // Post da equipe derrotada na Prova 3
      const posts = state.teamPosts[3] || [];
      expect(posts.length).toBeGreaterThan(0);
      const statement = posts.find((p) => p.category === 'bastidores' || p.category === 'resultados');
      expect(statement).toBeDefined();
    });
  });

  describe('Regras de Pontuação e Classificação Geral', () => {
    it('deve aplicar estritamente a pontuação oficial: 10, 6, 3, 2, 1, 0', () => {
      expect(store.getOfficialPoints(1)).toBe(10);
      expect(store.getOfficialPoints(2)).toBe(6);
      expect(store.getOfficialPoints(3)).toBe(3);
      expect(store.getOfficialPoints(4)).toBe(2);
      expect(store.getOfficialPoints(5)).toBe(1);
      expect(store.getOfficialPoints(6)).toBe(0);
      expect(store.getOfficialPoints(12)).toBe(0);
    });

    it('deve calcular a pontuação da equipe como a soma exata dos pontos de seus dois pilotos', () => {
      const teamStandings = store.getTeamStandings(3);
      teamStandings.forEach((ts) => {
        const sumOfDrivers = ts.driverScores.reduce((acc, curr) => acc + curr.points, 0);
        expect(ts.totalPoints).toBe(sumOfDrivers);
      });
    });

    it('deve filtrar a Classificação Geral acumulada até a Prova N', () => {
      const afterR1 = store.getDriverStandings(1);
      const afterR2 = store.getDriverStandings(2);
      const afterR3 = store.getDriverStandings(3);

      expect(afterR1[0].totalPoints).toBeLessThanOrEqual(10);
      expect(afterR2[0].totalPoints).toBeLessThanOrEqual(20);
      expect(afterR3[0].totalPoints).toBeLessThanOrEqual(30);

      // Verificação de que os pontos por prova correspondem
      const leaderR3 = afterR3[0];
      const calculatedSum = (leaderR3.pointsByRace[1] || 0) + (leaderR3.pointsByRace[2] || 0) + (leaderR3.pointsByRace[3] || 0);
      expect(leaderR3.totalPoints).toBe(calculatedSum);
    });

    it('deve calcular corretamente o Gap para o Líder e Gap para o Competidor Anterior', () => {
      const standings = store.getDriverStandings(3);
      expect(standings[0].gapToLeader).toBe(0);
      expect(standings[0].gapToAhead).toBe(0);

      for (let i = 1; i < standings.length; i++) {
        expect(standings[i].gapToLeader).toBe(standings[0].totalPoints - standings[i].totalPoints);
        expect(standings[i].gapToAhead).toBe(standings[i - 1].totalPoints - standings[i].totalPoints);
      }
    });

    it('deve calcular corretamente o Gap para o Líder e Gap Anterior na classificação de equipes', () => {
      const teamStandings = store.getTeamStandings(3);
      expect(teamStandings[0].gapToLeader).toBe(0);
      expect(teamStandings[0].gapToAhead).toBe(0);

      for (let i = 1; i < teamStandings.length; i++) {
        expect(teamStandings[i].gapToLeader).toBe(teamStandings[0].totalPoints - teamStandings[i].totalPoints);
        expect(teamStandings[i].gapToAhead).toBe(teamStandings[i - 1].totalPoints - teamStandings[i].totalPoints);
      }
    });
  });

  describe('Telemetria, Estratégia de Ritmo e Troca de Bateria (Pit Stop)', () => {
    it('deve atualizar o consumo e telemetria de bateria ao alterar a estratégia de ritmo', () => {
      store.setPaceStrategy(4, 'drv-lucas-silveira', 'save_battery');
      const lucas = store.getState().raceResults[4].find((r) => r.driverId === 'drv-lucas-silveira');
      expect(lucas?.paceStrategy).toBe('save_battery');
      expect(lucas?.batteryTelemetry.drainPerLap).toBe(3.2);

      store.setPaceStrategy(4, 'drv-lucas-silveira', 'attack');
      const lucasAttack = store.getState().raceResults[4].find((r) => r.driverId === 'drv-lucas-silveira');
      expect(lucasAttack?.paceStrategy).toBe('attack');
      expect(lucasAttack?.batteryTelemetry.drainPerLap).toBe(5.5);
    });

    it('deve executar pit stop substituindo a bateria por uma nova com penalidade de tempo e registrar histórico', () => {
      const lucasBefore = store.getState().raceResults[4].find((r) => r.driverId === 'drv-lucas-silveira')!;
      const timeBefore = lucasBefore.totalTimeSeconds;
      const initialEventsCount = (store.getState().raceEvents[4] || []).length;

      store.performPitStop(4, 'drv-lucas-silveira');

      const lucasAfter = store.getState().raceResults[4].find((r) => r.driverId === 'drv-lucas-silveira')!;
      expect(lucasAfter.activeBatteryId).toBe('BAT-02');
      expect(lucasAfter.batteriesUsed).toContain('BAT-02');
      expect(lucasAfter.batteryTelemetry.chargePercent).toBe(100);
      expect(lucasAfter.batteryTelemetry.voltage).toBe(7.4);
      expect(lucasAfter.batteryTelemetry.health).toBe('ideal');

      // Penalidade de tempo de box adicionada ao tempo total conforme regulamento
      expect(lucasAfter.totalTimeSeconds).toBeGreaterThan(timeBefore);

      // Histórico da bateria anterior preservado
      expect(lucasAfter.batteryHistory['BAT-01']).toBeDefined();
      expect(lucasAfter.batteryHistory['BAT-01'].lapsCompleted).toBe(lucasBefore.batteryTelemetry.lapsCompleted);

      // Evento de box adicionado à corrida
      const eventsAfter = store.getState().raceEvents[4] || [];
      expect(eventsAfter.length).toBe(initialEventsCount + 1);
      const pitEvent = eventsAfter[eventsAfter.length - 1];
      expect(pitEvent.type).toBe('pit_stop');
      expect(pitEvent.driverId).toBe('drv-lucas-silveira');

      // Deve ser possível desfazer o pit stop
      expect(store.canUndo()).toBe(true);
      store.undo();
      const lucasReverted = store.getState().raceResults[4].find((r) => r.driverId === 'drv-lucas-silveira')!;
      expect(lucasReverted.activeBatteryId).toBe('BAT-01');
    });

    it('deve recalcular o ritmo estimado e a projeção de autonomia até a Volta 20 ao alterar a Estratégia de Ritmo', () => {
      const initialLucas = store.getState().raceResults[4].find((r) => r.driverId === 'drv-lucas-silveira')!;
      expect(initialLucas.paceStrategy).toBe('normal');
      expect(initialLucas.batteryTelemetry.health).toBe('warning');
      expect(initialLucas.batteryTelemetry.estimatedLapsRemaining).toBe(6);

      // Mudar para Poupar Bateria: 26% / 3.2 = 8 voltas estimadas (>= 6 voltas restantes -> Ideal)
      store.setPaceStrategy(4, 'drv-lucas-silveira', 'save_battery');
      const savedLucas = store.getState().raceResults[4].find((r) => r.driverId === 'drv-lucas-silveira')!;
      expect(savedLucas.paceStrategy).toBe('save_battery');
      expect(savedLucas.batteryTelemetry.estimatedLapsRemaining).toBe(8);
      expect(savedLucas.batteryTelemetry.health).toBe('ideal');
      expect(savedLucas.estimatedLapTimeSeconds).toBeGreaterThan(initialLucas.lastLapTimeSeconds);

      // Mudar para Ataque: 26% / 5.5 = 4 voltas estimadas (< 6 voltas restantes)
      store.setPaceStrategy(4, 'drv-lucas-silveira', 'attack');
      const attackLucas = store.getState().raceResults[4].find((r) => r.driverId === 'drv-lucas-silveira')!;
      expect(attackLucas.paceStrategy).toBe('attack');
      expect(attackLucas.batteryTelemetry.estimatedLapsRemaining).toBe(4);
      expect(attackLucas.batteryTelemetry.health).toBe('warning');
      expect(attackLucas.estimatedLapTimeSeconds).toBeLessThan(initialLucas.lastLapTimeSeconds);
    });

    it('deve avançar uma volta na simulação da Prova 4 sob controle explícito e permitir desfazer', () => {
      expect(store.getState().races[4].currentLap).toBe(14);

      const advanced = store.advanceSimulationLap(4);
      expect(advanced).toBe(true);
      expect(store.getState().races[4].currentLap).toBe(15);

      const lucasAfter = store.getState().raceResults[4].find((r) => r.driverId === 'drv-lucas-silveira')!;
      expect(lucasAfter.lapsCompleted).toBe(15);
      expect(lucasAfter.laps).toHaveLength(15);
      expect(lucasAfter.batteryTelemetry.lapsCompleted).toBe(15);
      expect(lucasAfter.batteryTelemetry.chargePercent).toBeLessThan(26);

      // Desfazer avanço de volta
      store.undo();
      expect(store.getState().races[4].currentLap).toBe(14);
      const lucasReverted = store.getState().raceResults[4].find((r) => r.driverId === 'drv-lucas-silveira')!;
      expect(lucasReverted.lapsCompleted).toBe(14);
    });
  });

  describe('Regras do Feed e Cota de 4 Publicações', () => {
    it('deve controlar cota e bloquear a 5ª publicação da mesma equipe na mesma Prova', () => {
      const quotaBefore = store.getTeamPostQuota(4, 'nitro-rc');
      expect(quotaBefore.max).toBe(4);

      // Adicionar publicações até atingir o limite de 4
      while (store.getTeamPostQuota(4, 'nitro-rc').used < 4) {
        const res = store.addTeamPost({
          raceNumber: 4,
          teamId: 'nitro-rc',
          author: 'Beto Almeida',
          role: 'Técnico de Equipe',
          category: 'bastidores',
          lapNumber: 14,
          content: 'Nova atualização de box.',
        });
        expect(res.success).toBe(true);
      }

      const quotaFull = store.getTeamPostQuota(4, 'nitro-rc');
      expect(quotaFull.used).toBe(4);
      expect(quotaFull.canPost).toBe(false);

      // Tentar a 5ª publicação deve falhar preventivamente
      const blockedRes = store.addTeamPost({
        raceNumber: 4,
        teamId: 'nitro-rc',
        author: 'Beto Almeida',
        role: 'Técnico de Equipe',
        category: 'bastidores',
        lapNumber: 14,
        content: 'Tentativa de 5ª publicação excedendo o regulamento.',
      });

      expect(blockedRes.success).toBe(false);
      expect(blockedRes.error).toContain('limite');
    });
  });

  describe('Controle do Usuário, Desfazer (Undo) e Restauração da Avaliação', () => {
    it('deve desfazer a última mutação realizada no estado', () => {
      const initialQuota = store.getTeamPostQuota(4, 'nitro-rc').used;
      store.addTeamPost({
        raceNumber: 4,
        teamId: 'nitro-rc',
        author: 'Beto',
        role: 'Técnico',
        category: 'pilotos',
        lapNumber: 14,
        content: 'Teste de post para desfazer.',
      });

      expect(store.getTeamPostQuota(4, 'nitro-rc').used).toBe(initialQuota + 1);
      expect(store.canUndo()).toBe(true);

      const undoResult = store.undo();
      expect(undoResult).toBe(true);
      expect(store.getTeamPostQuota(4, 'nitro-rc').used).toBe(initialQuota);
    });

    it('deve restaurar 100% do estado determinístico original ao acionar reset', () => {
      // Modificar algo
      store.selectRace(2);
      store.setPaceStrategy(4, 'drv-lucas-silveira', 'attack');
      store.selectPersona('reporter');

      // Executar reset
      store.resetToDeterministicSeed();

      const state = store.getState();
      expect(state.selectedRaceNumber).toBe(4);
      expect(state.selectedPersona).toBe('tech_lead');
      const lucas = state.raceResults[4].find((r) => r.driverId === 'drv-lucas-silveira');
      expect(lucas?.paceStrategy).toBe('normal');
    });

    it('deve persistir dados no StorageAdapter e recuperar estado em nova instância do store', () => {
      store.selectRace(3);
      store.setTheme('light');

      // Criar nova instância com o mesmo adapter
      const reloadedStore = new ChampionshipStore(storage);
      expect(reloadedStore.getState().selectedRaceNumber).toBe(3);
      expect(reloadedStore.getState().theme).toBe('light');
    });
  });
});
