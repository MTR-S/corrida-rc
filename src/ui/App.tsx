import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChampionshipStore } from '../domain/ChampionshipStore';
import { Header } from './components/Header';
import { HelpModal } from './components/HelpModal';
import { ConfirmResetModal } from './components/ConfirmResetModal';
import { DashboardView } from './views/DashboardView';
import { BatteriesView } from './views/BatteriesView';
import { ResultsView } from './views/ResultsView';
import { FeedView } from './views/FeedView';
import { AppView, PersonaType } from '../domain/types';

interface AppProps {
  store?: ChampionshipStore;
}

export const App: React.FC<AppProps> = ({ store: propStore }) => {
  // Use provided store or create singleton instance
  const store = useMemo(() => propStore || new ChampionshipStore(), [propStore]);
  const [state, setState] = useState(() => store.getState());
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState({ ...store.getState() });
    });
    return unsubscribe;
  }, [store]);

  // Apply theme to DOM
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [state.theme]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleUndo = useCallback(() => {
    if (store.canUndo()) {
      const success = store.undo();
      if (success) {
        showToast('Última alteração desfeita com sucesso.');
      }
    }
  }, [store, showToast]);

  const handleConfirmReset = useCallback(() => {
    store.resetToDeterministicSeed();
    showToast('Estado determinístico da avaliação restaurado com 100% de sucesso.');
  }, [store, showToast]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if focus is inside an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      // Keys 1 to 5: Select Race 1 to 5
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        const raceNum = parseInt(e.key, 10);
        store.selectRace(raceNum);
        showToast(`Prova ${raceNum} selecionada via atalho [${raceNum}].`);
        return;
      }

      // Key '?': Toggle Help Modal
      if (e.key === '?') {
        e.preventDefault();
        setIsHelpOpen((prev) => !prev);
        return;
      }

      // Key 'u' or Ctrl+Z / Cmd+Z: Undo
      if (
        (e.key.toLowerCase() === 'u' && !e.ctrlKey && !e.metaKey) ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Key 't': Toggle theme
      if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        store.toggleTheme();
        const nextTheme = store.getState().theme;
        showToast(`Tema alterado para ${nextTheme === 'dark' ? 'Modo Escuro (Pit Lane)' : 'Modo Claro (Arquibancada)'}.`);
        return;
      }

      // Key 'p': Toggle persona
      if (e.key.toLowerCase() === 'p' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const current = store.getState().selectedPersona;
        const next: PersonaType = current === 'tech_lead' ? 'reporter' : 'tech_lead';
        store.selectPersona(next);
        showToast(`Modo alterado para ${next === 'tech_lead' ? 'Técnico de Equipe (Beto)' : 'Repórter (Camila)'}.`);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [store, showToast, handleUndo]);

  const renderActiveView = () => {
    switch (state.currentView) {
      case 'dashboard':
        return <DashboardView store={store} onShowToast={showToast} />;
      case 'batteries':
        return <BatteriesView store={store} onShowToast={showToast} />;
      case 'results':
        return <ResultsView store={store} onShowToast={showToast} />;
      case 'feed':
        return <FeedView store={store} onShowToast={showToast} />;
      default:
        return <DashboardView store={store} onShowToast={showToast} />;
    }
  };

  const isDark = state.theme === 'dark';

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      <Header
        races={state.races}
        selectedRaceNumber={state.selectedRaceNumber}
        selectedPersona={state.selectedPersona}
        currentView={state.currentView}
        theme={state.theme}
        canUndo={store.canUndo()}
        onSelectRace={(num) => store.selectRace(num)}
        onSelectPersona={(persona) => store.selectPersona(persona)}
        onSelectView={(view: AppView) => store.setCurrentView(view)}
        onToggleTheme={() => store.toggleTheme()}
        onUndo={handleUndo}
        onRequestReset={() => setIsResetConfirmOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActiveView()}
      </main>

      {/* Toast Notification for Immediate Feedback (Bastien & Scapin) */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-sky-500/80 text-sky-200 text-xs font-semibold shadow-2xl animate-fade-in"
        >
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Help & Regulation Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Confirm Reset Modal */}
      <ConfirmResetModal
        isOpen={isResetConfirmOpen}
        onConfirm={handleConfirmReset}
        onClose={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
export default App;
