import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { App } from './App';
import { ChampionshipStore } from '../domain/ChampionshipStore';
import { InMemoryAdapter } from '../domain/storage';

describe('Shell de Navegação da SPA, Temas e Controles Globais (App)', () => {
  let storage: InMemoryAdapter;
  let store: ChampionshipStore;

  beforeEach(() => {
    storage = new InMemoryAdapter();
    store = new ChampionshipStore(storage);
  });

  it('deve inicializar e renderizar o shell com as 5 Provas e status semânticos', () => {
    render(<App store={store} />);

    expect(screen.getByText(/CAMPEONATO RC/i)).toBeInTheDocument();

    // Seletor de provas com dupla codificação semântica
    expect(screen.getByRole('button', { name: /Selecionar Prova 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Selecionar Prova 2/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Selecionar Prova 3/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Selecionar Prova 4/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Selecionar Prova 5/i })).toBeInTheDocument();

    // Status textual presente nos seletores
    expect(screen.getAllByText(/Concluída/i).length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText(/Ao Vivo \(14\/20\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Agendada/i)).toBeInTheDocument();
  });

  it('deve alternar a Prova selecionada ao clicar no seletor global', () => {
    render(<App store={store} />);

    // Inicialmente Prova 4 está selecionada
    expect(store.getState().selectedRaceNumber).toBe(4);

    // Clicar na Prova 2
    const btnRace2 = screen.getByRole('button', { name: /Selecionar Prova 2/i });
    fireEvent.click(btnRace2);

    expect(store.getState().selectedRaceNumber).toBe(2);
  });

  it('deve responder aos atalhos de teclado 1 a 5 para seleção de Prova', () => {
    render(<App store={store} />);

    // Pressionar tecla '3'
    fireEvent.keyDown(window, { key: '3' });
    expect(store.getState().selectedRaceNumber).toBe(3);

    // Pressionar tecla '1'
    fireEvent.keyDown(window, { key: '1' });
    expect(store.getState().selectedRaceNumber).toBe(1);
  });

  it('deve alternar o foco de trabalho entre Técnico (Beto) e Repórter (Camila)', () => {
    render(<App store={store} />);

    // Inicialmente Técnico de Equipe
    expect(store.getState().selectedPersona).toBe('tech_lead');

    // Clicar no botão Repórter
    const btnReporter = screen.getByRole('button', { name: /Repórter \(Camila\)/i });
    fireEvent.click(btnReporter);

    expect(store.getState().selectedPersona).toBe('reporter');
    // Contextualmente muda a visualização para resultados
    expect(store.getState().currentView).toBe('results');
  });

  it('deve alternar entre Modo Escuro (Pit Lane) e Modo Claro (Arquibancada)', () => {
    render(<App store={store} />);

    expect(store.getState().theme).toBe('dark');

    // Alternar via botão de tema
    const themeBtn = screen.getByRole('button', { name: /Alternar tema/i });
    fireEvent.click(themeBtn);

    expect(store.getState().theme).toBe('light');

    // Alternar via atalho de teclado 't'
    fireEvent.keyDown(window, { key: 't' });
    expect(store.getState().theme).toBe('dark');
  });

  it('deve abrir o modal de ajuda (?) exibindo a tabela 10-6-3-2-1-0, regra de equipe e atalhos', () => {
    render(<App store={store} />);

    // Modal fechado inicialmente
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Pressionar atalho '?'
    fireEvent.keyDown(window, { key: '?' });

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(within(modal).getByText(/Tabela Oficial de Pontuação por Prova/i)).toBeInTheDocument();
    expect(within(modal).getByText(/10 pts/i)).toBeInTheDocument();
    expect(within(modal).getByText(/6 pts/i)).toBeInTheDocument();
    expect(within(modal).getByText(/3 pts/i)).toBeInTheDocument();
    expect(within(modal).getByText(/2 pts/i)).toBeInTheDocument();
    expect(within(modal).getByText(/1 pt/i)).toBeInTheDocument();
    expect(within(modal).getByText(/soma exata dos pontos obtidos por seus dois Pilotos/i)).toBeInTheDocument();
    expect(within(modal).getByText(/até 4 publicações no feed de cada Prova/i)).toBeInTheDocument();

    // Fechar ao pressionar Escape
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('deve solicitar confirmação explícita ao acionar "Restaurar Dados da Avaliação" e restaurar o estado', () => {
    render(<App store={store} />);

    // Mudar a Prova selecionada para 1
    fireEvent.keyDown(window, { key: '1' });
    expect(store.getState().selectedRaceNumber).toBe(1);

    // Clicar no botão "Restaurar Avaliação"
    const resetBtn = screen.getByRole('button', { name: /Restaurar dados determinísticos/i });
    fireEvent.click(resetBtn);

    // Modal de confirmação preventiva visível
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/Restaurar Dados da Avaliação\?/i)).toBeInTheDocument();

    // Confirmar restauração
    const confirmBtn = screen.getByRole('button', { name: /Sim, Restaurar Dados/i });
    fireEvent.click(confirmBtn);

    // Estado determinístico original restaurado (Prova 4 volta a ser a selecionada por padrão)
    expect(store.getState().selectedRaceNumber).toBe(4);
    expect(store.getState().selectedPersona).toBe('tech_lead');
  });

  it('deve reverter a última alteração com Desfazer (Undo)', () => {
    render(<App store={store} />);

    // Prova 4 inicial
    expect(store.getState().selectedRaceNumber).toBe(4);

    // Mudar para Prova 2
    fireEvent.click(screen.getByRole('button', { name: /Selecionar Prova 2/i }));
    expect(store.getState().selectedRaceNumber).toBe(2);

    // Pressionar tecla 'u' para Desfazer
    fireEvent.keyDown(window, { key: 'u' });
    expect(store.getState().selectedRaceNumber).toBe(4);
  });
});
