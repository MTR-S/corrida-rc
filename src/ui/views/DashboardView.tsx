import React from 'react';
import {
  Wrench,
  Play,
  Pause,
  FastForward,
  Undo2,
  Trophy,
  TrendingDown,
  RefreshCw,
  Timer,
  Users,
} from 'lucide-react';
import { ChampionshipStore } from '../../domain/ChampionshipStore';
import { PaceStrategy } from '../../domain/types';
import { DriverTelemetryCard, formatDeltaSeconds } from '../components/DriverTelemetryCard';

interface DashboardViewProps {
  store: ChampionshipStore;
  onShowToast: (msg: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ store, onShowToast }) => {
  const state = store.getState();
  const raceNumber = state.selectedRaceNumber;
  const race = state.races[raceNumber];
  const selectedTeam = state.teams.find((t) => t.id === state.selectedTeamId) || state.teams[0];
  const raceResults = state.raceResults[raceNumber] || [];

  const [driverAId, driverBId] = selectedTeam.driverIds;
  const driverA = state.drivers.find((d) => d.id === driverAId)!;
  const driverB = state.drivers.find((d) => d.id === driverBId)!;
  const resultA = raceResults.find((r) => r.driverId === driverAId);
  const resultB = raceResults.find((r) => r.driverId === driverBId);

  const standingsUpToRace = race?.status === 'completed' ? raceNumber : Math.min(raceNumber - 1, 3);
  const effectiveStandingsRace = Math.max(1, standingsUpToRace);
  const teamStandings = store.getTeamStandings(effectiveStandingsRace);
  const driverStandings = store.getDriverStandings(effectiveStandingsRace);

  const selectedTeamStanding = teamStandings.find((ts) => ts.teamId === selectedTeam.id);
  const driverAStanding = driverStandings.find((ds) => ds.driverId === driverA.id);
  const driverBStanding = driverStandings.find((ds) => ds.driverId === driverB.id);

  const projectedPointsA = resultA ? store.getOfficialPoints(resultA.position) : 0;
  const projectedPointsB = resultB ? store.getOfficialPoints(resultB.position) : 0;
  const projectedTeamPoints = projectedPointsA + projectedPointsB;

  const isDriverAFastestOfDuo =
    resultA !== undefined &&
    resultB !== undefined &&
    resultA.bestLapTimeSeconds <= resultB.bestLapTimeSeconds;
  const isDriverBFastestOfDuo =
    resultA !== undefined &&
    resultB !== undefined &&
    resultB.bestLapTimeSeconds < resultA.bestLapTimeSeconds;
  const fastestDriverOfDuo = isDriverAFastestOfDuo ? driverA : isDriverBFastestOfDuo ? driverB : null;
  const fastestResultOfDuo = isDriverAFastestOfDuo ? resultA : isDriverBFastestOfDuo ? resultB : null;

  const handleStrategyChange = (driverId: string, strategy: PaceStrategy) => {
    store.setPaceStrategy(raceNumber, driverId, strategy);
    const drv = state.drivers.find((d) => d.id === driverId);
    const stratName =
      strategy === 'attack' ? 'Ataque' : strategy === 'save_battery' ? 'Poupar Bateria' : 'Normal';
    onShowToast(`Estratégia de ${drv?.name ?? 'Piloto'} alterada para ${stratName}.`);
  };

  const handleAdvanceLap = () => {
    const advanced = store.advanceSimulationLap(raceNumber);
    if (advanced) {
      const updatedRace = store.getState().races[raceNumber];
      onShowToast(
        updatedRace.status === 'completed'
          ? `Volta ${updatedRace.currentLap}/20 concluída! Bandeirada final na Prova ${raceNumber}!`
          : `Simulação avançou para a Volta ${updatedRace.currentLap}/${updatedRace.totalLaps}.`
      );
    }
  };

  const handleUndo = () => {
    if (store.canUndo()) {
      store.undo();
      onShowToast('Última ação desfeita com sucesso.');
    }
  };

  const lapsA = resultA?.laps || [];
  const lapsB = resultB?.laps || [];
  const maxLapCount = Math.max(lapsA.length, lapsB.length);

  return (
    <div className="space-y-6">
      {/* Banner de Contexto do Técnico de Equipe + Seletor de Equipe + Controles de Simulação */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="p-2.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 flex-wrap">
              <span>Painel Estratégico — {selectedTeam.teamPrincipal}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-semibold">
                {selectedTeam.name} ({selectedTeam.shortCode})
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Alta densidade informacional e leitura instantânea (&lt; 5 segundos) da dupla de pilotos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Seletor das 6 Equipes */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-700">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <label htmlFor="team-selector" className="text-xs font-semibold text-slate-300">
              Inspecionar Equipe:
            </label>
            <select
              id="team-selector"
              aria-label="Selecionar Equipe no Painel Estratégico"
              value={selectedTeam.id}
              onChange={(e) => {
                const newTeamId = e.target.value;
                store.selectTeam(newTeamId);
                const t = state.teams.find((tm) => tm.id === newTeamId);
                onShowToast(`Equipe ${t?.name ?? newTeamId} selecionada no painel estratégico.`);
              }}
              className="bg-slate-800 text-slate-100 text-xs font-bold px-2 py-1 rounded border border-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-400"
            >
              {state.teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name} ({team.shortCode})
                </option>
              ))}
            </select>
          </div>

          {/* Controles de Simulação Ao Vivo na Prova 4 */}
          {race?.status === 'in_progress' && (
            <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-lg border border-amber-500/40 flex-wrap">
              <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full bg-amber-400 ${
                    state.isSimulationPaused ? '' : 'animate-ping'
                  }`}
                />
                Simulação Prova {race.number} (Volta {race.currentLap}/{race.totalLaps}):
              </span>
              <button
                onClick={() => {
                  store.toggleSimulation();
                  onShowToast(
                    state.isSimulationPaused ? 'Simulação retomada.' : 'Simulação pausada.'
                  );
                }}
                aria-label={
                  state.isSimulationPaused
                    ? 'Retomar simulação (Atalho: Espaço)'
                    : 'Pausar simulação (Atalho: Espaço)'
                }
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition"
              >
                {state.isSimulationPaused ? (
                  <Play className="w-3.5 h-3.5" />
                ) : (
                  <Pause className="w-3.5 h-3.5" />
                )}
                <span>{state.isSimulationPaused ? 'Retomar (Espaço)' : 'Pausar (Espaço)'}</span>
              </button>

              <button
                onClick={handleAdvanceLap}
                disabled={race.currentLap >= race.totalLaps}
                aria-label="Avançar uma Volta na simulação"
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold transition"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Avançar Volta (+1v)</span>
              </button>

              {store.canUndo() && (
                <button
                  onClick={handleUndo}
                  aria-label="Desfazer última ação estratégica"
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/40 text-xs font-semibold transition"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Desfazer</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cartão de Pontuação da Equipe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400 uppercase font-semibold">Equipe Selecionada</span>
          <div className="text-xl font-black text-slate-100 mt-1 flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: selectedTeam.color }}
            />
            <span>{selectedTeam.name}</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Técnico/Chefe: {selectedTeam.teamPrincipal}
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400 uppercase font-semibold">
            Pontos Acumulados na Classificação Geral
          </span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {selectedTeamStanding?.totalPoints ?? 0} pts
          </div>
          <div className="text-xs text-slate-300 mt-1 font-medium">
            {driverA.name}: {driverAStanding?.totalPoints ?? 0} pts + {driverB.name}:{' '}
            {driverBStanding?.totalPoints ?? 0} pts
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Posição Geral: {selectedTeamStanding?.position ?? 1}º lugar (soma exata da dupla)
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400 uppercase font-semibold">
            Pontos Projetados Nesta Prova (Regra 10-6-3-2-1-0)
          </span>
          <div className="text-2xl font-black text-sky-400 mt-1">
            +{projectedTeamPoints} pts{' '}
            <span className="text-xs font-normal text-slate-400">
              (Total Projetado: {(selectedTeamStanding?.totalPoints ?? 0) + projectedTeamPoints} pts)
            </span>
          </div>
          <div className="text-xs text-slate-300 mt-1 font-medium">
            {driverA.name}: P{resultA?.position ?? '—'} ({projectedPointsA} pts) • {driverB.name}: P
            {resultB?.position ?? '—'} ({projectedPointsB} pts)
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Regulamento Oficial: 1º=10, 2º=6, 3º=3, 4º=2, 5º=1, 6º-12º=0
          </div>
        </div>
      </div>

      {/* Comparativo Lado a Lado dos Dois Pilotos da Equipe */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DriverTelemetryCard
          driver={driverA}
          result={resultA}
          teammateResult={resultB}
          race={race}
          badgeBgColor="bg-red-600"
          isFastestOfDuo={isDriverAFastestOfDuo}
          onStrategyChange={handleStrategyChange}
        />

        <DriverTelemetryCard
          driver={driverB}
          result={resultB}
          teammateResult={resultA}
          race={race}
          badgeBgColor="bg-red-800"
          isFastestOfDuo={isDriverBFastestOfDuo}
          onStrategyChange={handleStrategyChange}
        />
      </div>

      {/* Histórico Comparativo de Voltas Pareado */}
      <section className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Timer className="w-4 h-4 text-sky-400" />
              <span>
                Histórico Comparativo Volta a Volta — {driverA.name} vs {driverB.name} ({race?.name})
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparação pareada de todas as voltas realizadas, destacando melhor volta, queda de ritmo e troca de bateria.
            </p>
          </div>

          {fastestDriverOfDuo && fastestResultOfDuo && (
            <div
              data-testid="duo-fastest-lap-summary"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-700/80 text-xs text-emerald-300"
            >
              <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Melhor volta da dupla nesta prova:{' '}
                <strong>
                  {fastestDriverOfDuo.name} (#{fastestDriverOfDuo.number})
                </strong>{' '}
                com <strong className="font-mono">{fastestResultOfDuo.bestLapFormatted}</strong>
              </span>
            </div>
          )}
        </div>

        {maxLapCount === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-900/50 rounded-lg border border-slate-800">
            Nenhuma volta registrada para esta prova ({race?.status === 'scheduled' ? 'Prova Agendada' : 'Sem dados'}).
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              aria-label="Tabela Comparativa de Voltas da Dupla"
              className="w-full text-left text-xs"
            >
              <thead className="bg-slate-900/90 text-slate-300 uppercase tracking-wider text-[11px] border-b border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Volta</th>
                  <th className="py-2.5 px-3">
                    #{driverA.number} {driverA.name}
                  </th>
                  <th className="py-2.5 px-3">Destaques {driverA.name.split(' ')[0]}</th>
                  <th className="py-2.5 px-3">
                    #{driverB.number} {driverB.name}
                  </th>
                  <th className="py-2.5 px-3">Destaques {driverB.name.split(' ')[0]}</th>
                  <th className="py-2.5 px-3 text-right">
                    Delta ({driverA.name.split(' ')[0]} vs {driverB.name.split(' ')[0]})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-medium">
                {Array.from({ length: maxLapCount }, (_, idx) => {
                  const lapA = lapsA[idx];
                  const lapB = lapsB[idx];
                  const prevLapA = idx > 0 ? lapsA[idx - 1] : undefined;
                  const prevLapB = idx > 0 ? lapsB[idx - 1] : undefined;
                  const lapNum = lapA?.lapNumber ?? lapB?.lapNumber ?? idx + 1;

                  const isBestA =
                    lapA !== undefined &&
                    resultA !== undefined &&
                    Math.abs(lapA.lapTimeSeconds - resultA.bestLapTimeSeconds) < 0.0005;
                  const isBestB =
                    lapB !== undefined &&
                    resultB !== undefined &&
                    Math.abs(lapB.lapTimeSeconds - resultB.bestLapTimeSeconds) < 0.0005;

                  const isDropA =
                    lapA !== undefined &&
                    prevLapA !== undefined &&
                    lapA.lapTimeSeconds - prevLapA.lapTimeSeconds >= 0.35;
                  const isDropB =
                    lapB !== undefined &&
                    prevLapB !== undefined &&
                    lapB.lapTimeSeconds - prevLapB.lapTimeSeconds >= 0.35;

                  const isPitA =
                    lapA?.isPitStop ||
                    (prevLapA !== undefined && lapA !== undefined && lapA.batteryId !== prevLapA.batteryId);
                  const isPitB =
                    lapB?.isPitStop ||
                    (prevLapB !== undefined && lapB !== undefined && lapB.batteryId !== prevLapB.batteryId);

                  const deltaVal =
                    lapA && lapB ? lapA.lapTimeSeconds - lapB.lapTimeSeconds : null;
                  const deltaFormatted = formatDeltaSeconds(
                    lapA?.lapTimeSeconds,
                    lapB?.lapTimeSeconds
                  );

                  return (
                    <tr key={lapNum} className="hover:bg-slate-700/30 transition">
                      <td className="py-2 px-3 font-mono font-bold text-slate-300">V{lapNum}</td>
                      <td className="py-2 px-3 font-mono text-slate-100">
                        {lapA ? (
                          <span>
                            {lapA.formattedTime}{' '}
                            <span className="text-[10px] text-slate-400">(P{lapA.position})</span>
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex flex-wrap gap-1">
                          {isBestA && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold">
                              <Trophy className="w-3 h-3 text-emerald-400" /> Melhor Volta
                            </span>
                          )}
                          {isDropA && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700 text-[10px] font-bold">
                              <TrendingDown className="w-3 h-3 text-amber-400" /> Queda de Ritmo
                            </span>
                          )}
                          {isPitA && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-700 text-[10px] font-bold">
                              <RefreshCw className="w-3 h-3 text-sky-400" /> Troca de Bateria
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-100">
                        {lapB ? (
                          <span>
                            {lapB.formattedTime}{' '}
                            <span className="text-[10px] text-slate-400">(P{lapB.position})</span>
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex flex-wrap gap-1">
                          {isBestB && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold">
                              <Trophy className="w-3 h-3 text-emerald-400" /> Melhor Volta
                            </span>
                          )}
                          {isDropB && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700 text-[10px] font-bold">
                              <TrendingDown className="w-3 h-3 text-amber-400" /> Queda de Ritmo
                            </span>
                          )}
                          {isPitB && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-700 text-[10px] font-bold">
                              <RefreshCw className="w-3 h-3 text-sky-400" /> Troca de Bateria
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        className={`py-2 px-3 text-right font-mono font-bold ${
                          deltaVal !== null && deltaVal < 0
                            ? 'text-emerald-400'
                            : deltaVal !== null && deltaVal > 0
                            ? 'text-amber-300'
                            : 'text-slate-400'
                        }`}
                      >
                        {deltaFormatted}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
