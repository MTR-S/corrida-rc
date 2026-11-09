# Documento de Concepção da Plataforma Digital Web
**Projeto:** Plataforma Digital para Campeonato de Corrida de Carros por Controle Remoto (RC)  
**Curso:** Engenharia de Computação – Instituto Federal do Ceará (IFCE Fortaleza)  
**Disciplina:** Interação Humano-Computador (IHC) – Semestre 2026.2  
**Equipe (Dupla Web):**
*   **Matheus de Sousa Almeida** (Frente 1: Técnico de Equipe, Fundação SPA & Missões 1 a 3)
*   **Vinícius Silva Pereira** (Frente 2: Repórter, Central de Resultados/Feed/Imprensa & Missões 4 a 6)

---

## 1. Visão Geral do Projeto e Contexto do Sistema

Este documento formaliza a concepção da interface digital para navegadores Web destinada ao acompanhamento completo de um Campeonato de corrida de carros por controle remoto (RC). O projeto atende rigorosamente às diretrizes do edital da disciplina de Interação Humano-Computador (IHC), estruturando-se a partir dos princípios do **Design Centrado no Usuário (DCU)**, dos **Oito Critérios Ergonômicos de Bastien e Scapin** e das **Dez Heurísticas de Usabilidade de Nielsen**.

A aplicação Web foi concebida como uma *Single Page Application* (SPA) de alta performance executada 100% no cliente (*client-side*), com arquitetura desacoplada e estado determinístico local persistido em navegador. Este estado permite reproduzir cenários realistas de telemetria esportiva e garante a execução repetível e auditável das missões de usabilidade durante a avaliação cruzada com a Dupla App.

### 1.1 Regulamento Oficial do Campeonato RC
Conforme as especificações do edital (Seções 4.1 e 4.2):
*   **Estrutura de Provas:** O Campeonato é composto por exatamente **5 Provas** de asfalto/circuito fechado, cada uma com extensão regulamentar de **20 Voltas**.
*   **Grid de Largada:** O Campeonato conta com **6 Equipes** fixas, onde cada equipe possui obrigatoriamente **2 Pilotos** titulares (totalizando **12 Pilotos** no grid).
*   **Regra Oficial de Pontuação por Prova:**
    *   1º lugar: **10 pontos**
    *   2º lugar: **6 pontos**
    *   3º lugar: **3 pontos**
    *   4º lugar: **2 pontos**
    *   5º lugar: **1 ponto**
    *   Demais posições (6º ao 12º lugar): **0 ponto**
*   **Pontuação de Equipe:** Calculada dinamicamente pela soma exata dos pontos obtidos pelos seus dois pilotos na prova e acumulados ao longo do torneio.
*   **Feed da Corrida:** Cada equipe tem a prerrogativa regulamentar de realizar **até 4 publicações** no feed oficial de cada prova, garantindo espaço para comunicados técnicos, bastidores e declarações sem saturação informacional.

### 1.2 Estado Determinístico do Campeonato para Avaliação Cruzada
Para permitir que os avaliadores executem as tarefas com precisão factual e confiram os gabaritos objetivos das missões de usabilidade, a plataforma inicializa com um estado determinístico estruturado:
*   **Provas 1, 2 e 3 (Status: Concluída):** Resultados finais consolidados, histórico volta a volta de todos os 12 pilotos, tempos de volta, dados de baterias consumidas, incidentes e publicações de equipe no feed. Na Prova 3, destaca-se a ultrapassagem decisiva na última volta (Volta 20) e as publicações pós-corrida.
*   **Prova 4 (Status: Em Andamento / Ao Vivo):** Encontra-se na **Volta 14 de 20**. Reproduz o momento crítico vivenciado pelo Técnico de Equipe: o Piloto A da equipe Nitro RC está na 3ª posição buscando o 2º lugar, porém com perda de rendimento nas últimas 3 voltas e bateria no limite de segurança, demandando intervenção tática imediata.
*   **Prova 5 (Status: Agendada):** Etapa final com programação, circuito e projeções de título.

---

## 2. Parte 1: Frente 1 — Técnico de Equipe e Fundamentação em IHC
*Responsável: Matheus de Sousa Almeida*

### 2.1 Persona 1: O Estrategista de Pit Lane

```
+---------------------------------------------------------------------------------+
| PERSONA 1: ROBERTO "BETO" ALMEIDA                                              |
| Chefe de Mecânica e Técnico Estrategista — Equipe "Nitro RC"                    |
+---------------------------------------------------------------------------------+
| Idade: 42 anos                                                                  |
| Local de Atuação: Pit Lane (tenda de boxes / pista de corrida RC)               |
| Perfil Tecnológico: Intermediário a Avançado em telemetria, hardware e planilhas|
| Dispositivo de Acesso: Notebook em ambiente externo/boxes                      |
+---------------------------------------------------------------------------------+
```

#### 2.1.1 Perfil Pessoal e Tecnológico
Roberto "Beto" Almeida tem 42 anos e dedica-se há mais de 15 anos ao automobilismo de controle remoto em escala 1/10 elétrico. Atua como Chefe de Mecânica e Técnico de Equipe da escuderia **Nitro RC**. Beto é focado em rendimento mecânico, telemetria eletrônica e gerenciamento de baterias LiPo (Polímero de Lítio). Beto opera seu notebook na bancada da tenda de boxes (*pit lane*), frequentemente sob variações de luminosidade (sol intenso ou sombras da cobertura de box), com barulho constante dos motores elétricos e tempo de resposta curtíssimo.

Possui facilidade com softwares de telemetria e gráficos analíticos, mas possui baixíssima tolerância para interfaces lentas, poluídas, com animações desnecessárias ou que escondam dados críticos atrás de menus profundos. Ele valoriza densidade informacional clara, atalhos de teclado que dispensem o uso do mouse ou touchpad e leitura instantânea de métricas em menos de 5 segundos.

#### 2.1.2 Objetivos e Necessidades
1.  **Monitoramento Simultâneo dos Pilotos:** Acompanhar em uma única visualização o desempenho em tempo real dos dois pilotos da sua equipe (Lucas Silveira e Bruno Costa) durante a prova.
2.  **Comparação Lado a Lado de Telemetria:** Comparar instantaneamente tempo da última volta, média das últimas três voltas, melhor volta pessoal e delta de tempo (diferença em segundos) entre os seus pilotos e em relação aos líderes.
3.  **Gestão Energética e Diagnóstico de Autonomia:** Monitorar a quantidade exata de voltas realizadas com a bateria atual de cada carro, voltagem elétrica residual (tensão em Volts) e projeção de voltas que a bateria ainda suporta frente ao total de voltas da corrida.
4.  **Tomada de Decisão Tática de Ritmo e Box:** Decidir com embasamento matemático se o piloto deve acelerar no ritmo de Ataque, manter ritmo Normal, adotar a estratégia de Poupar Bateria ou se deve ser convocado imediatamente aos boxes para Troca de Bateria (*pit stop*).
5.  **Acompanhamento da Pontuação da Equipe:** Saber instantaneamente quantos pontos a equipe está somando com as posições parciais na corrida e como isso impacta sua posição na Classificação Geral do Campeonato.

#### 2.1.3 Dificuldades e Expectativas
*   **Dificuldades Vivenciadas:**
    *   Frustração intensa ao precisar dar múltiplos cliques ou alternar entre telas diferentes para correlacionar o tempo de volta com a voltagem da bateria.
    *   Dificuldade de leitura quando interfaces utilizam fontes pequenas ou contrastes baixos sob iluminação externa no pit lane.
    *   Insegurança ao interpretar alertas que dependem unicamente de cor (ex.: apenas uma bolinha vermelha ou amarela sem texto descritivo e ícone de alerta).
*   **Expectativas em Relação ao Sistema:**
    *   Um **Dashboard Estratégico** centralizado e ultra legível, com informações-chave agrupadas logicamente para absorção em menos de 5 segundos.
    *   Suporte a **atalhos rápidos de teclado** para navegar entre provas e simulações sem retirar as mãos do teclado na bancada de trabalho.
    *   **Dupla codificação semântica** em todos os estados de bateria e posições de pista (cor + ícone + texto explícito).
    *   Tema escuro de alto contraste otimizado para a tenda de boxes (**Modo Escuro / Pit Lane**).

---

### 2.2 Cenário de Uso Detalhado (Situação Real — 4ª Prova do Campeonato)

> **Contexto:** 4ª Prova do Campeonato Oficial RC — GP Pit Lane Fortaleza (Circuito Asfalto). A prova tem meta de **20 Voltas** e encontra-se em andamento na **Volta 14 de 20**.

Roberto "Beto" Almeida está sentado diante de seu notebook na bancada da tenda de apoio da equipe Nitro RC. A corrida aproxima-se do seu terço final. O piloto Lucas Silveira (Carro #11) ocupa uma combativa **3ª posição**, a menos de 1 segundo do 2º colocado, sonhando com a vitória ou pódio.

No entanto, nos últimos giros, Beto percebe pela telemetria na pista que os tempos de volta de Lucas começaram a oscilar para cima. Ele precisa cruzar duas informações críticas em menos de 5 segundos:
1.  **Comparativo de Ritmo:** Beto verifica o ritmo de Lucas Silveira comparado ao seu companheiro de equipe, Bruno Costa (Carro #12, que roda em 5º lugar). Ele nota que a média das últimas 3 voltas de Lucas caiu de 18.5s para 19.4s, enquanto Bruno mantém regularidade na casa de 18.6s.
2.  **Diagnóstico Energético da Bateria:** Beto examina a telemetria da bateria de Lucas. O carro completou **14 voltas** com a **Bateria #1**. A voltagem elétrica caiu para **6.78V** (carga restante de **22%**). O sistema projeta que, no ritmo atual, a bateria suporta apenas **4 voltas adicionais**, sendo que ainda restam **6 voltas** para o término da prova (meta na volta 20). O status da bateria acende em alerta amarelo com o rótulo **"Atenção: Poupar"**.

**A Decisão Estratégica:**  
Se Lucas continuar no ritmo de corrida atual, sofrerá corte eletrônico de potência (*voltage cutoff*) por volta da Volta 18, abandonando a corrida ou despencando para as últimas posições. Beto tem duas alternativas:
*   *Opção A:* Chamar Lucas aos boxes para uma Troca de Bateria, o que custará cerca de 25 segundos na parada e o fará cair para o 7º lugar;
*   *Opção B:* Ordenar via rádio que Lucas mude a Estratégia de Ritmo para **Poupar Bateria**, diminuindo o consumo por volta ao aliviar o gatilho nas retas, aumentando a autonomia estimada para 7 voltas e permitindo cruzar a linha de chegada na Volta 20 no pódio.

Beto seleciona a estratégia **Poupar Bateria** no sistema, que recalcula imediatamente a projeção de consumo mostrando que o carro completará as 6 voltas com margem de segurança. Com um clique no rádio comunicador, Beto instrui: *"Lucas, poupe bateria no setor 2 e 3, assegure o pódio até a volta 20!"*.

---

### 2.3 Catálogo de Informações Gerais de Equipes e Pilotos (Seção 4.1 do Edital)

O sistema Web incorpora o catálogo oficial completo com as fichas técnicas, chefes de equipe, especificações de chassis, motores elétricos brushless e pilotos do Campeonato.

#### 2.3.1 Tabela Geral das 6 Equipes Participantes

| Equipe | Sigla | Chefe de Equipe | Chassi RC (Escala 1/10) | Motor Elétrico | Cores Oficiais | Cota Feed |
| :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **Nitro RC** | `NIT` | Roberto "Beto" Almeida | X-Speed Carbon Evo 4WD | Brushless Sensored 3.5T | Azul Elétrico & Laranja | 4/4 |
| **Apex Racing** | `APX` | Carlos Mendez | Apex Pro Tourer T4 | Brushless Sensored 4.0T | Vermelho Ferrari & Branco | 4/4 |
| **Turbo Thunder** | `TTD` | Marcelo Rossi | Thunder Strike GT-R | Brushless Sensored 3.5T | Amarelo Neon & Preto Fosco | 4/4 |
| **Velocity Sport** | `VEL` | Ricardo Dias | Velocity R1 Competition | Brushless Sensored 4.5T | Verde Esmeralda & Prata | 4/4 |
| **Vortex Motorsport** | `VTX` | Sérgio Ramos | Vortex Cyclone Shaft-Drive | Brushless Sensored 3.5T | Roxo Metálico & Dourado | 4/4 |
| **Cyber Storm RC** | `CYB` | Eduardo Castro | Cyber Quantum Aero Mid-Motor | Brushless Sensored 4.0T | Ciano Neon & Cinza Chumbo | 4/4 |

#### 2.3.2 Tabela Geral dos 12 Pilotos do Grid Oficial

| Carro | Piloto Titular | Apelido | Equipe | Estilo de Pilotagem | Pódios | Vitórias | Melhor Volta Histórica | Média Voltas/Bateria |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **#11** | **Lucas Silveira** | *"Fera"* | Nitro RC | Agressivo / Rápido em classificação | 2 | 1 | 18.120s | 13.8 voltas |
| **#12** | **Bruno Costa** | *"Viper"* | Nitro RC | Calculista / Alta consistência | 1 | 0 | 18.240s | 15.2 voltas |
| **#21** | **Gabriel Santos** | *"Apex"* | Apex Racing | Técnico / Traçado perfeito | 3 | 1 | 18.050s | 14.5 voltas |
| **#22** | **Daniel Lima** | *"Sprint"* | Apex Racing | Arrojado em ultrapassagens | 1 | 0 | 18.310s | 14.1 voltas |
| **#31** | **Felipe Silva** | *"Raio"* | Turbo Thunder | Agressivo / Risco elevado | 2 | 1 | 18.010s | 13.4 voltas |
| **#32** | **Rodrigo Rocha** | *"Flash"* | Turbo Thunder | Constante / Gestão de tráfego | 0 | 0 | 18.450s | 14.8 voltas |
| **#41** | **Thiago Nogueira** | *"Speed"* | Velocity Sport | Conservador / Ritmo constante | 1 | 0 | 18.380s | 16.0 voltas |
| **#42** | **Marcos Ferreira** | *"Grip"* | Velocity Sport | Técnico / Preservação de pneus | 0 | 0 | 18.520s | 15.8 voltas |
| **#51** | **André Souza** | *"Drift"* | Vortex Motorsport| Rápido em curvas sinuosas | 1 | 0 | 18.290s | 14.0 voltas |
| **#52** | **Caio Martins** | *"Turbo"* | Vortex Motorsport| Imprevisível / Ataque constante | 0 | 0 | 18.610s | 13.7 voltas |
| **#61** | **Marcelo Antunes**| *"Zero"* | Cyber Storm RC | Preciso / Telemetria apurada | 1 | 0 | 18.220s | 14.6 voltas |
| **#62** | **Rafael Prado** | *"Matrix"* | Cyber Storm RC | Regular / Focado em pontuar | 0 | 0 | 18.480s | 15.0 voltas |

---

### 2.4 Funcionalidades Projetadas da Frente 1 (Módulos A e B)

1.  **Dashboard Estratégico e Comparativo de Pilotos:**
    *   Painel centralizado com os indicadores vitais dos dois pilotos da equipe selecionada (comutador disponível para inspecionar qualquer uma das 6 equipes).
    *   Módulo de **Comparativo de Pilotos** lado a lado: tempo da última volta, melhor volta individual na prova, média das últimas 3 voltas e delta de tempo relativo entre os companheiros.
    *   Visão de alta densidade sem rolagem obrigatória (*above the fold*), projetada para permitir leitura diagnóstica em **menos de 5 segundos**.
    *   Exibição pareada dos dois pilotos: posição na prova, tempo da última volta, melhor volta individual na prova, média das últimas 3 voltas e delta de tempo relativo entre os companheiros.
2.  **Tabela Comparativa Volta a Volta:**
    *   Histórico analítico de todas as voltas completadas na prova pelos dois pilotos da equipe.
    *   Destaques visuais para: melhor volta da corrida (*purple lap*), volta de pit stop / troca de bateria e voltas com perda significativa de ritmo.
3.  **Monitor de Autonomia da Bateria por Prova:**
    *   Contagem e identificação exata das voltas realizadas com cada bateria (ex.: Bateria #1: 14 voltas; Bateria #2: 0 voltas).
    *   Indicador de carga residual percentual (0% a 100%) e tensão elétrica de trabalho (7.4V nominal LiPo 2S até o corte em 6.6V).
    *   Projeção matemática de autonomia em voltas restantes confrontada diretamente com as voltas que faltam para o término da corrida (20 voltas).
4.  **Dupla Codificação Semântica Estrita:**
    *   Nenhum estado do sistema depende exclusivamente de cores para sua interpretação (acessibilidade para daltonismo e legibilidade sob sol forte).
    *   Estados de bateria:
        *   🟢 **Ideal** (Ícone de escudo/check verde + rótulo "Ideal — Completa a Prova")
        *   🟡 **Atenção** (Ícone de triângulo de aviso amarelo + rótulo "Atenção: Poupar — Risco de não completar")
        *   🔴 **Crítico** (Ícone de alerta octogonal vermelho + rótulo "Crítico: Trocar — Parada obrigatória")
5.  **Simulação Interativa e Seletor de Estratégia de Ritmo (Prova 4):**
    *   Controle explícito de reprodução da simulação na Prova 4 em andamento (Pausar, Retomar, Avançar Volta, atalho de Teclado `Espaço`).
    *   Seletor tático por piloto entre três modos de rendimento:
        *   *Ataque:* Volta mais rápida (-0.3s/volta), maior consumo energético (+3.5% bateria/volta).
        *   *Normal:* Desempenho equilibrado de referência.
        *   *Poupar Bateria:* Volta conservadora (+0.4s/volta), consumo reduzido (-25% desgaste/volta), assegurando completar a prova.
6.  **Simulador de Troca de Bateria (Pit Stop):**
    *   Ação de box para simular ou registrar a troca da bateria no carro durante a Prova 4, arquivando as voltas da bateria anterior e instalando a Bateria #2 com 100% de carga e 7.4V, computando o tempo de parada nos boxes.
7.  **Acompanhamento da Pontuação da Equipe:**
    *   Exibição dos pontos já acumulados pela equipe nas provas anteriores (soma de ambos os pilotos).
    *   Cálculo em tempo real da pontuação somada projetada na corrida em andamento com base nas posições atuais conforme a regra oficial `10 - 6 - 3 - 2 - 1 - 0`.
8.  **Navegação e Atalhos Globais de Teclado:**
    *   Teclas numéricas `1` a `5`: Seleção imediata das Provas 1 a 5.
    *   Barra de `Espaço`: Pausa ou retoma a telemetria ao vivo da Prova 4.
    *   Tecla `?`: Exibe o guia rápido de atalhos e regras do campeonato.
9.  **Tema Especializado Pit Lane (Modo Escuro) e Arquibancada (Modo Claro):**
    *   Alternância instantânea de estilo visual com preservação rigorosa de contraste de cores (WCAG AAA para dados numéricos).
10. **Ações de Recuperação e Controle do Usuário:**
    *   Ação global de **Desfazer (Undo)** para reverter instantaneamente a última mutação de estado (mudança de ritmo ou parada acidental).
    *   Ação de **Restaurar Dados da Avaliação**, com diálogo modal de confirmação preventiva, retornando 100% do estado determinístico para novas rodadas de teste.

---

### 2.5 Fundamentação nos Oito Critérios Ergonômicos de Bastien e Scapin

Cada decisão de interface da Frente 1 está rigorosamente mapeada nos critérios ergonômicos e seus subcritérios:

#### 1. Condução (Guidance)
*   **Presteza (Prompting):** Os seletores de estratégia de ritmo apresentam pequenos textos explicativos informando o impacto imediato da escolha (ex.: *"Poupar: +0.4s/volta, garante término na volta 20"*). O cabeçalho exibe badges informativos sobre a corrida ativa.
*   **Agrupamento e Distinção de Itens (Grouping/Distinction):**
    *   *Por Localização:* A telemetria dos dois pilotos da equipe é disposta em dois cartões paralelos e simétricos (Piloto #11 à esquerda, Piloto #12 à direita). O painel de bateria ocupa um módulo visual coeso logo abaixo dos tempos de volta.
    *   *Por Formato:* Badges circulares para números de carro, retângulos com cantos arredondados para métricas numéricas e tabelas limpas para histórico volta a volta.
*   **Feedback Imediato (Immediate Feedback):** Qualquer interação (como alternar a estratégia de ritmo, pausar a simulação ou acionar a troca de bateria) produz atualização visual na tela em menos de 50 milissegundos, acompanhada de um indicador de status e feedback textual.
*   **Legibilidade (Legibility):**
    *   Fontes monoespaçadas numéricas (*tabular numbers*) para tempos de volta (ex.: `00:18.240`), impedindo oscilações visuais na renderização dos milissegundos.
    *   Cores com contraste mínimo de 7:1 sobre o fundo escuro do tema Pit Lane, assegurando clareza mesmo sob forte luz solar direta ou sombras.

#### 2. Carga de Trabalho (Workload)
*   **Brevidade (Brevity):** Acesso às informações vitais da equipe sem exigência de nenhum clique adicional ao entrar no dashboard. A contagem de voltas por bateria e a posição dos pilotos estão expostas diretamente no primeiro nível hierárquico.
*   **Densidade Informacional (Information Density):** Concentração ótima de indicadores essenciais (posições, voltas, baterias, delta, soma de pontos) sem sobrecarregar a capacidade atencional do usuário, eliminando elementos puramente decorativos ou ruídos visuais.

#### 3. Controle Explícito (Explicit Control)
*   **Ações Explícitas:** A plataforma nunca executa alterações de estado de forma arbitrária ou oculta. A passagem de voltas na simulação da Prova 4 pode ser controlada passo a passo pelo usuário através do botão *"Avançar Volta"* ou pausada a qualquer instante.
*   **Controle do Usuário:** Botão de **Desfazer (Undo)** visível para restaurar a condição anterior após qualquer ação acidental, e botão global de **Restaurar Dados da Avaliação** que reinicializa o campeonato.

#### 4. Adaptabilidade (Adaptability)
*   **Flexibilidade:** Permite interação completa tanto por mouse/touch quanto por **atalhos de teclado** dedicados (`1` a `5`, `Espaço`, `?`), atendendo tanto ao usuário novato quanto ao especialista que trabalha com teclado na bancada de boxes.
*   **Experiência do Usuário:** Alternador de modo de trabalho permitindo transitar entre o foco do Técnico de Equipe (painéis de alta densidade e baterias) e o foco da Repórter (resultados, pódios e feed de notícias).

#### 5. Gestão de Erros (Error Management)
*   **Prevenção de Erros (Protection Against Errors):** O botão *"Restaurar Dados da Avaliação"* conta com diálogo modal de confirmação explícita com mensagem clara, prevenindo resets acidentais durante uma prova ou sessão de avaliação.
*   **Qualidade das Mensagens de Erro (Quality of Error Messages):** Mensagens contextuais em português claro, identificando com exatidão a causa e orientando a solução imediata.
*   **Correção de Erros (Error Correction):** Capacidade de desfazer qualquer ajuste incorreto de ritmo com um único clique ou comando de teclado.

#### 6. Homogeneidade e Coerência (Consistency)
*   Padronização rigorosa da paleta semântica em todos os componentes: verde para seguro/ideal, amarelo para advertência/atenção, vermelho para crítico/parada de box.
*   Identidade tipográfica consistente em títulos, métricas, subtítulos e tabelas volta a volta.

#### 7. Significado dos Códigos e Denominações (Significance of Codes)
*   Uso de terminologia autêntica e consagrada do esporte motor e modelismo RC: *Pit Lane*, *Delta*, *Volta Mais Rápida*, *LiPo 2S*, *Tensão Residual (V)*.
*   **Dupla Codificação Semântica Obrigatória:** Todos os alertas utilizam simultaneamente cor, ícone específico e texto explícito em linguagem natural, garantindo acessibilidade universal e total conformidade com os princípios ergonômicos de legibilidade de códigos.

#### 8. Compatibilidade (Compatibility)
*   Adequação perfeita entre o fluxo do sistema e as rotinas reais de um técnico de box: a ordem dos dados segue o fluxo cognitivo de decisão de Beto (1º: Onde estamos e qual nosso ritmo? 2º: Quanto tempo de bateria nos resta? 3º: O que devemos fazer para garantir os pontos da equipe?).

---

### 2.6 Fundamentação nas Dez Heurísticas de Usabilidade de Nielsen

As decisões de design e arquitetura da Frente 1 refletem diretamente as 10 heurísticas de Jakob Nielsen:

1.  **Visibilidade do Estado do Sistema (Visibility of System Status):**  
    O sistema mantém o técnico ciente a cada segundo: badge indicando se a prova está *Concluída*, *Ao Vivo* ou *Agendada*, indicador da volta corrente (`Volta 14 de 20`), estado da simulação (*Executando* vs. *Pausado*) e confirmações em tela com toasts breves.
2.  **Correspondência entre o Sistema e o Mundo Real (Match Between System and Real World):**  
    Terminologia e grandezas físicas idênticas às baterias LiPo 2S reais: voltagem medida em Volts com faixa de 7.4V (plena carga) a 6.6V (limite de corte do ESC), tempos cronometrados em milissegundos (`ss.mmm`) e conceito de parada nos boxes (*Pit Stop*).
3.  **Controle e Liberdade do Usuário (User Control and Freedom):**  
    Liberdade para inspecionar qualquer prova do campeonato a qualquer momento, pausar a simulação ao vivo, alterar estratégias e contar com a "saída de emergência" do botão **Desfazer (Undo)** e da **Restauração de Dados da Avaliação**.
4.  **Consistência e Padrões (Consistency and Standards):**  
    Navegação web previsível, componentes visuais com comportamentos padronizados, ícones universais de automobilismo e adesão estrita ao regulamento do edital.
5.  **Prevenção de Erros (Error Prevention):**  
    Bloqueio de ações inválidas (por exemplo, não permitir acionar simulações em provas já encerradas) e modal protetor antes de restaurar o banco de dados.
6.  **Reconhecimento em vez de Memorização (Recognition Rather Than Recall):**  
    O técnico Beto nunca precisa calcular de cabeça ou memorizar tabelas: a regra de pontos (`10-6-3-2-1-0`) está sempre resumida em um cartão explicativo, o cálculo da soma da equipe é realizado em tempo real e os deltas entre pilotos são computados automaticamente.
7.  **Flexibilidade e Eficiência de Uso (Flexibility and Efficiency of Use):**  
    Aceleradores de teclado para o técnico experiente operando no pit lane (`1` a `5` para provas, `Espaço` para pausar, `?` para ajuda), sem retirar a simplicidade para cliques de mouse de avaliadores iniciantes.
8.  **Design Estético e Minimalista (Aesthetic and Minimalist Design):**  
    Eliminação de gráficos 3D pesados, efeitos de brilho ou elementos decorativos que concorram com a atenção do usuário no pit lane. Cada pixel no dashboard estratégico tem propósito analítico.
9.  **Ajudar os Usuários a Reconhecer, Diagnosticar e Recuperar-se de Erros (Help Users Recognize, Diagnose, and Recover from Errors):**  
    Diagnóstico inteligente de bateria: em vez de apenas alertar "Bateria Baixa", o sistema explica o problema (*"Tensão de 6.78V suporta apenas 4 voltas, insuficiente para as 6 voltas restantes"*) e aponta as opções resolutivas (*"Selecione 'Poupar Bateria' ou faça uma 'Troca de Bateria'"*).
10. **Ajuda e Documentação (Help and Documentation):**  
    Modal interativo de ajuda instantânea acionável via atalho `?` contendo o resumo das regras do campeonato, tabela de pontuação oficial, significados dos status de bateria e lista de atalhos de teclado.

### 2.7 Matriz de Fundamentação das Decisões de Interface da Frente 1 em IHC

A tabela a seguir sintetiza como cada decisão de interface da Frente 1 está explicitamente fundamentada nos Critérios Ergonômicos de Bastien & Scapin e nas Heurísticas de Usabilidade de Nielsen:

| Decisão de Interface da Frente 1 | Critérios Ergonômicos de Bastien & Scapin | Heurísticas de Usabilidade de Nielsen |
| :--- | :--- | :--- |
| **Dashboard Estratégico** | • **Carga de Trabalho (Brevidade e Densidade Informacional):** Leitura de status da equipe em < 5 segundos sem rolagem.<br>• **Condução (Agrupamento e Legibilidade):** Cartões modulares de alta coesão e fontes tabulares. | • **Design Estético e Minimalista:** Telas sem ruído visual, focadas estritamente em KPIs essenciais.<br>• **Visibilidade do Estado do Sistema:** Status da corrida ao vivo, volta atual e indicadores de ritmo. |
| **Comparativo de Pilotos** | • **Condução (Agrupamento e Distinção de Itens):** Disposição pareada lado a lado dos dois pilotos.<br>• **Carga de Trabalho (Brevidade):** Cálculo automático de delta de tempo sem esforço mental. | • **Reconhecimento em vez de Memorização:** Histórico e comparação visual imediata sem exigir retenção de memória de trabalho. |
| **Monitor de Autonomia da Bateria** | • **Condução (Feedback Imediato):** Telemetria em tempo real de voltagem (V) e carga residual (%).<br>• **Significado dos Códigos:** Grandezas elétricas padronizadas (escala LiPo 2S). | • **Correspondência com o Mundo Real:** Modelagem física autêntica de baterias de carros RC.<br>• **Ajuda aos Usuários a Diagnosticar e Recuperar-se de Erros:** Alertas proativos com recomendação de ação. |
| **Atalhos de Teclado** | • **Adaptabilidade (Flexibilidade):** Suporte tanto a mouse quanto navegação por teclado ágil (`1-5`, `Espaço`, `?`).<br>• **Compatibilidade:** Adequação à bancada de boxes e uso de notebook no pit lane. | • **Flexibilidade e Eficiência de Uso:** Aceleradores para técnicos experientes operando com pressa ou sob pressão de tempo. |
| **Tema Pit Lane (Modo Escuro)** | • **Adaptabilidade (Experiência do Usuário):** Alternância entre Modo Escuro (boxes) e Modo Claro (arquibancada).<br>• **Condução (Legibilidade):** Alto contraste (WCAG AAA) para telas em ambientes de iluminação adversa. | • **Design Estético e Minimalista:** Paleta sóbria que valoriza os dados e previne fadiga visual em longas sessões. |
| **Dupla Codificação Semântica** | • **Significado dos Códigos e Denominações:** Todo estado crítico associa cor, ícone específico e texto explícito em português.<br>• **Homogeneidade e Coerência:** Padrão consistente em todos os alertas de bateria e pista. | • **Reconhecimento em vez de Memorização:** Compreensão inequívoca do status (🟢 Ideal, 🟡 Atenção, 🔴 Crítico) imune a daltonismo ou variações de iluminação. |

---

## 3. Parte 2: Frente 2 — Repórter e Cobertura do Campeonato
*Responsável: Vinícius Silva Pereira (Vide Issue #8 para detalhamento completo)*

A Frente 2 atende à Persona **Camila Rocha** (Jornalista e Criadora de Conteúdo, Canal "RC em Foco"), cobrindo as necessidades de apuração ágil pós-corrida:
*   **Central de Resultados das 5 Provas:** Destaque para pódios, tempos decisivos (última volta do vencedor e ultrapassagem na Prova 3) e tabela completa com a regra oficial `10 - 6 - 3 - 2 - 1 - 0`.
*   **Classificação Geral com Filtro Histórico:** Tabela de pontuação acumulada de pilotos e equipes com filtro de evolução até determinada prova (ex.: após a 3ª Prova) e desempate por vitórias/pódios.
*   **Feed da Corrida com Cota Regulamentar:** Linha do tempo cronológica com filtro por equipe e categoria, respeitando o limite oficial de **até 4 publicações por equipe por prova** com trava preventiva na 5ª publicação.
*   **Estúdio de Boletim de Imprensa:** Construtor rápido de matéria com recortes de resultados e citações do feed, com cópia em 1 clique em menos de 10 minutos.

---

## 4. Rastreabilidade com o Edital e Entregas Finais

| Item do Edital | Requisito do Edital | Módulo / Seção no Projeto | Integrante Responsável |
| :--- | :--- | :--- | :--- |
| **Seção 3** | Criação de Personas e Cenários de Uso | Persona 1: Roberto "Beto" Almeida (Técnico)<br>Persona 2: Camila Rocha (Repórter) | Matheus (P1)<br>Vinícius (P2) |
| **Seção 4.1** | Informações Gerais de Pilotos e Equipes | Catálogo Geral das 6 Equipes e 12 Pilotos | Matheus |
| **Seção 4.1** | Posições, Tempos de Volta e Baterias | Dashboard Estratégico & Monitor de Baterias | Matheus |
| **Seção 4.2** | Regulamento e Pontuação (10, 6, 3, 2, 1, 0) | Motor do Campeonato & Central de Resultados | Matheus (Regras) & Vinícius (Central) |
| **Seção 4.3** | Feed da Corrida (Cota até 4 publicações) | Feed com trava preventiva 4/4 e contador | Vinícius |
| **Seção 5.2** | 8 Critérios Ergonômicos de Bastien & Scapin | Fundamentação de IHC nas Frentes 1 e 2 | Matheus (Frente 1) & Vinícius (Frente 2) |
| **Seção 5.3** | 10 Heurísticas de Usabilidade de Nielsen | Fundamentação de Usabilidade no Projeto | Matheus (Frente 1) & Vinícius (Frente 2) |
| **Seção 6** | Avaliação Cruzada (6 Missões de Usabilidade) | Missões 1 a 3 (Frente 1) e Missões 4 a 6 (Frente 2) | Matheus (M1-3) & Vinícius (M4-6) |
| **Seção 7** | Parecer Técnico de Usabilidade e Melhorias | Modelo estruturado e tabela de registro | Vinícius |
