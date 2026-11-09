import React from 'react';
import { Gauge, Zap, CheckCircle2, AlertTriangle, AlertOctagon, Trophy } from 'lucide-react';
import { Driver, DriverRaceResult, LapTelemetry, PaceStrategy, Race } from '../../domain/types';
import { BatteryHealthBadge } from './SemanticBadge';

interface DriverTelemetryCardProps {
  driver: Driver;
  result?: DriverRaceResult;
  teammateResult?: DriverRaceResult;
  race?: Race;
  badgeBgColor?: string;
  isFastestOfDuo?: boolean;
  onStrategyChange: (driverId: string, strategy: PaceStrategy) => void;
}

export const computeLast3LapsAvgSeconds = (laps?: LapTelemetry[]): number | null => {
  if (!laps || laps.length === 0) return null;
  const recent = laps.slice(-3);
  return recent.reduce((acc, curr) => acc + curr.lapTimeSeconds, 0) / recent.length;
};

export const computeLast3LapsAvg = (laps?: LapTelemetry[]): string => {
  const avg = computeLast3LapsAvgSeconds(laps);
  if (avg === null) return '—';
  return `${avg.toFixed(3)}s`;
};

export const formatDeltaSeconds = (myVal?: number | null, mateVal?: number | null): string => {
  if (myVal === undefined || myVal === null || mateVal === undefined || mateVal === null) return '—';
  const diff = myVal - mateVal;
  if (Math.abs(diff) < 0.0005) return '0.000s';
  return `${diff > 0 ? '+' : ''}${diff.toFixed(3)}s`;
};

export const DriverTelemetryCard: React.FC<DriverTelemetryCardProps> = ({
  driver,
  result,
  teammateResult,
  race,
  badgeBgColor = 'bg-red-600',
  isFastestOfDuo = false,
  onStrategyChange,
}) => {
  const telemetry = result?.batteryTelemetry;
  const isLive = race?.status === 'in_progress';
  const batteryHealth = telemetry?.health ?? 'ideal';

  const remainingLaps = Math.max(0, (race?.totalLaps ?? 20) - (result?.lapsCompleted ?? 0));
  const estLaps = telemetry?.estimatedLapsRemaining ?? 0;
  const canCompleteRace = estLaps >= remainingLaps && batteryHealth === 'ideal';
  const isMarginalBattery = estLaps >= remainingLaps && batteryHealth === 'warning';

  const myAvg3 = computeLast3LapsAvgSeconds(result?.laps);
  const mateAvg3 = computeLast3LapsAvgSeconds(teammateResult?.laps);
  const lastLapDelta = formatDeltaSeconds(result?.lastLapTimeSeconds, teammateResult?.lastLapTimeSeconds);
  const bestLapDelta = formatDeltaSeconds(result?.bestLapTimeSeconds, teammateResult?.bestLapTimeSeconds);
  const avg3Delta = formatDeltaSeconds(myAvg3, mateAvg3);

  // Detect pacing drop over last 3 laps
  const laps = result?.laps || [];
  const hasPacingDrop =
    laps.length >= 3 &&
    laps[laps.length - 1].lapTimeSeconds > laps[laps.length - 2].lapTimeSeconds &&
    laps[laps.length - 2].lapTimeSeconds > laps[laps.length - 3].lapTimeSeconds;

  const batteryBarColor =
    batteryHealth === 'ideal'
      ? 'bg-emerald-500'
      : batteryHealth === 'warning'
      ? 'bg-amber-500'
      : 'bg-rose-500';

  return (
    <div
      data-testid={`driver-telemetry-card-${driver.id}`}
      className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-md space-y-4"
    >
      <div className="flex items-center justify-between border-b border-slate-700 pb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`w-6 h-6 rounded-full ${badgeBgColor} text-white font-bold text-xs flex items-center justify-center`}
            >
              #{driver.number}
            </span>
            <h3 className="text-base font-bold text-slate-100">{driver.name}</h3>
            {isFastestOfDuo && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-700">
                <Trophy className="w-3 h-3 text-emerald-400" />
                <span>Melhor Volta da Dupla</span>
              </span>
            )}
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

      {/* Telemetria de Voltas e Deltas entre Companheiros */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60">
          <span className="text-slate-400 block text-[11px]">Última Volta</span>
          <span className="text-sm font-bold font-mono text-slate-200 mt-0.5 block">
            {result?.lastLapFormatted ?? '—'}
          </span>
          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
            Δ Dupla: {lastLapDelta}
          </span>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60">
          <span className="text-slate-400 block text-[11px]">Média Últimas 3v</span>
          <span className="text-sm font-bold font-mono text-amber-300 mt-0.5 block">
            {computeLast3LapsAvg(result?.laps)}
          </span>
          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
            Δ Média: {avg3Delta}
          </span>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60">
          <span className="text-slate-400 block text-[11px]">Melhor Volta</span>
          <span className="text-sm font-bold font-mono text-emerald-400 mt-0.5 block">
            {result?.bestLapFormatted ?? '—'}
          </span>
          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
            Δ Melhor: {bestLapDelta}
          </span>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60">
          <span className="text-slate-400 block text-[11px]">Ritmo Estimado</span>
          <span className="text-sm font-bold font-mono text-sky-300 mt-0.5 block">
            {result?.estimatedLapFormatted ?? result?.lastLapFormatted ?? '—'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {hasPacingDrop ? 'Queda nas 3v' : 'Ritmo estável'}
          </span>
        </div>
      </div>

      {/* Autonomia da Bateria e Projeção até a Volta 20 */}
      <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60 space-y-2">
        <div className="flex items-center justify-between text-xs flex-wrap gap-1">
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
        <div className="flex justify-between text-[11px] text-slate-400 flex-wrap gap-1">
          <span>Carga: {telemetry?.chargePercent ?? 0}%</span>
          <span>Tensão: {telemetry?.voltage ?? 7.4}V</span>
          <span>Consumo: ~{telemetry?.drainPerLap ?? 4.2}%/v</span>
          <span>Voltas feitas: {telemetry?.lapsCompleted ?? 0}</span>
        </div>

        {/* Diagnóstico visual de conclusão até a Volta 20 */}
        {isLive && telemetry && (
          <div
            className={`mt-2 p-2 rounded-lg border text-xs flex items-center gap-2 font-semibold ${
              canCompleteRace
                ? 'bg-emerald-950/60 border-emerald-700/70 text-emerald-300'
                : isMarginalBattery
                ? 'bg-amber-950/60 border-amber-700/70 text-amber-300'
                : 'bg-rose-950/70 border-rose-700/80 text-rose-300'
            }`}
          >
            {canCompleteRace ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Projeção Volta 20: Completa as {remainingLaps} voltas restantes com segurança (~{estLaps} voltas de autonomia).
                </span>
              </>
            ) : isMarginalBattery ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Projeção Volta 20: Limite de autonomia (~{estLaps}v estimadas p/ {remainingLaps}v restantes) — Recomenda-se Poupar Bateria.
                </span>
              </>
            ) : (
              <>
                <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  Projeção Volta 20: Bateria insuficiente (~{estLaps}v estimadas p/ {remainingLaps}v restantes) — Risco de pane seca antes da Volta 20!
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Seletor de Ritmo (Interativo na Prova 4 Ao Vivo) */}
      {isLive && (
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-sky-400" />
            Estratégia de Ritmo ({driver.name}):
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onStrategyChange(driver.id, 'attack')}
              aria-label={`Estratégia Ataque para ${driver.name}`}
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
              aria-label={`Estratégia Normal para ${driver.name}`}
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
              aria-label={`Estratégia Poupar Bateria para ${driver.name}`}
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
