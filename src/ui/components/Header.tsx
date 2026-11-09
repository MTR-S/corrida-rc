import React from 'react';
import {
  RotateCcw,
  Undo2,
  HelpCircle,
  BarChart3,
  Battery,
  Trophy,
  MessageSquare,
  Radio,
} from 'lucide-react';
import { PersonaType, ThemeType, AppView, Race } from '../../domain/types';
import { PersonaSelector } from './PersonaSelector';
import { ThemeToggle } from './ThemeToggle';
import { RaceSelector } from './RaceSelector';

interface HeaderProps {
  races: Record<number, Race>;
  selectedRaceNumber: number;
  selectedPersona: PersonaType;
  currentView: AppView;
  theme: ThemeType;
  canUndo: boolean;
  onSelectRace: (raceNumber: number) => void;
  onSelectPersona: (persona: PersonaType) => void;
  onSelectView: (view: AppView) => void;
  onToggleTheme: () => void;
  onUndo: () => void;
  onRequestReset: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  races,
  selectedRaceNumber,
  selectedPersona,
  currentView,
  theme,
  canUndo,
  onSelectRace,
  onSelectPersona,
  onSelectView,
  onToggleTheme,
  onUndo,
  onRequestReset,
  onOpenHelp,
}) => {
  const currentRace = races[selectedRaceNumber];

  return (
    <header className="border-b border-slate-700/80 bg-slate-900/95 sticky top-0 z-40 backdrop-blur shadow-md">
      {/* Top utility bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>CAMPEONATO RC</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                  WEB SPA
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 leading-none">
                Plataforma Digital • IFCE IHC 2026.2
              </p>
            </div>
          </div>
        </div>

        {/* Global Controls: Persona, Theme, Undo, Reset, Help */}
        <div className="flex items-center gap-2 flex-wrap">
          <PersonaSelector
            selectedPersona={selectedPersona}
            onSelectPersona={onSelectPersona}
          />

          <div className="h-6 w-px bg-slate-700/80 mx-1 hidden sm:block" />

          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />

          {/* Undo Button */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              canUndo
                ? 'bg-slate-800 text-sky-300 border-sky-500/50 hover:bg-slate-700 hover:text-white'
                : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
            }`}
            aria-label="Desfazer última alteração (Atalho: U)"
            title="Desfazer última alteração (Atalho: U ou Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desfazer</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onRequestReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-950/40 text-amber-300 border border-amber-700/60 hover:bg-amber-900/60 hover:text-amber-200 transition"
            aria-label="Restaurar dados determinísticos da avaliação"
            title="Prevenção de Erros: Restaura o estado determinístico das 6 Missões de Usabilidade"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Restaurar Avaliação</span>
          </button>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition"
            aria-label="Abrir regulamento do campeonato e atalhos de teclado (Atalho: ?)"
            title="Regulamento e Atalhos de Teclado (Atalho: ?)"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
          </button>
        </div>
      </div>

      {/* Main Area Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-1 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80">
        <nav
          className="flex items-center gap-1 overflow-x-auto pb-1"
          aria-label="Navegação Global das Frentes de Trabalho"
        >
          <button
            onClick={() => onSelectView('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-bold transition border-b-2 ${
              currentView === 'dashboard'
                ? 'border-red-500 text-red-400 bg-red-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard Estratégico</span>
            {selectedPersona === 'tech_lead' && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-900/60 text-red-300 font-semibold">
                Beto
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectView('batteries')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-bold transition border-b-2 ${
              currentView === 'batteries'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Battery className="w-4 h-4" />
            <span>Baterias & Pilotos</span>
          </button>

          <button
            onClick={() => onSelectView('results')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-bold transition border-b-2 ${
              currentView === 'results'
                ? 'border-sky-500 text-sky-400 bg-sky-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Resultados & Classificação</span>
            {selectedPersona === 'reporter' && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-900/60 text-sky-300 font-semibold">
                Camila
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectView('feed')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-bold transition border-b-2 ${
              currentView === 'feed'
                ? 'border-purple-500 text-purple-400 bg-purple-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Feed da Corrida & Imprensa</span>
          </button>
        </nav>

        {/* Selected race summary in header */}
        {currentRace && (
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
            <span className="text-slate-500">Etapa ativa:</span>
            <span className="font-semibold text-slate-200">{currentRace.name}</span>
          </div>
        )}
      </div>

      {/* Global Race Selector Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 bg-slate-950/50">
        <RaceSelector
          races={races}
          selectedRaceNumber={selectedRaceNumber}
          onSelectRace={onSelectRace}
        />
      </div>
    </header>
  );
};
