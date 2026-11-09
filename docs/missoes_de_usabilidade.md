# Documento das Missões de Usabilidade (Avaliação Cruzada)
**Projeto:** Plataforma Digital para Campeonato de Corrida de Carros por Controle Remoto (RC)  
**Curso:** Engenharia de Computação – Instituto Federal do Ceará (IFCE Fortaleza)  
**Disciplina:** Interação Humano-Computador (IHC) – Semestre 2026.2  
**Dupla Web:** Matheus de Sousa Almeida e Vinícius Silva Pereira  
**Avaliadores:** Dupla App (responsável pela avaliação cruzada da interface Web)

---

## 1. Diretrizes Metodológicas da Avaliação Cruzada

Este documento contém o conjunto oficial de **Missões de Usabilidade** elaborado pela Dupla Web para conduzir a avaliação da interface Web por parte da Dupla App, conforme estipulado na **Seção 6 do edital do Trabalho Final**.

### 1.1 Princípios de Formulação das Missões
Para resguardar a validade metodológica dos testes de usabilidade:
1.  **Apresentação por Objetivos:** Cada missão é formulada estritamente em termos da situação real do usuário e dos resultados a serem alcançados, sem ensinar o avaliador a navegar, sem antecipar caminhos e sem mencionar nomes de menus, abas, botões ou controles específicos da interface.
2.  **Estado Determinístico:** A aplicação Web carrega dados previamente fixados e reproduzíveis. Caso o avaliador necessite reiniciar o cenário de teste, basta acionar o controle de restauração de dados para retornar ao estado original.
3.  **Observação dos Avaliadores (Conforme Seção 6.2 do Edital):**
    *   Verificar se a missão foi concluída satisfatoriamente;
    *   Registrar dificuldades encontradas, erros cometidos e eventuais excessos de passos;
    *   Avaliar clareza do feedback, legibilidade e localização das informações;
    *   Preencher o **Parecer Técnico de Usabilidade** fundamentado nos Critérios Ergonômicos de Bastien e Scapin e nas Heurísticas de Nielsen.

### 1.2 Estrutura das Seis Missões do Projeto
*   **Frente 1 (Elaboradas por Matheus de Sousa Almeida):**
    *   **Missão 1:** Comparação de tempos de volta entre dois pilotos da mesma equipe em uma prova concluída.
    *   **Missão 2:** Consulta da quantidade de voltas completadas com uma bateria e diagnóstico de autonomia energética.
    *   **Missão 3:** Análise estratégica de posição/ritmo e cálculo da pontuação somada da equipe no campeonato.
*   **Frente 2 (Elaboradas por Vinícius Silva Pereira — Vide Issue #8):**
    *   **Missão 4:** Identificação do pódio, resultados completos e volta decisiva de uma prova.
    *   **Missão 5:** Consulta da Classificação Geral e diferença de pontos após determinada etapa.
    *   **Missão 6:** Localização de comunicados de equipe no Feed da Corrida e geração de Boletim de Imprensa.

---

## 2. Missões de Usabilidade da Frente 1 (Técnico de Equipe)
*Elaboradas por Matheus de Sousa Almeida*

### Missão de Usabilidade 1: Comparação de Desempenho e Tempos de Volta na Equipe

*   **Persona:** Roberto "Beto" Almeida (Técnico e Estrategista da equipe "Nitro RC").
*   **Contexto:** Roberto está analisando o histórico da 2ª Prova do Campeonato (Circuito Velocidade Norte) para avaliar a velocidade pura dos carros de sua equipe e decidir ajustes de suspensão para as próximas corridas.
*   **Objetivo:** Descobrir qual dos dois pilotos da equipe Nitro RC registrou o melhor tempo de volta individual durante a 2ª Prova e qual foi o tempo exato dessa volta.
*   **Critério de Sucesso e Gabarito Determinístico:**  
    A missão será considerada concluída com êxito quando o avaliador localizar a telemetria da 2ª Prova e extrair os seguintes dados objetivos:
    *   **Piloto mais rápido da Nitro RC na 2ª Prova:** Bruno "Viper" Costa (Carro #12);
    *   **Tempo da melhor volta de Bruno Costa:** `18.240 segundos` (registrado na Volta 8);
    *   *Dados para conferência do avaliador:* Lucas Silveira (Carro #11) cravou sua melhor volta em `18.410 segundos` (Volta 6). Portanto, Bruno Costa foi o piloto mais veloz da equipe na Prova 2, com uma vantagem (delta) de `0.170 segundos`.

---

### Missão de Usabilidade 2: Consulta de Voltas da Bateria e Diagnóstico de Autonomia

*   **Persona:** Roberto "Beto" Almeida (Técnico e Estrategista da equipe "Nitro RC").
*   **Contexto:** Durante a 4ª Prova do Campeonato, que se encontra em andamento na Volta 14 de 20, Beto acompanha a perda de ritmo de Lucas Silveira e precisa verificar com urgência se a bateria atual do carro suportará até a bandeirada final sem parada nos boxes.
*   **Objetivo:** Verificar a quantidade exata de voltas já realizadas com a bateria atualmente instalada no carro do piloto Lucas Silveira na 4ª Prova e qual o diagnóstico do estado de autonomia dessa bateria.
*   **Critério de Sucesso e Gabarito Determinístico:**  
    A missão será considerada concluída com êxito quando o avaliador inspecionar as condições energéticas de Lucas Silveira na Prova 4 e reportar com exatidão:
    *   **Voltas completadas com a bateria atual (Bateria #1):** `14 voltas`;
    *   **Nível e tensão de bateria:** Carga em `22%` e tensão em `6.78V`;
    *   **Projeção de voltas adicionais no ritmo corrente:** `4 voltas`;
    *   **Diagnóstico / Status de autonomia:** Alerta de `Atenção: Poupar` (ou `Atenção: Poupar Bateria`), indicando visualmente e textualmente que a bateria atual não suporta as 6 voltas restantes para completar as 20 voltas da corrida caso o piloto mantenha o ritmo sem poupar equipamento.

---

### Missão de Usabilidade 3: Avaliação de Ritmo de Pista e Pontuação Somada da Equipe

*   **Persona:** Roberto "Beto" Almeida (Técnico e Estrategista da equipe "Nitro RC").
*   **Contexto:** Ainda durante a 4ª Prova em andamento, Beto precisa avaliar a situação tática da Nitro RC na disputa pelo campeonato geral, confrontando a pontuação acumulada nas etapas anteriores com a projeção de pontos que a dupla de pilotos somará caso conservem as colocações da volta atual.
*   **Objetivo:** Obter a pontuação acumulada da equipe Nitro RC nas três primeiras provas do Campeonato e verificar quantos pontos a equipe está projetando somar nesta 4ª Prova a partir das posições parciais dos seus dois pilotos.
*   **Critério de Sucesso e Gabarito Determinístico:**  
    A missão será considerada concluída com êxito quando o avaliador cruzar as informações da Classificação Geral acumulada com a Prova 4 e apontar os seguintes valores exatos:
    *   **Pontuação acumulada da Nitro RC nas Provas 1 a 3:** `24 pontos` (soma dos pontos obtidos por Lucas Silveira e Bruno Costa nas etapas 1, 2 e 3);
    *   **Posições parciais na 4ª Prova (Volta 14):**
        *   Lucas Silveira: `3º colocado` (rende 3 pontos pela tabela oficial);
        *   Bruno Costa: `5º colocado` (rende 1 ponto pela tabela oficial);
    *   **Pontuação somada projetada para a equipe Nitro RC na 4ª Prova:** `4 pontos` (3 pontos de Lucas + 1 ponto de Bruno = 4 pontos, calculados conforme a regra oficial `10 - 6 - 3 - 2 - 1 - 0`);
    *   **Pontuação total projetada no campeonato após a 4ª Prova:** `28 pontos` (24 pontos acumulados + 4 pontos projetados).

---

## 3. Missões de Usabilidade da Frente 2 (Repórter)
*Elaboradas por Vinícius Silva Pereira (Vide Issue #8 para o detalhamento final)*

*   **Missão de Usabilidade 4:** Identificação do pódio completo da 3ª Prova (1º, 2º e 3º colocados), tempo total e tempo da volta final do vencedor (incluindo o momento da ultrapassagem decisiva na Volta 20).
*   **Missão de Usabilidade 5:** Consulta da tabela de Classificação Geral do Campeonato acumulada após a 3ª Prova, identificando o líder, sua pontuação total e a diferença de pontos para o concorrente direto.
*   **Missão de Usabilidade 6:** Localização das publicações oficiais da equipe derrotada na 3ª Prova no Feed da Corrida e utilização dos dados no estúdio de redação do Boletim de Imprensa.

---

## 4. Roteiro e Orientações para a Dupla Avaliadora (Dupla App)

1.  **Início da Sessão:** Abra a aplicação Web em navegador desktop (resolução recomendada: 1280x720 ou superior).
2.  **Sem Instruções Prévias:** Não solicite aos desenvolvedores orientações sobre caminhos ou formas de navegação pela interface. A plataforma deve ser autoexplicativa conforme os Critérios de Bastien & Scapin e as Heurísticas de Nielsen.
3.  **Registro de Observações:** Ao executar cada missão, anote no **Parecer Técnico de Usabilidade**:
    *   Tempo aproximado de localização da informação;
    *   Dúvidas ou hesitações durante a busca;
    *   Eficácia dos atalhos de teclado e legibilidade do tema Pit Lane;
    *   Problemas de interação ou ambiguidades textuais.
4.  **Restauração:** Caso altere simulações ou estratégias e deseje reiniciar o campeonato do zero, utilize o botão de restauração de dados da avaliação disponível na plataforma.
