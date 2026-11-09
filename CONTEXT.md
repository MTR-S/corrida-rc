# Contexto do Projeto, Arquitetura e Fronteiras de Domínio (CONTEXT.md)

## 1. Visão Geral
A plataforma é uma Single Page Application (SPA) client-side em React, TypeScript e Tailwind CSS, sem backend externo (ADR-0001). Todo o estado e regras de negócio residem no **Motor Determinístico do Campeonato** (`ChampionshipStore`), persistido em `localStorage` no navegador e em memória (`InMemoryAdapter`) nos testes.

## 2. Personas Centrais da Dupla Web
1. **Roberto "Beto" Almeida (Técnico de Equipe — Equipe "Nitro RC"):**
   - Atua no *pit lane* com notebook.
   - Necessita de visibilidade situacional em menos de 5 segundos.
   - Foco: Comparativo lado a lado dos dois pilotos da sua equipe, tempos de volta, telemetria e autonomia de bateria (estimativa de voltas restantes vs voltas da prova), decisão de ritmo (*Ataque*, *Normal*, *Poupar Bateria*) e troca de bateria na Prova 4 ao vivo.
2. **Camila Rocha (Repórter — Canal "RC em Foco"):**
   - Atua na sala de imprensa/arquibancada com várias abas abertas e prazo inferior a 10 minutos após o encerramento da prova.
   - Foco: Resultados rápidos da prova (pódio 1º-3º, volta mais rápida, última volta do vencedor na Prova 3), tabela de pontuação oficial, evolução da Classificação Geral por prova, feed de comunicados das equipes (até 4 por prova) e estúdio de geração/cópia de Boletim de Imprensa.

## 3. Modelo do Campeonato
- **6 Equipes:** Cada uma com exatamente 2 Pilotos (12 Pilotos no total).
  - *Nitro RC (NIT)*: Chefe Beto Almeida. Pilotos: Lucas Silveira (#7) e Pedro Santos (#12).
  - *Apex Racing (APX)*: Chefe Carlos Moura. Pilotos: Gabriel Ramos (#3) e Felipe Duarte (#11).
  - *Turbo Vortex (VRX)*: Chefe Daniel Lima. Pilotos: Bruno Rocha (#5) e Thiago Costa (#19).
  - *Lightning Bolt (LTN)*: Chefe Eduardo Castro. Pilotos: Rafael Silva (#8) e Marcos Souza (#23).
  - *Fusion Motorsport (FUS)*: Chefe Leonardo Paiva. Pilotos: André Martins (#2) e Rodrigo Lima (#14).
  - *Shadow Precision (SDW)*: Chefe Marcelo Braga. Pilotos: Vinícius Prado (#9) e Gustavo Pires (#17).
- **5 Provas:** Cada uma com 20 voltas.
  - Provas 1, 2 e 3: *Concluída* (incluindo o desfecho dramático na volta 20 da Prova 3 com vitória de Gabriel Ramos e reação no feed da Turbo Vortex).
  - Prova 4: *Em Andamento / Ao Vivo* (volta 14 de 20, Lucas Silveira em 3º com ritmo em declínio e bateria perto do limite).
  - Prova 5: *Agendada* (0 de 20 voltas).
- **Regulamento Oficial de Pontuação:**
  - 1º lugar: 10 pontos
  - 2º lugar: 6 pontos
  - 3º lugar: 3 pontos
  - 4º lugar: 2 pontos
  - 5º lugar: 1 ponto
  - Demais (6º ao 12º): 0 ponto
  - Pontuação da Equipe = soma exata dos pontos dos seus dois pilotos.
- **Feed da Corrida:** Limite estrito de no máximo 4 publicações por equipe por prova.
- **Controle e Liberdade do Usuário:** Ação de Desfazer (*Undo*) para reverter mutações e botão *"Restaurar Dados da Avaliação"* com modal de confirmação.

## 4. Fundamentação em IHC
- **Bastien & Scapin:** Condução (presteza, agrupamento/distinção, feedback imediato), Carga de trabalho (brevidade e densidade informacional), Controle explícito (ações sob comando, undo), Adaptabilidade (modos de persona e temas claro/escuro), Gestão de erros (prevenção e confirmação preventiva), Homogeneidade/coerência, Significado dos códigos (dupla codificação semântica: cor + ícone + texto), Compatibilidade.
- **10 Heurísticas de Nielsen:** Visibilidade do estado do sistema, Correspondência com o mundo real, Controle e liberdade do usuário, Consistência e padrões, Prevenção de erros, Reconhecimento em vez de memorização, Flexibilidade e eficiência de uso, Design estético e minimalista, Diagnóstico e recuperação de erros, Ajuda e documentação (modal `?`).
