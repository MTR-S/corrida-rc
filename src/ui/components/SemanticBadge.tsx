import React from 'react';
import { CheckCircle2, PlayCircle, Calendar, BatteryCharging, AlertTriangle, AlertOctagon } from 'lucide-react';
import { RaceStatus, BatteryHealth } from '../../domain/types';

interface RaceStatusBadgeProps {
  status: RaceStatus;
  currentLap?: number;
  totalLaps?: number;
}

export const RaceStatusBadge: React.FC<RaceStatusBadgeProps> = ({
  status,
  currentLap = 0,
  totalLaps = 20,
}) => {
  if (status === 'completed') {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800"
        aria-label="Status: Concluída"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
        <span>Concluída</span>
      </span>
    );
  }

  if (status === 'in_progress') {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/70 text-amber-300 border border-amber-700 animate-pulse"
        aria-label={`Status: Ao Vivo na volta ${currentLap} de ${totalLaps}`}
      >
        <PlayCircle className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
        <span>Ao Vivo ({currentLap}/{totalLaps})</span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/80 text-slate-400 border border-slate-700"
      aria-label="Status: Agendada"
    >
      <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
      <span>Agendada</span>
    </span>
  );
};

interface BatteryHealthBadgeProps {
  health: BatteryHealth;
  showLaps?: boolean;
  lapsRemaining?: number;
}

export const BatteryHealthBadge: React.FC<BatteryHealthBadgeProps> = ({
  health,
  showLaps = false,
  lapsRemaining,
}) => {
  if (health === 'ideal') {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700"
        title="Bateria em estado ideal para completar a prova"
      >
        <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
        <span>Ideal {showLaps && lapsRemaining !== undefined ? `(~${lapsRemaining} v.)` : '— Completa'}</span>
      </span>
    );
  }

  if (health === 'warning') {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-700"
        title="Atenção: desgaste alto, poupar equipamento ou avaliar box"
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
        <span>Atenção: Poupar {showLaps && lapsRemaining !== undefined ? `(~${lapsRemaining} v.)` : ''}</span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-rose-950/90 text-rose-300 border border-rose-700 animate-pulse"
      title="Crítico: bateria não completará a prova, troca necessária"
    >
      <AlertOctagon className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
      <span>Crítico: Trocar {showLaps && lapsRemaining !== undefined ? `(~${lapsRemaining} v.)` : ''}</span>
    </span>
  );
};
