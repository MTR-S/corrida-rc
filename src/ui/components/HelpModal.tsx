import React from 'react';
import { X, Trophy, Users, MessageSquare, Keyboard } from 'lucide-react';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Fechar modal de ajuda"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="help-modal-title" className="text-xl font-bold flex items-center gap-2 mb-4 text-sky-400">
          <Trophy className="w-5 h-5 text-amber-400" />
          Regulamento do Campeonato & Atalhos de Teclado
        </h2>

        <div className="space-y-6 text-sm">
          {/* Tabela de Pontuação */}
          <section className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/80">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-sky-400" />
              1. Tabela Oficial de Pontuação por Prova
            </h3>
            <p className="text-slate-300 text-xs mb-3">
              Ao final de cada uma das 5 Provas (20 Voltas cada), os pontos são atribuídos aos 5 primeiros colocados:
            </p>
            <div className="grid grid-cols-6 gap-2 text-center text-xs font-medium">
              <div className="p-2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <div className="font-bold">1º Lugar</div>
                <div className="text-base font-extrabold text-amber-400">10 pts</div>
              </div>
              <div className="p-2 rounded bg-slate-400/20 text-slate-200 border border-slate-400/40">
                <div className="font-bold">2º Lugar</div>
                <div className="text-base font-extrabold text-slate-200">6 pts</div>
              </div>
              <div className="p-2 rounded bg-amber-700/20 text-amber-400 border border-amber-700/40">
                <div className="font-bold">3º Lugar</div>
                <div className="text-base font-extrabold text-amber-500">3 pts</div>
              </div>
              <div className="p-2 rounded bg-slate-700/50 text-slate-300 border border-slate-600">
                <div className="font-bold">4º Lugar</div>
                <div className="text-base font-extrabold text-slate-200">2 pts</div>
              </div>
              <div className="p-2 rounded bg-slate-700/50 text-slate-300 border border-slate-600">
                <div className="font-bold">5º Lugar</div>
                <div className="text-base font-extrabold text-slate-200">1 pt</div>
              </div>
              <div className="p-2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                <div className="font-bold">6º ao 12º</div>
                <div className="text-base font-extrabold text-slate-500">0 pt</div>
              </div>
            </div>
          </section>

          {/* Regra de Pontuação por Equipe */}
          <section className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/80">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-sky-400" />
              2. Regra de Pontuação das Equipes
            </h3>
            <p className="text-slate-300 text-xs">
              Cada uma das 6 Equipes possui exatamente 2 Pilotos. A pontuação de cada Equipe é calculada pela <strong>soma exata dos pontos obtidos por seus dois Pilotos</strong> em cada Prova e na Classificação Geral acumulada.
            </p>
          </section>

          {/* Cota do Feed da Corrida */}
          <section className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/80">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              3. Cota Regulamentar do Feed da Corrida
            </h3>
            <p className="text-slate-300 text-xs">
              Conforme o regulamento oficial (Seção 4.3 do edital), cada Equipe de corrida pode realizar <strong>até 4 publicações no feed de cada Prova</strong>. A interface bloqueia preventivamente qualquer tentativa de 5ª publicação pela mesma equipe na mesma prova.
            </p>
          </section>

          {/* Atalhos de Teclado */}
          <section className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/80">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2 mb-3">
              <Keyboard className="w-4 h-4 text-sky-400" />
              4. Atalhos Globais de Teclado
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-700">
                <span className="text-slate-300">Selecionar Prova 1 a 5</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 font-mono font-bold text-sky-400 border border-slate-600">1 - 5</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-700">
                <span className="text-slate-300">Abrir / Fechar Ajuda</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 font-mono font-bold text-sky-400 border border-slate-600">?</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-700">
                <span className="text-slate-300">Desfazer Última Ação (Undo)</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 font-mono font-bold text-sky-400 border border-slate-600">U / Ctrl+Z</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-700">
                <span className="text-slate-300">Alternar Tema (Pit Lane / Claro)</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 font-mono font-bold text-sky-400 border border-slate-600">T</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-700">
                <span className="text-slate-300">Alternar Persona (Beto / Camila)</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 font-mono font-bold text-sky-400 border border-slate-600">P</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-700">
                <span className="text-slate-300">Pausar / Retomar Simulação (Prova 4)</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 font-mono font-bold text-sky-400 border border-slate-600">Espaço</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-700">
                <span className="text-slate-300">Fechar Janela / Modal</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 font-mono font-bold text-sky-400 border border-slate-600">Esc</kbd>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 font-medium text-white transition text-sm"
          >
            Entendido, fechar
          </button>
        </div>
      </div>
    </div>
  );
};
