import React from 'react';
import { Gauge, Zap } from 'lucide-react';
import { Driver, DriverRaceResult, LapTelemetry, PaceStrategy, Race } from '../../domain/types';
import { BatteryHealthBadge } from './SemanticBadge';

interface DriverTelemetryCardProps {
  driver: Driver;
  result?: DriverRaceResult;
  race?: Race;
  badgeBgColor?: string;
  onStrategyChange: (driverId: string, strategy: PaceStrategy) => void;
}

export const computeLast3LapsAvg = (laps?: LapTelemetry[]): string => {
  if (!laps || laps.length === 0) return '—';
  const recent = laps.slice(-3);
  const avg = recent.reduce((acc, curr) => acc + curr.lapTimeSeconds, 0) / recent.length;
  return `${avg.toFixed(3)}s`;
};

export const DriverTelemetryCard: React.FC<DriverTelemetryCardProps> = ({
  driver,
  result,
  race,
  badgeBgColor = 'bg-red-600',
  onStrategyChange,
}) => {
  const telemetry = result?.batteryTelemetry;
  const isLive = race?.status === 'in_progress';
  const batteryHealth = telemetry?.health ?? 'ideal';

  const batteryBarColor =
    batteryHealth === 'ideal'
      ? 'bg-emerald-500'
      : batteryHealth === 'warning'
      ? 'bg-amber-500'
      : 'bg-rose-500';

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-md space-y-4">
      <div className="flex items-center justify-between border-b border-slate-700 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full ${badgeBgColor} text-white font-bold text-xs flex items-center justify-center`}
            >
              #{driver.number}
            </span>
            <h3 className="text-base font-bold text-slate-100">{driver.name}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{driver.carModel}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Posição Atual</span>
          <div className="text-2xl font-black text-sky-400">
            P{result?.position ?? '—'}
          </div>
        </div>
      </div>

      {/* Telemetria de Voltas */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60">
          <span className="text-slate-400 block text-[11px]">Última Volta</span>
          <span className="text-sm font-bold text-slate-200 mt-0.5 block">
            {result?.lastLapFormatted ?? '—'}
          </span>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60">
          <span className="text-slate-400 block text-[11px]">Média Últimas 3v</span>
          <span className="text-sm font-bold text-amber-300 mt-0.5 block">
            {computeLast3LapsAvg(result?.laps)}
          </span>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60">
          <span className="text-slate-400 block text-[11px]">Melhor Volta</span>
          <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
            {result?.bestLapFormatted ?? '—'}
          </span>
        </div>
      </div>

      {/* Autonomia da Bateria */}
      <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Bateria Ativa ({result?.activeBatteryId ?? 'BAT-01'})
          </span>
          {telemetry && (
            <BatteryHealthBadge
              health={telemetry.health}
              showLaps
              lapsRemaining={telemetry.estimatedLapsRemaining}
            />
          )}
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all ${batteryBarColor}`}
            style={{ width: `${telemetry?.chargePercent ?? 0}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>Carga: {telemetry?.chargePercent ?? 0}%</span>
          <span>Tensão: {telemetry?.voltage ?? 7.4}V</span>
          <span>Voltas feitas: {telemetry?.lapsCompleted ?? 0}</span>
        </div>
      </div>

      {/* Seletor de Ritmo (Interativo) */}
      {isLive && (
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-sky-400" />
            Estratégia de Ritmo:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onStrategyChange(driver.id, 'attack')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition border ${
                result?.paceStrategy === 'attack'
                  ? 'bg-rose-600 text-white border-rose-400 shadow'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              Ataque
            </button>
            <button
              onClick={() => onStrategyChange(driver.id, 'normal')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition border ${
                result?.paceStrategy === 'normal'
                  ? 'bg-sky-600 text-white border-sky-400 shadow'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => onStrategyChange(driver.id, 'save_battery')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition border ${
                result?.paceStrategy === 'save_battery'
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
  );
};
