import React from 'react';
import {
  Wrench,
  Gauge,
  Zap,
  Play,
  Pause,
} from 'lucide-react';
import { ChampionshipStore } from '../../domain/ChampionshipStore';
import { BatteryHealthBadge } from '../components/SemanticBadge';

interface DashboardViewProps {
  store: ChampionshipStore;
  onShowToast: (msg: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ store, onShowToast }) => {
  const state = store.getState();
  const raceNumber = state.selectedRaceNumber;
  const race = state.races[raceNumber];
  const nitroTeam = state.teams.find((t) => t.id === 'nitro-rc')!;
  const raceResults = state.raceResults[raceNumber] || [];

  const lucasResult = raceResults.find((r) => r.driverId === 'drv-lucas-silveira');
  const pedroResult = raceResults.find((r) => r.driverId === 'drv-pedro-santos');
  const lucasDriver = state.drivers.find((d) => d.id === 'drv-lucas-silveira')!;
  const pedroDriver = state.drivers.find((d) => d.id === 'drv-pedro-santos')!;

  const teamStandings = store.getTeamStandings(raceNumber <= 3 ? raceNumber : 3);
  const nitroStanding = teamStandings.find((ts) => ts.teamId === 'nitro-rc');

  // Compute last 3 laps average
  const getLast3LapsAvg = (laps: any[]) => {
    if (!laps || laps.length === 0) return '—';
    const recent = laps.slice(-3);
    const avg = recent.reduce((acc, curr) => acc + curr.lapTimeSeconds, 0) / recent.length;
    return `${avg.toFixed(3)}s`;
  };

  const handleStrategyChange = (driverId: string, strategy: 'attack' | 'normal' | 'save_battery') => {
    store.setPaceStrategy(raceNumber, driverId, strategy);
    const driverName = driverId === 'drv-lucas-silveira' ? 'Lucas Silveira' : 'Pedro Santos';
    const stratName = strategy === 'attack' ? 'Ataque' : strategy === 'save_battery' ? 'Poupar Bateria' : 'Normal';
    onShowToast(`Estratégia de ${driverName} alterada para ${stratName}.`);
  };

  return (
    <div className="space-y-6">
      {/* Banner de Contexto do Técnico Beto */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Painel Estratégico — Beto Almeida</span>
              <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-semibold">
                Nitro RC
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Alta densidade informacional e leitura instantânea (&lt; 5 segundos) da dupla de pilotos.
            </p>
          </div>
        </div>

        {/* Live Simulation Controls for Race 4 */}
        {race?.status === 'in_progress' && (
          <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-lg border border-amber-500/40">
            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Simulação Prova 4 (Volta {race.currentLap}/20):
            </span>
            <button
              onClick={() => {
                store.toggleSimulation();
                onShowToast(state.isSimulationPaused ? 'Simulação retomada.' : 'Simulação pausada.');
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition"
            >
              {state.isSimulationPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{state.isSimulationPaused ? 'Retomar' : 'Pausar'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Cartão de Pontuação da Equipe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400 uppercase font-semibold">Equipe</span>
          <div className="text-xl font-black text-slate-100 mt-1">{nitroTeam.name}</div>
          <div className="text-xs text-slate-400 mt-1">{nitroTeam.teamPrincipal}</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400 uppercase font-semibold">Pontos Acumulados no Campeonato</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {nitroStanding?.totalPoints ?? 0} pts
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Posição: {nitroStanding?.position ?? 1}º lugar geral (soma de Lucas + Pedro)
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-400 uppercase font-semibold">Pontos Projetados Nesta Prova</span>
          <div className="text-2xl font-black text-sky-400 mt-1">
            {(lucasResult ? store.getOfficialPoints(lucasResult.position) : 0) +
              (pedroResult ? store.getOfficialPoints(pedroResult.position) : 0)}{' '}
            pts
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Lucas: P{lucasResult?.position} ({lucasResult ? store.getOfficialPoints(lucasResult.position) : 0}p) • Pedro: P{pedroResult?.position} ({pedroResult ? store.getOfficialPoints(pedroResult.position) : 0}p)
          </div>
        </div>
      </div>

      {/* Comparativo Lado a Lado dos Dois Pilotos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Piloto A: Lucas Silveira */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                  #{lucasDriver.number}
                </span>
                <h3 className="text-base font-bold text-slate-100">{lucasDriver.name}</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{lucasDriver.carModel}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Posição Atual</span>
              <div className="text-2xl font-black text-sky-400">
                P{lucasResult?.position ?? '—'}
              </div>
            </div>
          </div>

          {/* Telemetria de Voltas */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 block text-[11px]">Última Volta</span>
              <span className="text-sm font-bold text-slate-200 mt-0.5 block">
                {lucasResult?.lastLapFormatted ?? '—'}
              </span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 block text-[11px]">Média Últimas 3v</span>
              <span className="text-sm font-bold text-amber-300 mt-0.5 block">
                {getLast3LapsAvg(lucasResult?.laps ?? [])}
              </span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 block text-[11px]">Melhor Volta</span>
              <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                {lucasResult?.bestLapFormatted ?? '—'}
              </span>
            </div>
          </div>

          {/* Autonomia da Bateria */}
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Bateria Ativa ({lucasResult?.activeBatteryId})
              </span>
              {lucasResult && (
                <BatteryHealthBadge
                  health={lucasResult.batteryTelemetry.health}
                  showLaps
                  lapsRemaining={lucasResult.batteryTelemetry.estimatedLapsRemaining}
                />
              )}
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all ${
                  lucasResult?.batteryTelemetry.health === 'ideal'
                    ? 'bg-emerald-500'
                    : lucasResult?.batteryTelemetry.health === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${lucasResult?.batteryTelemetry.chargePercent ?? 0}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Carga: {lucasResult?.batteryTelemetry.chargePercent}%</span>
              <span>Tensão: {lucasResult?.batteryTelemetry.voltage}V</span>
              <span>Voltas feiras: {lucasResult?.batteryTelemetry.lapsCompleted}</span>
            </div>
          </div>

          {/* Seletor de Ritmo (Interativo) */}
          {race?.status === 'in_progress' && (
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-sky-400" />
                Estratégia de Ritmo:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleStrategyChange('drv-lucas-silveira', 'attack')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition border ${
                    lucasResult?.paceStrategy === 'attack'
                      ? 'bg-rose-600 text-white border-rose-400 shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  Ataque
                </button>
                <button
                  onClick={() => handleStrategyChange('drv-lucas-silveira', 'normal')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition border ${
                    lucasResult?.paceStrategy === 'normal'
                      ? 'bg-sky-600 text-white border-sky-400 shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => handleStrategyChange('drv-lucas-silveira', 'save_battery')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition border ${
                    lucasResult?.paceStrategy === 'save_battery'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  Poupar Bateria
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Piloto B: Pedro Santos */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-800 text-white font-bold text-xs flex items-center justify-center">
                  #{pedroDriver.number}
                </span>
                <h3 className="text-base font-bold text-slate-100">{pedroDriver.name}</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{pedroDriver.carModel}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Posição Atual</span>
              <div className="text-2xl font-black text-sky-400">
                P{pedroResult?.position ?? '—'}
              </div>
            </div>
          </div>

          {/* Telemetria de Voltas */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 block text-[11px]">Última Volta</span>
              <span className="text-sm font-bold text-slate-200 mt-0.5 block">
                {pedroResult?.lastLapFormatted ?? '—'}
              </span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 block text-[11px]">Média Últimas 3v</span>
              <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                {getLast3LapsAvg(pedroResult?.laps ?? [])}
              </span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 block text-[11px]">Melhor Volta</span>
              <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                {pedroResult?.bestLapFormatted ?? '—'}
              </span>
            </div>
          </div>

          {/* Autonomia da Bateria */}
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Bateria Ativa ({pedroResult?.activeBatteryId})
              </span>
              {pedroResult && (
                <BatteryHealthBadge
                  health={pedroResult.batteryTelemetry.health}
                  showLaps
                  lapsRemaining={pedroResult.batteryTelemetry.estimatedLapsRemaining}
                />
              )}
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 rounded-full bg-emerald-500 transition-all"
                style={{ width: `${pedroResult?.batteryTelemetry.chargePercent ?? 0}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Carga: {pedroResult?.batteryTelemetry.chargePercent}%</span>
              <span>Tensão: {pedroResult?.batteryTelemetry.voltage}V</span>
              <span>Voltas feiras: {pedroResult?.batteryTelemetry.lapsCompleted}</span>
            </div>
          </div>

          {/* Seletor de Ritmo (Interativo) */}
          {race?.status === 'in_progress' && (
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-sky-400" />
                Estratégia de Ritmo:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleStrategyChange('drv-pedro-santos', 'attack')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition border ${
                    pedroResult?.paceStrategy === 'attack'
                      ? 'bg-rose-600 text-white border-rose-400 shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  Ataque
                </button>
                <button
                  onClick={() => handleStrategyChange('drv-pedro-santos', 'normal')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition border ${
                    pedroResult?.paceStrategy === 'normal'
                      ? 'bg-sky-600 text-white border-sky-400 shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => handleStrategyChange('drv-pedro-santos', 'save_battery')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition border ${
                    pedroResult?.paceStrategy === 'save_battery'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  Poupar Bateria
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
