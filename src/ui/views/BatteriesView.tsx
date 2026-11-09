import React from 'react';
import { BatteryCharging, Shield, User, RefreshCw } from 'lucide-react';
import { ChampionshipStore } from '../../domain/ChampionshipStore';
import { BatteryHealthBadge } from '../components/SemanticBadge';

interface BatteriesViewProps {
  store: ChampionshipStore;
  onShowToast: (msg: string) => void;
}

export const BatteriesView: React.FC<BatteriesViewProps> = ({ store, onShowToast }) => {
  const state = store.getState();
  const raceNumber = state.selectedRaceNumber;
  const race = state.races[raceNumber];
  const results = state.raceResults[raceNumber] || [];

  const handlePitStop = (driverId: string) => {
    store.performPitStop(raceNumber, driverId);
    const driver = state.drivers.find((d) => d.id === driverId);
    onShowToast(`Pit stop realizado para ${driver?.name}: Bateria #2 instalada (100% / 7.4V).`);
  };

  return (
    <div className="space-y-8">
      {/* Seção 1: Monitor de Baterias e Autonomia */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BatteryCharging className="w-5 h-5 text-emerald-400" />
              <span>Monitor de Autonomia da Bateria — Prova {raceNumber}</span>
            </h2>
            <p className="text-xs text-slate-400">
              Acompanhamento de voltas realizadas por bateria, tensão (V), percentual de carga e projeção de autonomia.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((res) => {
            const driver = state.drivers.find((d) => d.id === res.driverId);
            const team = state.teams.find((t) => t.id === res.teamId);

            return (
              <div
                key={res.driverId}
                className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">
                        #{driver?.number}
                      </span>
                      <h3 className="font-bold text-sm text-slate-100">{driver?.name}</h3>
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5">{team?.name}</span>
                  </div>
                  <BatteryHealthBadge
                    health={res.batteryTelemetry.health}
                    showLaps
                    lapsRemaining={res.batteryTelemetry.estimatedLapsRemaining}
                  />
                </div>

                {/* Battery stats */}
                <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-lg border border-slate-700/60 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Bateria Ativa:</span>
                    <strong className="font-mono text-sky-400">{res.activeBatteryId}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Voltas com esta bateria:</span>
                    <strong className="font-mono text-amber-300">
                      {res.batteryTelemetry.lapsCompleted} voltas
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Tensão / Carga:</span>
                    <strong className="font-mono text-emerald-400">
                      {res.batteryTelemetry.voltage}V ({res.batteryTelemetry.chargePercent}%)
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Consumo Médio:</span>
                    <span className="text-slate-400">
                      ~{res.batteryTelemetry.drainPerLap}% / volta
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      res.batteryTelemetry.health === 'ideal'
                        ? 'bg-emerald-500'
                        : res.batteryTelemetry.health === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${res.batteryTelemetry.chargePercent}%` }}
                  />
                </div>

                {/* Pit Stop Button for Race 4 in progress */}
                {race?.status === 'in_progress' && (
                  <button
                    onClick={() => handlePitStop(res.driverId)}
                    className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition border border-slate-600"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Realizar Troca de Bateria (Pit Stop)</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Seção 2: Catálogo de Equipes e Pilotos */}
      <section className="space-y-4 pt-4 border-t border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-sky-400" />
            <span>Catálogo Geral de Equipes e Pilotos</span>
          </h2>
          <p className="text-xs text-slate-400">
            Ficha técnica, chefes de equipe, perfis dos 12 pilotos e especificações de chassi RC.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {state.teams.map((team) => {
            const teamDrivers = state.drivers.filter((d) => d.teamId === team.id);

            return (
              <div
                key={team.id}
                className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
                  <div>
                    <h3 className="font-extrabold text-slate-100 flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: team.color }}
                      />
                      <span>{team.name}</span>
                    </h3>
                    <span className="text-xs text-slate-400">Chefe: {team.teamPrincipal}</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                    {team.shortCode}
                  </span>
                </div>

                <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[11px] font-semibold">Especificações do Carro:</span>
                  <span className="text-slate-200">{team.carSpecs}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                    <User className="w-3 h-3 text-sky-400" />
                    Pilotos da Equipe:
                  </span>
                  {teamDrivers.map((driver) => (
                    <div
                      key={driver.id}
                      className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-200">
                        <span>
                          #{driver.number} {driver.name}
                        </span>
                        <span className="text-amber-400 text-[11px]">
                          {driver.totalWins}V • {driver.totalPodiums}P
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{driver.profile}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
