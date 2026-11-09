import React from 'react';
import { Flag } from 'lucide-react';
import { Race } from '../../domain/types';
import { RaceStatusBadge } from './SemanticBadge';

interface RaceSelectorProps {
  races: Record<number, Race>;
  selectedRaceNumber: number;
  onSelectRace: (raceNumber: number) => void;
}

export const RaceSelector: React.FC<RaceSelectorProps> = ({
  races,
  selectedRaceNumber,
  onSelectRace,
}) => {
  return (
    <nav
      className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-thin"
      aria-label="Seletor Global de Provas do Campeonato"
    >
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-1 shrink-0">
        <Flag className="w-3.5 h-3.5 text-sky-400" />
        Provas:
      </span>

      {[1, 2, 3, 4, 5].map((num) => {
        const race = races[num];
        const isSelected = selectedRaceNumber === num;

        return (
          <button
            key={num}
            onClick={() => onSelectRace(num)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 border ${
              isSelected
                ? 'bg-sky-600 text-white border-sky-400 shadow-md ring-2 ring-sky-400/40'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700/80 hover:text-white'
            }`}
            aria-pressed={isSelected}
            aria-label={`Selecionar Prova ${num}: ${race ? race.name : ''} (Atalho: tecla ${num})`}
            title={`Atalho: Tecla ${num} — ${race?.name ?? `Prova ${num}`}`}
          >
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-slate-900/60 text-[10px] font-bold">
              {num}
            </span>
            <span className="hidden sm:inline font-medium">
              {race ? race.name.split('—')[1]?.trim() || `Prova ${num}` : `Prova ${num}`}
            </span>
            {race && (
              <RaceStatusBadge
                status={race.status}
                currentLap={race.currentLap}
                totalLaps={race.totalLaps}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};
