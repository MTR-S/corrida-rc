import React from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface ConfirmResetModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmResetModal: React.FC<ConfirmResetModalProps> = ({
  isOpen,
  onConfirm,
  onClose,
}) => {
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-reset-title"
    >
      <div className="relative w-full max-w-md rounded-xl bg-slate-900 border border-amber-600/60 shadow-2xl p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Cancelar e fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 id="confirm-reset-title" className="text-lg font-bold text-slate-100">
              Restaurar Dados da Avaliação?
            </h2>
            <p className="text-xs text-amber-400 font-medium">
              Prevenção de Erros de Usabilidade
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          Esta ação irá redefinir <strong>100% do estado do Campeonato</strong> para o cenário determinístico inicial das <strong>6 Missões de Usabilidade</strong>:
        </p>

        <ul className="text-xs text-slate-300 space-y-1.5 mb-6 list-disc list-inside bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
          <li>Provas 1 a 3 Concluídas (com ultrapassagem na última volta da Prova 3);</li>
          <li>Prova 4 Ao Vivo na Volta 14 de 20 (cenário do Técnico Beto);</li>
          <li>6 Equipes e 12 Pilotos no estado padrão;</li>
          <li>Cotas de publicações do feed restauradas para os valores iniciais.</li>
        </ul>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition border border-slate-700"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition shadow-lg shadow-amber-950"
          >
            <RotateCcw className="w-4 h-4" />
            Sim, Restaurar Dados
          </button>
        </div>
      </div>
    </div>
  );
};
