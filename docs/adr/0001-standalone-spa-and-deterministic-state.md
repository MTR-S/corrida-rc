# ADR 0001: Arquitetura Standalone SPA e Motor Determinístico com Seam de Armazenamento

## Status
Aceito

## Contexto
O projeto da plataforma digital para acompanhamento do Campeonato de Corrida RC deve atender a dois perfis exigentes (Técnico de Equipe Beto e Repórter Camila) em contexto de laboratório e avaliação cruzada presencial com a Dupla App. Não há infraestrutura de backend remoto garantida, e a avaliação requer um estado determinístico inicial fiel aos cenários descritos no edital (Provas 1 a 3 concluídas com desfecho dramático na Prova 3, Prova 4 ao vivo na volta 14 de 20 e Prova 5 agendada), persistência entre recarregamentos e capacidade de restauração com um clique (*Restaurar Dados da Avaliação*).

## Decisão
Construir a aplicação como uma Single Page Application (SPA) 100% client-side utilizando React, TypeScript, Vite e Tailwind CSS:
1. Toda a lógica de regras de negócio (pontuação, classificação com desempate e gap, telemetria de voltas, cálculo de autonomia de baterias, limites de publicação no feed e histórico de undo) fica concentrada em um único módulo profundo de domínio: o `ChampionshipStore`.
2. O `ChampionshipStore` é desacoplado de qualquer mecanismo de persistência por meio da costura (*seam*) da interface `StorageAdapter`.
3. Implementa-se dois adaptadores:
   - `LocalStorageAdapter`: para uso na aplicação em execução no navegador, garantindo persistência imediata e recarga sem perda de estado.
   - `InMemoryAdapter`: para a suíte de testes automatizados com Vitest, permitindo isolamento total e rapidez.
4. O estado inicial (seed determinístico) contém todas as 6 Equipes, 12 Pilotos, 5 Provas e histórico completo para permitir a execução imediata de todas as 6 Missões de Usabilidade.

## Consequências
- **Positivas:**
  - Zero dependência de rede ou infraestrutura de backend durante o desenvolvimento e a avaliação.
  - Testabilidade determinística completa: testes rodam em milissegundos sem mocks complexos de rede.
  - O usuário e os avaliadores podem modificar o estado (estratégia, troca de bateria, publicações) e restaurar o estado padrão a qualquer momento com garantia de integridade.
- **Negativas:**
  - Dados persistem apenas no navegador local do avaliador. Como o escopo é estritamente desktop/web client-side e avaliação cruzada local, essa limitação é intencional e adequada ao edital.
