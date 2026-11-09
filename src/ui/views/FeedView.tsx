import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  AlertCircle,
  Copy,
  Check,
  FileText,
  Clock,
  Filter,
} from 'lucide-react';
import { ChampionshipStore } from '../../domain/ChampionshipStore';
import { PostCategory } from '../../domain/types';

interface FeedViewProps {
  store: ChampionshipStore;
  onShowToast: (msg: string) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({ store, onShowToast }) => {
  const state = store.getState();
  const raceNumber = state.selectedRaceNumber;
  const race = state.races[raceNumber];

  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newPostTeamId, setNewPostTeamId] = useState<string>('nitro-rc');
  const [newPostCategory, setNewPostCategory] = useState<PostCategory>('acontecimentos');
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedPress, setCopiedPress] = useState<boolean>(false);

  const posts = state.teamPosts[raceNumber] || [];
  const events = state.raceEvents[raceNumber] || [];
  const quota = store.getTeamPostQuota(raceNumber, newPostTeamId);

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    if (selectedTeamFilter !== 'all' && p.teamId !== selectedTeamFilter) return false;
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    return true;
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const team = state.teams.find((t) => t.id === newPostTeamId);
    const result = store.addTeamPost({
      raceNumber,
      teamId: newPostTeamId,
      author: team?.teamPrincipal ?? 'Representante',
      role: 'Chefe / Técnico de Equipe',
      category: newPostCategory,
      lapNumber: race?.currentLap ?? 14,
      content: newPostContent,
    });

    if (!result.success) {
      setErrorMsg(result.error ?? 'Erro ao publicar.');
      return;
    }

    setNewPostContent('');
    onShowToast(`Publicação da equipe ${team?.name} realizada com sucesso!`);
  };

  const handleCopyPressRelease = () => {
    const p1 = (state.raceResults[raceNumber] || []).find((r) => r.position === 1);
    const winnerDriver = state.drivers.find((d) => d.id === p1?.driverId);
    const winnerTeam = state.teams.find((t) => t.id === p1?.teamId);

    const draft = state.pressReleaseDrafts[raceNumber] || {
      headline: `Boletim de Imprensa: Resumo Oficial da ${race?.name ?? `Prova ${raceNumber}`}`,
      body: p1
        ? `Vitória de ${winnerDriver?.name ?? 'Piloto'} (${winnerTeam?.name ?? 'Equipe'}) na etapa ${race?.name}. Volta mais rápida de ${race?.fastestLapFormatted ?? p1.bestLapFormatted}. Acompanhe as declarações oficiais no feed.`
        : `Confira os principais fatos e declarações oficiais após a etapa...`,
    };

    const text = `=== BOLETIM DE IMPRENSA — RC EM FOCO ===\n${draft.headline}\n\n${draft.body}\n\nEtapa: ${race?.name} (${race?.date})\nCanal: RC em Foco • Repórter Camila Rocha`;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedPress(true);
    onShowToast('Boletim de imprensa copiado para a área de transferência!');
    setTimeout(() => setCopiedPress(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna 1 & 2: Feed da Corrida & Publicador */}
      <div className="lg:col-span-2 space-y-6">
        {/* Publicador com Controle de Cota */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 pb-3">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Publicador Oficial de Equipe — Prova {raceNumber}</span>
            </h2>

            {/* Contador de Cota */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                quota.remaining > 0
                  ? 'bg-purple-950/60 text-purple-300 border-purple-700/60'
                  : 'bg-rose-950/80 text-rose-300 border-rose-700'
              }`}
            >
              <span>Cota Regulamentar:</span>
              <strong className="font-mono text-sm">
                {quota.used} / {quota.max}
              </strong>
              <span>utilizadas</span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-700 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Equipe Autora:
                </label>
                <select
                  value={newPostTeamId}
                  onChange={(e) => {
                    setNewPostTeamId(e.target.value);
                    setErrorMsg(null);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-400"
                >
                  {state.teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Categoria:
                </label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value as PostCategory)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-400"
                >
                  <option value="pilotos">Pilotos</option>
                  <option value="acontecimentos">Acontecimentos</option>
                  <option value="resultados">Resultados</option>
                  <option value="bastidores">Bastidores</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Conteúdo do Comunicado:
              </label>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder={
                  quota.canPost
                    ? 'Escreva a declaração oficial da equipe para o feed desta prova...'
                    : 'Limite regulamentar de 4 publicações atingido nesta prova.'
                }
                disabled={!quota.canPost}
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400 disabled:opacity-50"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                Regulamento: máx. 4 publicações por equipe por prova.
              </span>
              <button
                type="submit"
                disabled={!quota.canPost || !newPostContent.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-bold transition shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publicar no Feed</span>
              </button>
            </div>
          </form>
        </div>

        {/* Filtros e Lista do Feed */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/80">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Filter className="w-3.5 h-3.5 text-purple-400" />
              <span>Filtrar Feed da Prova {raceNumber}:</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={selectedTeamFilter}
                onChange={(e) => setSelectedTeamFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200"
              >
                <option value="all">Todas as Equipes</option>
                {state.teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200"
              >
                <option value="all">Todas as Categorias</option>
                <option value="pilotos">Pilotos</option>
                <option value="acontecimentos">Acontecimentos</option>
                <option value="resultados">Resultados</option>
                <option value="bastidores">Bastidores</option>
              </select>
            </div>
          </div>

          {/* Timeline de Publicações */}
          <div className="space-y-3">
            {filteredPosts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-800/40 border border-slate-700 rounded-xl">
                Nenhuma publicação encontrada para os filtros selecionados nesta prova.
              </div>
            ) : (
              filteredPosts.map((post) => {
                const team = state.teams.find((t) => t.id === post.teamId);

                return (
                  <div
                    key={post.id}
                    className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 shadow-sm space-y-2 hover:border-slate-600 transition"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: team?.color ?? '#94a3b8' }}
                        />
                        <strong className="text-slate-100">{team?.name}</strong>
                        <span className="text-slate-400">• {post.author} ({post.role})</span>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-purple-300 border border-purple-800/50 uppercase">
                        {post.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-normal bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80">
                      "{post.content}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {post.timestamp} (Volta {post.lapNumber})
                      </span>
                      <button
                        onClick={() => {
                          const quote = `"${post.content}" — ${post.author} (${team?.name})`;
                          if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                            navigator.clipboard.writeText(quote).catch(() => {});
                          }
                          onShowToast('Citação copiada para o boletim!');
                        }}
                        className="text-sky-400 hover:text-sky-300 font-semibold"
                      >
                        Citar no Boletim
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Coluna 3: Eventos da Prova & Estúdio de Boletim de Imprensa */}
      <div className="space-y-6">
        {/* Estúdio de Boletim de Imprensa */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Estúdio de Boletim — Camila Rocha</span>
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-400 font-bold border border-sky-800">
              RC em Foco
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-700/80 space-y-1.5">
              <span className="text-slate-400 block text-[11px] uppercase font-bold">Matéria Gerada:</span>
              <h3 className="font-bold text-slate-100 text-sm">
                {state.pressReleaseDrafts[raceNumber]?.headline ??
                  `Giro Rápido: Fatos e Números da ${race?.name ?? 'Prova'}`}
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                {state.pressReleaseDrafts[raceNumber]?.body ??
                  `Cobertura completa da etapa com destaques de tempos de volta, pódio oficial e as declarações mais marcantes das equipes.`}
              </p>
            </div>

            <button
              onClick={handleCopyPressRelease}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition shadow"
            >
              {copiedPress ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>Copiar Matéria Completa (&lt; 10 min)</span>
            </button>
          </div>
        </div>

        {/* Linha do Tempo de Eventos de Prova */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-700 pb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Eventos de Prova (Volta a Volta)</span>
          </h2>

          <div className="space-y-2 text-xs max-h-80 overflow-y-auto pr-1">
            {events.length === 0 ? (
              <p className="text-slate-500 text-center py-4">Nenhum evento registrado nesta etapa.</p>
            ) : (
              events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-400">Volta {ev.lapNumber}</span>
                    <span className="text-slate-500 font-mono">{ev.timestamp}</span>
                  </div>
                  <p className="text-slate-200">{ev.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
