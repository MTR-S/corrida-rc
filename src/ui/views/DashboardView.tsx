import React from 'react';
import {
  Wrench,
  Play,
  Pause,
} from 'lucide-react';
import { ChampionshipStore } from '../../domain/ChampionshipStore';
import { PaceStrategy } from '../../domain/types';
import { DriverTelemetryCard } from '../components/DriverTelemetryCard';

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

  const handleStrategyChange = (driverId: string, strategy: PaceStrategy) => {
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
        <DriverTelemetryCard
          driver={lucasDriver}
          result={lucasResult}
          race={race}
          badgeBgColor="bg-red-600"
          onStrategyChange={handleStrategyChange}
        />

        {/* Piloto B: Pedro Santos */}
        <DriverTelemetryCard
          driver={pedroDriver}
          result={pedroResult}
          race={race}
          badgeBgColor="bg-red-800"
          onStrategyChange={handleStrategyChange}
        />
      </div>
    </div>
  );
};
