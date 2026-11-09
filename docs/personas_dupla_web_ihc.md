# Personas, Cenários de Uso e Fundamentação em IHC — Dupla Web
**Projeto:** Plataforma Digital para Campeonato de Corrida de Carros por Controle Remoto (RC)  
**Curso:** Engenharia de Computação – IFCE Fortaleza  
**Foco da Interface:** Navegadores Web (Desktop)  
**Dupla Web:** Matheus de Sousa Almeida (Frente 1) e Vinícius Silva Pereira (Frente 2)

---

## 1. Persona 1: O Estrategista de Pit Lane (Técnico de Equipe)
*Responsável pela concepção: Matheus de Sousa Almeida*

*   **Nome Fictício:** Roberto "Beto" Almeida
*   **Idade:** 42 anos
*   **Ocupação:** Chefe de Mecânica e Estrategista da equipe "Nitro RC"
*   **Perfil Tecnológico:** Intermediário/Avançado. Beto opera notebooks na bancada da tenda de boxes (*pit lane*). Possui grande familiaridade com planilhas de ajuste mecânico, telemetria e gráficos analíticos, mas detesta interfaces lentas, poluídas ou que exijam excesso de cliques para cruzar métricas críticas. Valoriza atalhos de teclado, leitura imediata em menos de 5 segundos e alta densidade informacional bem hierarquizada.

### 1.1 Objetivos e Necessidades
*   Acompanhar o desempenho em tempo real dos seus dois pilotos para tomar decisões estratégicas no calor da corrida.
*   Comparar lado a lado os tempos de volta e posições dos seus dois pilotos na prova.
*   Monitorar de perto a autonomia e o desgaste das baterias de cada carro (voltas percorridas, voltagem residual e consumo por volta).
*   Decidir entre manter o ritmo, orientar o piloto a poupar equipamento (Estratégia de Ritmo: Ataque, Normal, Poupar Bateria) ou convocar para Troca de Bateria nos boxes.
*   Acompanhar a soma de pontos da sua equipe para avaliar a evolução na Classificação Geral do campeonato.

### 1.2 Dificuldades e Expectativas
*   *Dificuldades:* Frustração ao precisar navegar por várias abas ou telas para correlacionar voltagem de bateria e ritmo de corrida. Dificuldade de leitura sob luminosidade variável na tenda de boxes quando os contrastes são baixos. Insegurança com alertas baseados unicamente em cores.
*   *Expectativas:* Painel estratégico centralizado (*dashboard*) de leitura em menos de 5 segundos, atalhos de teclado ágeis, modo escuro de alto contraste (*Tema Pit Lane*) e alertas com dupla codificação semântica (cor + ícone + texto explícito).

### 1.3 Cenário de Uso (Situação Real — 4ª Prova do Campeonato)
Durante a decisiva 4ª prova do campeonato (GP Pit Lane Fortaleza — meta de 20 voltas, em andamento na Volta 14 de 20), Beto está com seu notebook aberto na tenda da equipe Nitro RC. O piloto Lucas Silveira (Carro #11) roda em 3º lugar pressionando o 2º colocado, mas Beto nota na telemetria que seu ritmo caiu nas últimas 3 voltas. Beto acessa o sistema Web para cruzar duas informações cruciais: comparar os tempos das últimas três voltas de Lucas com as de Bruno Costa (Carro #12) e inspecionar a autonomia da bateria de Lucas. Ele constata que o carro completou 14 voltas com a Bateria #1, a tensão caiu para 6.78V (22% de carga) e o alerta indica "Atenção: Poupar", restando apenas 4 voltas de autonomia para 6 voltas que faltam na corrida. Beto precisa decidir instantaneamente se ordena via rádio a estratégia de Poupar Bateria ou se chama o piloto para trocar a bateria nos boxes.

### 1.4 Funcionalidades Projetadas para esta Persona
1.  **Dashboard Estratégico & Comparativo Lado a Lado:** Visualização simultânea dos dois pilotos da equipe com posição atual, tempo da última volta, melhor volta, média das últimas 3 voltas e delta de tempo relativo entre os companheiros.
2.  **Histórico Volta a Volta:** Tabela detalhada de todas as voltas da corrida com destaque para voltas mais rápidas, paradas de box e perda de rendimento.
3.  **Monitor de Autonomia da Bateria:** Contagem exata de voltas por bateria, voltagem (V), percentual de carga e projeção de voltas restantes com dupla codificação semântica (🟢 Ideal, 🟡 Atenção, 🔴 Crítico).
4.  **Simulação de Estratégia de Ritmo e Troca de Bateria:** Seletor interativo na Prova 4 (Ataque, Normal, Poupar Bateria) e simulação de parada nos boxes com recálculo instantâneo de consumo.
5.  **Acompanhamento da Pontuação Somada da Equipe:** Pontos acumulados na Classificação Geral e projeção em tempo real das posições atuais na corrida.
6.  **Atalhos de Teclado e Modo Escuro (Pit Lane):** Teclas numéricas 1 a 5 para provas, barra de espaço para pausar/retomar simulação, tecla ? para ajuda, e alternância entre Modo Escuro e Modo Claro.

---

## 2. Persona 2: A Comunicadora (Repórter)
*Responsável pela concepção: Vinícius Silva Pereira*

*   **Nome Fictício:** Camila Rocha
*   **Idade:** 28 anos
*   **Ocupação:** Jornalista Esportiva e Criadora de Conteúdo (Canal "RC em Foco")
*   **Perfil Tecnológico:** Avançado. Camila vive conectada, usa redes sociais, plataformas de streaming e softwares de edição simultaneamente. Acessa o sistema majoritariamente pelo notebook na sala de imprensa ou arquibancada com múltiplas abas abertas.

### 2.1 Objetivos e Necessidades
*   Consultar os resultados finais e a classificação geral o mais rápido possível após o encerramento de cada corrida.
*   Acompanhar ultrapassagens, penalidades e incidentes em ordem cronológica para comentar em matérias e transmissões.
*   Coletar declarações oficiais das equipes no Feed da Corrida.
*   Redigir boletins informativos e matérias pós-corrida em menos de 10 minutos.

### 2.2 Dificuldades e Expectativas
*   *Dificuldades:* Frustração quando as regras de pontuação não estão claras ou quando é difícil copiar dados estatísticos. Desordem em feeds e excesso de publicações repetitivas.
*   *Expectativas:* Central de resultados estruturada com pódio em destaque, regras de pontuação visíveis (10-6-3-2-1-0), feed ordenado cronologicamente com trava de cota (até 4 por equipe por prova) e estúdio de boletim de imprensa com cópia rápida em 1 clique.

### 2.3 Cenário de Uso (Situação Real — Pós 3ª Prova do Campeonato)
A 3ª corrida do campeonato acabou de terminar com uma emocionante ultrapassagem na última volta (Volta 20). Camila está sentada na arquibancada com seu notebook no colo, precisando publicar sua reportagem em menos de 10 minutos. Ela acessa a plataforma Web para verificar o tempo da última volta do vencedor, a pontuação distribuída no pódio, a liderança da Classificação Geral e a declaração oficial da equipe derrotada no feed para compor seu texto.

### 2.4 Funcionalidades Projetadas para esta Persona
1.  **Central de Resultados:** Filtro pelas 5 provas, destaque para pódio (1º, 2º e 3º) e tabela completa com a regra oficial `10 - 6 - 3 - 2 - 1 - 0`.
2.  **Classificação Geral com Filtro Histórico:** Tabela acumulada de pilotos e equipes com filtro de corte por prova (ex.: após a Prova 3) e cálculos automáticos de gap.
3.  **Feed da Corrida com Cota Regulamentar:** Linha do tempo cronológica com filtro por equipe e categoria, contador explícito `X/4` e bloqueio na 5ª publicação.
4.  **Estúdio de Boletim de Imprensa:** Construtor rápido de matéria com recortes de corrida e cópia em 1 clique.

---

## 3. Catálogo Oficial de Equipes e Pilotos do Campeonato (Seção 4.1 do Edital)

### 3.1 Equipes Oficiais do Campeonato (6 Equipes)

1.  **Nitro RC (`NIT`):**
    *   Chefe de Equipe: Roberto "Beto" Almeida
    *   Chassi: X-Speed Carbon Evo 4WD (Escala 1/10)
    *   Motor: Brushless Sensored 3.5T
    *   Cores: Azul Elétrico & Laranja
    *   Pilotos: Lucas Silveira (#11) e Bruno Costa (#12)
2.  **Apex Racing (`APX`):**
    *   Chefe de Equipe: Carlos Mendez
    *   Chassi: Apex Pro Tourer T4
    *   Motor: Brushless Sensored 4.0T
    *   Cores: Vermelho Ferrari & Branco
    *   Pilotos: Gabriel Santos (#21) e Daniel Lima (#22)
3.  **Turbo Thunder (`TTD`):**
    *   Chefe de Equipe: Marcelo Rossi
    *   Chassi: Thunder Strike GT-R
    *   Motor: Brushless Sensored 3.5T
    *   Cores: Amarelo Neon & Preto Fosco
    *   Pilotos: Felipe Silva (#31) e Rodrigo Rocha (#32)
4.  **Velocity Sport (`VEL`):**
    *   Chefe de Equipe: Ricardo Dias
    *   Chassi: Velocity R1 Competition
    *   Motor: Brushless Sensored 4.5T
    *   Cores: Verde Esmeralda & Prata
    *   Pilotos: Thiago Nogueira (#41) e Marcos Ferreira (#42)
5.  **Vortex Motorsport (`VTX`):**
    *   Chefe de Equipe: Sérgio Ramos
    *   Chassi: Vortex Cyclone Shaft-Drive
    *   Motor: Brushless Sensored 3.5T
    *   Cores: Roxo Metálico & Dourado
    *   Pilotos: André Souza (#51) e Caio Martins (#52)
6.  **Cyber Storm RC (`CYB`):**
    *   Chefe de Equipe: Eduardo Castro
    *   Chassi: Cyber Quantum Aero Mid-Motor
    *   Motor: Brushless Sensored 4.0T
    *   Cores: Ciano Neon & Cinza Chumbo
    *   Pilotos: Marcelo Antunes (#61) e Rafael Prado (#62)

### 3.2 Pilotos Oficiais do Grid (12 Pilotos)

*   **#11 Lucas "Fera" Silveira (Nitro RC):** Estilo agressivo, voltas velozes em classificação, média de 13.8 voltas/bateria.
*   **#12 Bruno "Viper" Costa (Nitro RC):** Estilo calculista, regularidade de ritmo, média de 15.2 voltas/bateria.
*   **#21 Gabriel "Apex" Santos (Apex Racing):** Técnico e constante, melhor volta de 18.050s, média de 14.5 voltas/bateria.
*   **#22 Daniel "Sprint" Lima (Apex Racing):** Arrojado em ultrapassagens, média de 14.1 voltas/bateria.
*   **#31 Felipe "Raio" Silva (Turbo Thunder):** Agressivo com risco elevado, voltas rápidas, média de 13.4 voltas/bateria.
*   **#32 Rodrigo "Flash" Rocha (Turbo Thunder):** Especialista em gestão de tráfego, média de 14.8 voltas/bateria.
*   **#41 Thiago "Speed" Nogueira (Velocity Sport):** Conservador, maior autonomia do grid, média de 16.0 voltas/bateria.
*   **#42 Marcos "Grip" Ferreira (Velocity Sport):** Técnico em preservação de pneus e bateria, média de 15.8 voltas/bateria.
*   **#51 André "Drift" Souza (Vortex Motorsport):** Veloz em circuitos travados, média de 14.0 voltas/bateria.
*   **#52 Caio "Turbo" Martins (Vortex Motorsport):** Imprevisível e ofensivo, média de 13.7 voltas/bateria.
*   **#61 Marcelo "Zero" Antunes (Cyber Storm RC):** Preciso com foco em telemetria limpa, média de 14.6 voltas/bateria.
*   **#62 Rafael "Matrix" Prado (Cyber Storm RC):** Regular e pontuador consistente, média de 15.0 voltas/bateria.

---

## 4. Fundamentação em Critérios Ergonômicos de Bastien e Scapin

1.  **Condução:** Orientação imediata através de presteza, agrupamento visual claro por cartões de piloto, feedback imediato (< 50ms) e legibilidade numérica com tipografia tabular monoespaçada.
2.  **Carga de Trabalho:** Brevidade das ações (diagnóstico em menos de 5 segundos) e densidade informacional equilibrada sem necessidade de navegações profundas.
3.  **Controle Explícito:** Ações explícitas acionadas pelo usuário, controle de passo na simulação da Prova 4 e capacidade de Desfazer (Undo) e Restaurar o campeonato.
4.  **Adaptabilidade:** Aceleradores por atalhos de teclado (1-5, Espaço, ?), alternador de modo de persona (Técnico vs. Repórter) e temas visuais (Modo Escuro Pit Lane vs. Modo Claro Arquibancada).
5.  **Gestão de Erros:** Prevenção de erros com confirmações preventivas antes de restaurações de dados e trava da 5ª publicação no feed; mensagens compreensíveis e mecanismo de correção rápida.
6.  **Homogeneidade e Coerência:** Padrões uniformes de layout, paleta de cores semântica e vocabulário técnico consistente em toda a plataforma.
7.  **Significado dos Códigos e Denominações:** Dupla codificação semântica rigorosa (cor + ícone + texto explícito) e terminologia automobilística autêntica.
8.  **Compatibilidade:** Total conformidade com o ambiente hostil de operação do Técnico Beto na bancada de boxes e com as rotinas ágeis da Repórter Camila.

---

## 5. Fundamentação nas Dez Heurísticas de Usabilidade de Nielsen

1.  **Visibilidade do Estado do Sistema:** Indicadores dinâmicos de prova ativa, volta corrente (ex.: Volta 14/20) e estado da telemetria ao vivo.
2.  **Correspondência entre o Sistema e o Mundo Real:** Uso de parâmetros físicos e elétricos LiPo reais (volts, taxa de descarga, pit stop).
3.  **Controle e Liberdade do Usuário:** Liberdade total de navegação, ação de Desfazer (Undo) e restauração do estado determinístico com um clique.
4.  **Consistência e Padrões:** Respeito aos padrões de usabilidade web e consistência no formato de cronometragem.
5.  **Prevenção de Erros:** Confirmação protetora ao reiniciar o campeonato e prevenção na cota regulamentar.
6.  **Reconhecimento em vez de Memorização:** Tabelas de regras de pontos visíveis, cálculos automáticos de deltas e gaps.
7.  **Flexibilidade e Eficiência de Uso:** Atalhos de teclado para o especialista de box e navegação intuitiva por cliques para novatos.
8.  **Design Estético e Minimalista:** Telas sem ruído visual, focadas unicamente nos dados necessários para a tomada de decisão esportiva.
9.  **Ajudar os Usuários a Reconhecer, Diagnosticar e Recuperar-se de Erros:** Alertas de bateria com explicação de causa e indicação clara de ação corretiva.
10. **Ajuda e Documentação:** Modal rápido acessível via atalho `?` com regulamento oficial e lista de atalhos.
