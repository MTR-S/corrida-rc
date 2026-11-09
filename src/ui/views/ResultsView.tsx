import React, { useState } from 'react';
import { Trophy, Medal, Award, Copy, Check, Filter, Info } from 'lucide-react';
import { ChampionshipStore } from '../../domain/ChampionshipStore';
import { RaceStatusBadge } from '../components/SemanticBadge';

interface ResultsViewProps {
  store: ChampionshipStore;
  onShowToast: (msg: string) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ store, onShowToast }) => {
  const state = store.getState();
  const raceNumber = state.selectedRaceNumber;
  const race = state.races[raceNumber];
  const results = state.raceResults[raceNumber] || [];

  const [standingsTab, setStandingsTab] = useState<'drivers' | 'teams'>('drivers');
  const [historicalRaceFilter, setHistoricalRaceFilter] = useState<number>(3);
  const [copied, setCopied] = useState(false);

  const driverStandings = store.getDriverStandings(historicalRaceFilter);
  const teamStandings = store.getTeamStandings(historicalRaceFilter);

  // Top 3 for podium
  const p1 = results.find((r) => r.position === 1);
  const p2 = results.find((r) => r.position === 2);
  const p3 = results.find((r) => r.position === 3);

  const getDriver = (id?: string) => state.drivers.find((d) => d.id === id);
  const getTeam = (id?: string) => state.teams.find((t) => t.id === id);

  const handleCopyResults = () => {
    let text = `=== RESULTADOS DA ${race?.name.toUpperCase()} ===\n`;
    results.forEach((r) => {
      const d = getDriver(r.driverId);
      const t = getTeam(r.teamId);
      text += `P${r.position} - #${d?.number} ${d?.name} (${t?.shortCode}) - Melh. Volta: ${r.bestLapFormatted} - Última: ${r.lastLapFormatted} - Pontos: ${store.getOfficialPoints(r.position)}\n`;
    });
    navigator.clipboard?.writeText(text);
    setCopied(true);
    onShowToast('Resultados copiados para a área de transferência!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Seção 1: Central de Resultados da Prova Selecionada */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Resultados Oficiais — {race?.name}</span>
              {race && <RaceStatusBadge status={race.status} currentLap={race.currentLap} />}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {race?.highlights ?? 'Classificação completa e distribuição oficial de pontos.'}
            </p>
          </div>

          <button
            onClick={handleCopyResults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold border border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copiar Resultados</span>
          </button>
        </div>

        {/* Pódio (Destaque 1º, 2º e 3º) */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1º Lugar */}
            <div className="bg-gradient-to-b from-amber-500/20 to-slate-800/80 border-2 border-amber-500/60 rounded-xl p-4 text-center shadow-lg relative order-1 md:order-2">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase flex items-center gap-1 shadow">
                <Trophy className="w-3 h-3" /> 1º Lugar
              </div>
              <div className="pt-2">
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Vencedor (+10 pts)</div>
                <h3 className="text-lg font-black text-white mt-1">{getDriver(p1?.driverId)?.name}</h3>
                <span className="text-xs text-slate-300">{getTeam(p1?.teamId)?.name}</span>
                <div className="mt-3 pt-3 border-t border-amber-500/30 flex justify-around text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Melhor Volta</span>
                    <strong className="text-amber-300 font-mono">{p1?.bestLapFormatted}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Última Volta</span>
                    <strong className="text-amber-300 font-mono">{p1?.lastLapFormatted}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 2º Lugar */}
            <div className="bg-slate-800/80 border border-slate-600 rounded-xl p-4 text-center shadow relative order-2 md:order-1">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-300 text-slate-900 font-bold text-xs uppercase flex items-center gap-1 shadow">
                <Medal className="w-3 h-3" /> 2º Lugar
              </div>
              <div className="pt-2">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">+6 pontos</div>
                <h3 className="text-base font-bold text-white mt-1">{getDriver(p2?.driverId)?.name}</h3>
                <span className="text-xs text-slate-300">{getTeam(p2?.teamId)?.name}</span>
                <div className="mt-3 pt-3 border-t border-slate-700 flex justify-around text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Melhor Volta</span>
                    <strong className="text-slate-200 font-mono">{p2?.bestLapFormatted}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Última Volta</span>
                    <strong className="text-slate-200 font-mono">{p2?.lastLapFormatted}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 3º Lugar */}
            <div className="bg-slate-800/80 border border-amber-800/60 rounded-xl p-4 text-center shadow relative order-3">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-700 text-amber-100 font-bold text-xs uppercase flex items-center gap-1 shadow">
                <Award className="w-3 h-3" /> 3º Lugar
              </div>
              <div className="pt-2">
                <div className="text-xs text-amber-500 font-semibold uppercase tracking-wider">+3 pontos</div>
                <h3 className="text-base font-bold text-white mt-1">{getDriver(p3?.driverId)?.name}</h3>
                <span className="text-xs text-slate-300">{getTeam(p3?.teamId)?.name}</span>
                <div className="mt-3 pt-3 border-t border-slate-700 flex justify-around text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Melhor Volta</span>
                    <strong className="text-slate-200 font-mono">{p3?.bestLapFormatted}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Última Volta</span>
                    <strong className="text-slate-200 font-mono">{p3?.lastLapFormatted}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabela Completa de Resultados */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-300 uppercase tracking-wider text-[11px] border-b border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Pos</th>
                  <th className="py-2.5 px-3">Piloto</th>
                  <th className="py-2.5 px-3">Equipe</th>
                  <th className="py-2.5 px-3">Voltas</th>
                  <th className="py-2.5 px-3">Melhor Volta</th>
                  <th className="py-2.5 px-3">Última Volta</th>
                  <th className="py-2.5 px-3">Bateria</th>
                  <th className="py-2.5 px-3 text-right">Pontos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-medium">
                {results.map((r) => {
                  const driver = getDriver(r.driverId);
                  const team = getTeam(r.teamId);
                  const pts = store.getOfficialPoints(r.position);

                  return (
                    <tr
                      key={r.driverId}
                      className={`hover:bg-slate-700/40 transition ${
                        r.position <= 3 ? 'bg-slate-800/90 font-semibold' : ''
                      }`}
                    >
                      <td className="py-2 px-3">
                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-black ${
                            r.position === 1
                              ? 'bg-amber-500 text-slate-950'
                              : r.position === 2
                              ? 'bg-slate-300 text-slate-950'
                              : r.position === 3
                              ? 'bg-amber-700 text-white'
                              : 'text-slate-400'
                          }`}
                        >
                          {r.position}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-100">
                        #{driver?.number} {driver?.name}
                      </td>
                      <td className="py-2 px-3 text-slate-300">{team?.name}</td>
                      <td className="py-2 px-3 text-slate-400">{r.lapsCompleted}/20</td>
                      <td className="py-2 px-3 font-mono text-emerald-400">{r.bestLapFormatted}</td>
                      <td className="py-2 px-3 font-mono text-slate-300">{r.lastLapFormatted}</td>
                      <td className="py-2 px-3 font-mono text-slate-400">{r.activeBatteryId}</td>
                      <td className="py-2 px-3 text-right font-black text-sky-400">
                        {pts > 0 ? `+${pts}` : '0'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legenda do Regulamento Oficial */}
        <div className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-lg flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              <strong>Regra de Pontuação Oficial:</strong> 1º = 10 pts, 2º = 6 pts, 3º = 3 pts, 4º = 2 pts, 5º = 1 pt, 6º ao 12º = 0 pt.
            </span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Reconhecimento em vez de memorização
          </span>
        </div>
      </section>

      {/* Seção 2: Classificação Geral do Campeonato (Acumulada por Prova) */}
      <section className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-sky-400" />
              <span>Classificação Geral do Campeonato</span>
            </h2>
            <p className="text-xs text-slate-400">
              Evolução histórica acumulada, pontuação e critérios de desempate.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs Pilotos vs Equipes */}
            <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
              <button
                onClick={() => setStandingsTab('drivers')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  standingsTab === 'drivers'
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pilotos (12)
              </button>
              <button
                onClick={() => setStandingsTab('teams')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  standingsTab === 'teams'
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Equipes (6)
              </button>
            </div>

            {/* Filtro Histórico de Prova */}
            <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Acumulado até:</span>
              <select
                value={historicalRaceFilter}
                onChange={(e) => setHistoricalRaceFilter(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value={1}>Prova 1</option>
                <option value={2}>Prova 2</option>
                <option value={3}>Prova 3</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabela de Classificação */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            {standingsTab === 'drivers' ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-300 uppercase tracking-wider text-[11px] border-b border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Pos</th>
                    <th className="py-2.5 px-3">Piloto</th>
                    <th className="py-2.5 px-3">Equipe</th>
                    <th className="py-2.5 px-3 text-center">P1</th>
                    <th className="py-2.5 px-3 text-center">P2</th>
                    <th className="py-2.5 px-3 text-center">P3</th>
                    <th className="py-2.5 px-3 text-center">Vitórias</th>
                    <th className="py-2.5 px-3 text-right">Gap Líder</th>
                    <th className="py-2.5 px-3 text-right">Gap Anterior</th>
                    <th className="py-2.5 px-3 text-right">Total Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {driverStandings.map((ds) => (
                    <tr key={ds.driverId} className="hover:bg-slate-700/30 transition">
                      <td className="py-2 px-3 font-bold">{ds.position}º</td>
                      <td className="py-2 px-3 font-semibold text-slate-100">
                        #{ds.carNumber} {ds.driverName}
                      </td>
                      <td className="py-2 px-3 text-slate-300">{ds.teamName}</td>
                      <td className="py-2 px-3 text-center font-mono text-slate-400">{ds.pointsByRace[1] ?? '—'}</td>
                      <td className="py-2 px-3 text-center font-mono text-slate-400">{ds.pointsByRace[2] ?? '—'}</td>
                      <td className="py-2 px-3 text-center font-mono text-slate-400">{ds.pointsByRace[3] ?? '—'}</td>
                      <td className="py-2 px-3 text-center text-amber-400 font-bold">{ds.wins}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-400">
                        {ds.gapToLeader > 0 ? `-${ds.gapToLeader} pts` : '—'}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-400">
                        {ds.gapToAhead > 0 ? `-${ds.gapToAhead} pts` : '—'}
                      </td>
                      <td className="py-2 px-3 text-right font-black text-amber-400 text-sm">
                        {ds.totalPoints} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-300 uppercase tracking-wider text-[11px] border-b border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Pos</th>
                    <th className="py-2.5 px-3">Equipe</th>
                    <th className="py-2.5 px-3">Pilotos (Pontos Individuais)</th>
                    <th className="py-2.5 px-3 text-center">P1</th>
                    <th className="py-2.5 px-3 text-center">P2</th>
                    <th className="py-2.5 px-3 text-center">P3</th>
                    <th className="py-2.5 px-3 text-right">Gap Líder</th>
                    <th className="py-2.5 px-3 text-right">Total Pontos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {teamStandings.map((ts) => (
                    <tr key={ts.teamId} className="hover:bg-slate-700/30 transition">
                      <td className="py-2.5 px-3 font-bold">{ts.position}º</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-100">
                        {ts.teamName} ({ts.shortCode})
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {ts.driverScores.map((ds) => `${ds.driverName}: ${ds.points}p`).join(' + ')}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-400">{ts.pointsByRace[1] ?? '—'}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-400">{ts.pointsByRace[2] ?? '—'}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-400">{ts.pointsByRace[3] ?? '—'}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                        {ts.gapToLeader > 0 ? `-${ts.gapToLeader} pts` : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-amber-400 text-sm">
                        {ts.totalPoints} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
