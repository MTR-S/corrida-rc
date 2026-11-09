import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { ThemeType } from '../../domain/types';

interface ThemeToggleProps {
  theme: ThemeType;
  onToggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggleTheme }) => {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onToggleTheme}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition shadow-sm bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700/80 hover:text-white"
      aria-label={`Alternar tema atual: ${isDark ? 'Modo Escuro (Pit Lane)' : 'Modo Claro (Arquibancada)'}`}
      title={`Alternar Tema (Atalho: T) — Atualmente em ${isDark ? 'Modo Escuro (Pit Lane)' : 'Modo Claro (Arquibancada)'}`}
    >
      {isDark ? (
        <>
          <Moon className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
          <span>Pit Lane (Escuro)</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
          <span>Arquibancada (Claro)</span>
        </>
      )}
    </button>
  );
};
