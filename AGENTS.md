# Regras de Agentes e Instruções do Repositório (AGENTS.md)

## Identidade e Propósito
Este repositório contém a **Plataforma Digital Web para Campeonato de Corrida de Carros por Controle Remoto (RC)**, desenvolvida para a disciplina de Interação Humano-Computador (IHC) do IFCE Fortaleza.

A Dupla Web é composta por:
- **Matheus de Sousa Almeida** (Frente 1: Fundação SPA, Motor Determinístico, Shell/Temas, Dashboard Estratégico, Baterias/Catálogo, Concepção Persona 1 e Missões 1 a 3).
- **Vinícius Silva Pereira** (Frente 2: Central de Resultados, Classificação Geral, Feed de Corridas com cota 4/4, Boletim de Imprensa, Concepção Persona 2, Missões 4 a 6 e Parecer Técnico).

## Restrições de Branches e Git
- **Branches protegidas:** `main`, `master`, `homol`, `developer`, `staging`, `production`. **NUNCA** fazer commit direto ou push para essas branches.
- **Trabalho atual:** Deve ser realizado na branch `sandcastle/issue-2` (derivada de `feat/matheus`).
- **Commits:** Devem seguir o formato:
  1. Prefixo `RALPH:`
  2. Tarefa concluída + referência ao PRD (`#1`) e à Issue (`#2`)
  3. Decisões-chave tomadas
  4. Arquivos alterados
  5. Bloqueios ou notas para a próxima iteração

## Ciclo de Desenvolvimento (TDD / RGR)
1. **RED:** Escrever teste observável na costura pública (`ChampionshipStore` ou componente de UI).
2. **GREEN:** Escrever o código mínimo necessário para fazer o teste passar.
3. **REPEAT:** Repetir em fatias verticais (*tracer bullets*).
4. **REFACTOR:** Limpar o código mantendo os testes verdes.

## Comandos de Verificação
- Testes unitários e de integração: `npm test`
- Verificação de tipos e compilação: `npm run check` (executa `tsc --noEmit && vitest run`)
- Build de produção: `npm run build`
- Servidor de desenvolvimento local: `npm run dev`
