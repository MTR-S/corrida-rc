import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { App } from '../App';
import { ChampionshipStore } from '../../domain/ChampionshipStore';
import { InMemoryAdapter } from '../../domain/storage';

describe('DashboardView — Painel Estratégico, Comparativo Lado a Lado e Simulação da Prova 4 (Issue #3)', () => {
  let storage: InMemoryAdapter;
  let store: ChampionshipStore;

  beforeEach(() => {
    storage = new InMemoryAdapter();
    store = new ChampionshipStore(storage);
  });

  it('deve exibir lado a lado os dois Pilotos da Equipe selecionada com posição atual, última volta, média das últimas 3 voltas, melhor volta e delta entre a dupla', () => {
    render(<App store={store} />);

    // Equipe padrão: Nitro RC (Lucas Silveira #7 e Pedro Santos #12)
    const lucasCard = screen.getByTestId('driver-telemetry-card-drv-lucas-silveira');
    const pedroCard = screen.getByTestId('driver-telemetry-card-drv-pedro-santos');

    expect(lucasCard).toBeInTheDocument();
    expect(pedroCard).toBeInTheDocument();

    // Lucas Silveira: P3 na Prova 4
    expect(within(lucasCard).getByText('Lucas Silveira')).toBeInTheDocument();
    expect(within(lucasCard).getByText('P3')).toBeInTheDocument();
    expect(within(lucasCard).getAllByText('23.320s').length).toBeGreaterThanOrEqual(1); // Última volta (V14)
    expect(within(lucasCard).getByText('22.803s')).toBeInTheDocument(); // Média últimas 3v (12, 13, 14)
    expect(within(lucasCard).getByText('21.110s')).toBeInTheDocument(); // Melhor volta
    expect(within(lucasCard).getByText(/Δ Dupla:/i)).toBeInTheDocument();

    // Pedro Santos: P6 na Prova 4
    expect(within(pedroCard).getByText('Pedro Santos')).toBeInTheDocument();
    expect(within(pedroCard).getByText('P6')).toBeInTheDocument();
    expect(within(pedroCard).getByText(/Δ Dupla:/i)).toBeInTheDocument();
  });

  it('deve reproduzir na Prova 4 o cenário do Técnico Beto (Lucas Silveira em P3 com queda de ritmo nas últimas 3 voltas e alerta de autonomia)', () => {
    render(<App store={store} />);

    const lucasCard = screen.getByTestId('driver-telemetry-card-drv-lucas-silveira');
    expect(within(lucasCard).getByText('P3')).toBeInTheDocument();
    expect(within(lucasCard).getByText(/Queda nas 3v/i)).toBeInTheDocument();
    expect(within(lucasCard).getByText(/Atenção: Poupar/i)).toBeInTheDocument();
    expect(within(lucasCard).getByText(/Limite de autonomia/i)).toBeInTheDocument();

    // Na tabela comparativa de voltas deve destacar "Queda de Ritmo"
    const lapTable = screen.getByRole('table', { name: /Tabela Comparativa de Voltas da Dupla/i });
    expect(within(lapTable).getAllByText(/Queda de Ritmo/i).length).toBeGreaterThanOrEqual(2);
  });

  it('deve permitir identificar rapidamente qual dos dois Pilotos da Equipe registrou o melhor tempo de Volta em qualquer Prova (1 a 4) e inspecionar qualquer das 6 Equipes', () => {
    render(<App store={store} />);

    // Prova 4 inicial
    const duoSummaryP4 = screen.getByTestId('duo-fastest-lap-summary');
    expect(duoSummaryP4).toHaveTextContent(/Lucas Silveira/i);

    // Alternar para Prova 2 via seletor global
    fireEvent.click(screen.getByRole('button', { name: /Selecionar Prova 2/i }));
    const duoSummaryP2 = screen.getByTestId('duo-fastest-lap-summary');
    expect(duoSummaryP2).toHaveTextContent(/Pedro Santos/i);

    // Alternar para Prova 1
    fireEvent.click(screen.getByRole('button', { name: /Selecionar Prova 1/i }));
    const duoSummaryP1 = screen.getByTestId('duo-fastest-lap-summary');
    expect(duoSummaryP1).toHaveTextContent(/Lucas Silveira/i);

    // Inspecionar outra equipe (Apex Racing)
    const teamSelect = screen.getByLabelText(/Selecionar Equipe no Painel Estratégico/i);
    fireEvent.change(teamSelect, { target: { value: 'apex-racing' } });
    expect(store.getState().selectedTeamId).toBe('apex-racing');
    expect(screen.getByTestId('driver-telemetry-card-drv-gabriel-ramos')).toBeInTheDocument();
    expect(screen.getByTestId('driver-telemetry-card-drv-felipe-duarte')).toBeInTheDocument();
  });

  it('deve exibir os pontos atuais de cada Piloto, a soma total da Equipe na Classificação Geral e os pontos projetados na Prova conforme a regra 10-6-3-2-1-0', () => {
    render(<App store={store} />);

    // Na Prova 4 (acumulado das Provas 1 a 3):
    // Lucas Silveira: P1 (10) + P4 (2) + P3 (3) = 15 pts
    // Pedro Santos: P4 (2) + P3 (3) + P6 (0) = 5 pts
    // Soma da Nitro RC = 20 pts
    expect(screen.getByText('20 pts')).toBeInTheDocument();
    expect(screen.getByText(/Lucas Silveira: 15 pts \+ Pedro Santos: 5 pts/i)).toBeInTheDocument();

    // Pontos projetados na Prova 4: Lucas P3 (3 pts) + Pedro P6 (0 pts) = +3 pts
    expect(screen.getByText(/\+3 pts/i)).toBeInTheDocument();
    expect(screen.getByText(/Lucas Silveira: P3 \(3 pts\) • Pedro Santos: P6 \(0 pts\)/i)).toBeInTheDocument();
  });

  it('deve atualizar instantaneamente a projeção de Autonomia da Bateria até a Volta 20 ao alterar a Estratégia de Ritmo e permitir Desfazer', () => {
    render(<App store={store} />);

    const lucasCard = screen.getByTestId('driver-telemetry-card-drv-lucas-silveira');

    // Inicialmente em modo Normal: ~6v de autonomia (alerta Atenção)
    expect(within(lucasCard).getByText(/Limite de autonomia/i)).toBeInTheDocument();

    // Selecionar "Poupar Bateria" para Lucas Silveira
    const saveBtn = within(lucasCard).getByRole('button', { name: /Estratégia Poupar Bateria para Lucas Silveira/i });
    fireEvent.click(saveBtn);

    // Agora deve projetar ~8 voltas e indicar que completa as 6 voltas restantes com segurança
    expect(within(lucasCard).getByText(/Completa as 6 voltas restantes com segurança \(~8 voltas de autonomia\)/i)).toBeInTheDocument();
    expect(within(lucasCard).getByText(/Ideal \(~8 v\.\)/i)).toBeInTheDocument();

    // Selecionar "Ataque" para Lucas Silveira
    const attackBtn = within(lucasCard).getByRole('button', { name: /Estratégia Ataque para Lucas Silveira/i });
    fireEvent.click(attackBtn);

    // Agora projeta ~4 voltas (insuficiente para 6 voltas restantes)
    expect(within(lucasCard).getByText(/Bateria insuficiente \(~4v estimadas p\/ 6v restantes\)/i)).toBeInTheDocument();

    // Desfazer volta para Poupar Bateria
    fireEvent.keyDown(window, { key: 'u' });
    expect(within(lucasCard).getByText(/Completa as 6 voltas restantes com segurança/i)).toBeInTheDocument();
  });

  it('deve permitir pausar/retomar (botão e atalho Espaço) e avançar uma Volta na simulação da Prova 4', () => {
    render(<App store={store} />);

    expect(store.getState().isSimulationPaused).toBe(false);

    // Pressionar barra de espaço pausa a simulação
    fireEvent.keyDown(window, { key: ' ', code: 'Space' });
    expect(store.getState().isSimulationPaused).toBe(true);
    expect(screen.getByRole('button', { name: /Retomar simulação/i })).toBeInTheDocument();

    // Clicar no botão retoma a simulação
    fireEvent.click(screen.getByRole('button', { name: /Retomar simulação/i }));
    expect(store.getState().isSimulationPaused).toBe(false);

    // Avançar uma volta (Volta 14 -> Volta 15)
    const advanceBtn = screen.getByRole('button', { name: /Avançar uma Volta na simulação/i });
    fireEvent.click(advanceBtn);

    expect(store.getState().races[4].currentLap).toBe(15);
    expect(screen.getByText(/Simulação Prova 4 \(Volta 15\/20\):/i)).toBeInTheDocument();
  });
});
