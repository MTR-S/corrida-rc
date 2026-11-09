import React from 'react';
import { Wrench, Newspaper } from 'lucide-react';
import { PersonaType } from '../../domain/types';

interface PersonaSelectorProps {
  selectedPersona: PersonaType;
  onSelectPersona: (persona: PersonaType) => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedPersona,
  onSelectPersona,
}) => {
  return (
    <div
      className="inline-flex items-center rounded-lg bg-slate-800/80 p-1 border border-slate-700/80 shadow-inner"
      role="group"
      aria-label="Seletor de Modo de Trabalho por Persona"
    >
      <button
        onClick={() => onSelectPersona('tech_lead')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
          selectedPersona === 'tech_lead'
            ? 'bg-red-600 text-white shadow-md'
            : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
        }`}
        aria-pressed={selectedPersona === 'tech_lead'}
        title="Modo Técnico de Equipe: Roberto 'Beto' Almeida (Nitro RC)"
      >
        <Wrench className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Técnico (Beto)</span>
      </button>

      <button
        onClick={() => onSelectPersona('reporter')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
          selectedPersona === 'reporter'
            ? 'bg-sky-600 text-white shadow-md'
            : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
        }`}
        aria-pressed={selectedPersona === 'reporter'}
        title="Modo Repórter: Camila Rocha (RC em Foco)"
      >
        <Newspaper className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Repórter (Camila)</span>
      </button>
    </div>
  );
};
